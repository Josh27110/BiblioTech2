# app/bibliotecario/routes.py

from flask import Blueprint, jsonify, request
from app.models import db, Usuario, Rol, Prestamo, Multa, Libro, Solicitud # Asegúrate de importar todos los modelos necesarios
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import datetime, timedelta # Importar datetime y timedelta
import traceback # Para imprimir el traceback completo en caso de errores

bibliotecario_bp = Blueprint('bibliotecario_bp', __name__, url_prefix='/api/v1/bibliotecario')

# --- FUNCIÓN DE AYUDA PARA VERIFICAR ROL DE BIBLIOTECARIO ---
# Esta función verifica si el usuario autenticado tiene el rol de "Bibliotecario".
def check_bibliotecario():
    user_id_str = get_jwt_identity() # Obtiene la identidad del usuario del token JWT (que es un string)
    try:
        user_id_int = int(user_id_str) # Intenta convertir la identidad a INT para buscar en la BD
    except (ValueError, TypeError):
        print("DEBUG: check_bibliotecario - ID de usuario inválido en token.")
        return False
    
    user = db.session.get(Usuario, user_id_int) # Busca el usuario por ID en la base de datos
    
    # Comprueba si el usuario existe y si su rol es "Bibliotecario"
    # Se usa hasattr para verificar si los atributos 'rol' y 'nombre' existen antes de acceder a ellos.
    if not user or not hasattr(user, 'rol') or not hasattr(user.rol, 'nombre') or user.rol.nombre != 'Bibliotecario':
        rol_db = user.rol.nombre if user and hasattr(user, 'rol') and hasattr(user.rol, 'nombre') else 'N/A'
        print(f"DEBUG: Acceso denegado en check_bibliotecario. User ID: {user_id_int}, Rol DB: {rol_db}. Rol requerido: Bibliotecario.")
        return False
    print(f"DEBUG: Acceso permitido en check_bibliotecario. User ID: {user_id_int}, Rol DB: {user.rol.nombre}.")
    return True

# --- ENDPOINT: RESUMEN DEL PANEL DE BIBLIOTECARIO ---
# Devuelve estadísticas generales para el dashboard del bibliotecario.
@bibliotecario_bp.route('/panel/summary', methods=['GET'])
@jwt_required() # Requiere un token JWT válido
def get_bibliotecario_summary():
    if not check_bibliotecario():
        return jsonify({"message": "Acceso restringido a bibliotecarios"}), 403
    
    try:
        # Préstamos Pendientes de Autorización (Solicitudes con estado 'Pendiente')
        prestamos_pendientes_autorizacion = Solicitud.query.filter_by(estado='Pendiente').count()

        # Multas Activas (Multas con estado 'Pendiente')
        multas_activas = Multa.query.filter_by(estado='Pendiente').count()

        # Libros en Catálogo (Total de entradas en la tabla Libro)
        libros_en_catalogo = Libro.query.count()

        # Copias Disponibles (Suma de la 'cantidad' de todos los libros)
        copias_disponibles = db.session.query(func.sum(Libro.cantidad)).scalar() or 0
        
        summary_data = {
            "prestamosPendientes": prestamos_pendientes_autorizacion,
            "multasActivas": multas_activas,
            "librosEnCatalogo": libros_en_catalogo,
            "copiasDisponibles": copias_disponibles,
        }

        return jsonify(summary_data), 200

    except Exception as e:
        db.session.rollback() # Deshacer cualquier cambio pendiente en la sesión de la base de datos
        print(f"ERROR EN get_bibliotecario_summary: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error al obtener el resumen del panel del bibliotecario", "error": str(e)}), 500

# --- ENDPOINT: PRÉSTAMOS PENDIENTES DE AUTORIZACIÓN ---
# Devuelve una lista de solicitudes de préstamo que están pendientes de aprobación.
@bibliotecario_bp.route('/prestamos-pendientes', methods=['GET'])
@jwt_required()
def get_pending_loans():
    if not check_bibliotecario():
        return jsonify({"message": "Acceso restringido a bibliotecarios"}), 403

    try:
        solicitudes = Solicitud.query.filter_by(estado='Pendiente').all()
        
        resultado = []
        for sol in solicitudes:
            # Asegúrate de que sol.lector exista antes de acceder a sus atributos
            lector_data = {
                "id": sol.lector.id if sol.lector else None,
                "nombre": f"{sol.lector.nombre} {sol.lector.apellido_paterno}".strip() if sol.lector else "Desconocido",
                "email": sol.lector.email if sol.lector else "Desconocido",
            } if sol.lector else None

            libros_solicitados = []
            if hasattr(sol, 'libros') and sol.libros:
                for libro_sol in sol.libros:
                    libros_solicitados.append({
                        "id": libro_sol.id,
                        "nombre": libro_sol.nombre,
                        "isbn": libro_sol.isbn,
                    })
            
            resultado.append({
                "id": sol.id,
                "usuario": lector_data,
                "fechaSolicitud": sol.fecha_solicitud.isoformat() if sol.fecha_solicitud else None,
                "estado": sol.estado,
                "libros": libros_solicitados
            })
        
        return jsonify(resultado), 200

    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN get_pending_loans: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error al obtener préstamos pendientes", "error": str(e)}), 500

# --- ENDPOINT: APROBAR SOLICITUD DE PRÉSTAMO (POST) ---
# Este endpoint permite a un bibliotecario aprobar una solicitud de préstamo pendiente.
# Implica actualizar el estado de la Solicitud y crear una entrada en la tabla Prestamo.
@bibliotecario_bp.route('/solicitudes/<int:solicitud_id>/aprobar', methods=['POST'])
@jwt_required()
def aprobar_solicitud(solicitud_id):
    if not check_bibliotecario():
        return jsonify({"message": "Acceso restringido a bibliotecarios"}), 403
    
    try:
        solicitud = db.session.get(Solicitud, solicitud_id)
        if not solicitud:
            return jsonify({"message": "Solicitud no encontrada"}), 404
        if solicitud.estado != 'Pendiente':
            return jsonify({"message": "La solicitud no está en estado pendiente"}), 400
        
        # Lógica para verificar disponibilidad de copias
        if not solicitud.libros or len(solicitud.libros) == 0:
            return jsonify({"message": "La solicitud no tiene libros asociados."}), 400
        
        for libro_solicitado_en_solicitud in solicitud.libros:
            if libro_solicitado_en_solicitud.cantidad <= 0:
                return jsonify({"message": f"Libro '{libro_solicitado_en_solicitud.nombre}' no tiene copias disponibles."}), 409 # Conflict si no hay copias

        # Actualizar el estado de la Solicitud
        solicitud.estado = 'Aprobada'

        # Crear una entrada en la tabla Prestamo por CADA libro solicitado
        fecha_inicio_prestamo = datetime.utcnow()
        # Regla de negocio: fecha_devolucion_limite a 15 días (RN-02)
        fecha_devolucion_limite_prestamo = fecha_inicio_prestamo + timedelta(days=15)
        
        for libro_a_prestar in solicitud.libros:
            # Crear el objeto Prestamo
            nuevo_prestamo = Prestamo(
                id_solicitud=solicitud.id, # Vincula el préstamo a la solicitud
                id_usuario=solicitud.id_usuario_lector, # El usuario que hizo la solicitud
                fecha_inicio=fecha_inicio_prestamo,
                fecha_devolucion_limite=fecha_devolucion_limite_prestamo,
                estado='Activo' # El préstamo se inicia como activo
            )
            db.session.add(nuevo_prestamo)
            
            # Disminuir la cantidad de copias disponibles del libro en el catálogo
            libro_a_prestar.cantidad -= 1
            # Asegurar que la cantidad no sea negativa
            if libro_a_prestar.cantidad < 0:
                libro_a_prestar.cantidad = 0

        db.session.commit() # Guardar todos los cambios en la base de datos

        return jsonify({"message": "Solicitud aprobada y préstamo(s) creado(s) exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN aprobar_solicitud: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error al aprobar solicitud", "error": str(e)}), 500


# --- ENDPOINT: RECHAZAR SOLICITUD DE PRÉSTAMO (POST) ---
# Este endpoint permite a un bibliotecario rechazar una solicitud de préstamo pendiente.
@bibliotecario_bp.route('/solicitudes/<int:solicitud_id>/rechazar', methods=['POST'])
@jwt_required()
def rechazar_solicitud(solicitud_id):
    if not check_bibliotecario():
        return jsonify({"message": "Acceso restringido a bibliotecarios"}), 403
    
    try:
        solicitud = db.session.get(Solicitud, solicitud_id)
        if not solicitud:
            return jsonify({"message": "Solicitud no encontrada"}), 404
        if solicitud.estado != 'Pendiente':
            return jsonify({"message": "La solicitud no está en estado pendiente"}), 400
        
        solicitud.estado = 'Rechazada' # Simplemente cambia el estado a 'Rechazada'
        db.session.commit()
        return jsonify({"message": "Solicitud rechazada exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN rechazar_solicitud: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error al rechazar solicitud", "error": str(e)}), 500


# --- ENDPOINT: GESTIÓN DE MULTAS (Listar Multas Activas/Pendientes para Bibliotecario) ---
# Este endpoint listará las multas que el bibliotecario necesita gestionar.
@bibliotecario_bp.route('/multas', methods=['GET'])
@jwt_required()
def get_active_fines():
    if not check_bibliotecario():
        return jsonify({"message": "Acceso restringido a bibliotecarios"}), 403
    
    try:
        # Obtener todas las multas que están 'Pendiente'
        multas = Multa.query.filter_by(estado='Pendiente').all()
        
        resultado = []
        for multa in multas:
            # Necesitamos obtener información del usuario y del libro asociado a la multa
            # Se asume que Multa tiene una relación con Prestamo, y Prestamo con Usuario/Libro
            prestamo = multa.prestamo_origen # nombre del backref en models.py
            
            user_data = None
            book_data = None
            
            if prestamo:
                if hasattr(prestamo, 'usuario_prestamo') and prestamo.usuario_prestamo: # backref en models.py
                    user_data = {
                        "id": prestamo.usuario_prestamo.id,
                        "nombre": f"{prestamo.usuario_prestamo.nombre} {prestamo.usuario_prestamo.apellido_paterno}".strip(),
                        "email": prestamo.usuario_prestamo.email
                    }
                # Si un préstamo puede tener múltiples libros, o si un libro es el "principal"
                # Esta parte podría necesitar más lógica si un préstamo no tiene un solo libro claro.
                if hasattr(prestamo.solicitud_origen, 'libros') and prestamo.solicitud_origen.libros:
                    # Asumiendo el primer libro de la solicitud si hay varios, o ajusta la lógica
                    main_book = prestamo.solicitud_origen.libros[0] 
                    book_data = {
                        "id": main_book.id,
                        "nombre": main_book.nombre,
                        "isbn": main_book.isbn
                    }
            
            resultado.append({
                "id": multa.id,
                "monto": multa.monto,
                "fechaGeneracion": multa.fecha_generacion.isoformat() if multa.fecha_generacion else None,
                "estado": multa.estado,
                "usuario": user_data,
                "libro": book_data,
                "idPrestamo": multa.id_prestamo,
                # Calcula 'diasRetraso' en el frontend o aquí si tienes la fecha de devolución real/limite
                # Para calcular diasRetraso aquí: (datetime.utcnow() - prestamo.fecha_devolucion_limite).days
            })
        
        return jsonify(resultado), 200

    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN get_active_fines: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error al obtener multas activas", "error": str(e)}), 500

# --- ENDPOINT: PROCESAR PAGO/CONDONACIÓN DE MULTA (POST) ---
# Este endpoint permite al bibliotecario marcar una multa como pagada o condonarla.
@bibliotecario_bp.route('/multas/<int:multa_id>/procesar', methods=['POST'])
@jwt_required()
def process_fine(multa_id):
    if not check_bibliotecario():
        return jsonify({"message": "Acceso restringido a bibliotecarios"}), 403
    
    data = request.get_json()
    action = data.get('action') # 'pagar' o 'condonar'
    
    if action not in ['pagar', 'condonar']:
        return jsonify({"message": "Acción no válida. Use 'pagar' o 'condonar'."}), 400

    multa = db.session.get(Multa, multa_id)
    if not multa:
        return jsonify({"message": "Multa no encontrada"}), 404
    if multa.estado != 'Pendiente':
        return jsonify({"message": "La multa ya no está pendiente"}), 400
    
    try:
        if action == 'pagar':
            multa.estado = 'Pagada'
            message = "Multa marcada como pagada exitosamente"
        elif action == 'condonar':
            multa.estado = 'Condonada' # Podrías tener un estado 'Condonada' en tu modelo Multa
            message = "Multa condonada exitosamente"
        
        db.session.commit()
        return jsonify({"message": message}), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN process_fine: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error al procesar multa", "error": str(e)}), 500
