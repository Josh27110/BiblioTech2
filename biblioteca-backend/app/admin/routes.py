# app/admin/routes.py

from flask import Blueprint, jsonify, request # Importar 'request' para acceder a los datos de la solicitud
from app.models import db, Usuario, Rol, Prestamo, Multa # Asegúrate de que todos los modelos estén importados aquí
from flask_jwt_extended import jwt_required, get_jwt_identity # Importar para proteger las rutas
from sqlalchemy import func # Importar func para funciones de agregación SQL
from datetime import datetime # Importar datetime para manejar fechas
import traceback # Para imprimir el traceback completo en caso de errores

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/api/v1/admin')

# --- FUNCIÓN DE AYUDA PARA VERIFICAR ROL DE ADMIN ---
# Esta función verifica si el usuario autenticado tiene el rol de "Admin".
def check_admin():
    user_id_str = get_jwt_identity() # Obtiene la identidad del usuario del token JWT (que es un string)
    
    try:
        user_id_int = int(user_id_str) # Intenta convertir la identidad a INT para buscar en la BD
    except (ValueError, TypeError):
        print("DEBUG: check_admin - ID de usuario inválido en token.")
        return False

    user = db.session.get(Usuario, user_id_int) # Busca el usuario por ID en la base de datos
    
    # Comprueba si el usuario existe y si su rol es "Admin"
    # Se usa hasattr para verificar si los atributos 'rol' y 'nombre' existen antes de acceder a ellos.
    if not user or not hasattr(user, 'rol') or not hasattr(user.rol, 'nombre') or user.rol.nombre != 'Admin':
        rol_db = user.rol.nombre if user and hasattr(user, 'rol') and hasattr(user.rol, 'nombre') else 'N/A'
        print(f"DEBUG: Acceso denegado en check_admin. User ID: {user_id_int}, Rol DB: {rol_db}. Rol requerido: Admin.")
        return False
    print(f"DEBUG: Acceso permitido en check_admin. User ID: {user_id_int}, Rol DB: {user.rol.nombre}.")
    return True

# --- ENDPOINT: RESUMEN DEL PANEL DE ADMINISTRACIÓN ---
# Devuelve estadísticas generales para el dashboard del administrador.
@admin_bp.route('/panel/summary', methods=['GET'])
@jwt_required() # Requiere un token JWT válido
def get_panel_summary():
    # Verifica si el usuario tiene permisos de administrador
    if not check_admin():
        return jsonify({"message": "Acceso restringido a administradores"}), 403
    
    try:
        total_usuarios = Usuario.query.count() # Cuenta el total de usuarios
        
        # Conteo de usuarios activos. Si el modelo Usuario tiene un campo 'estado', úsalo.
        # Si no, se considera que todos los usuarios existentes son "activos" por defecto.
        usuarios_activos = Usuario.query.filter_by(estado='Activo').count() if hasattr(Usuario, 'estado') else total_usuarios
        
        # Conteo de préstamos activos (asumiendo que el modelo Prestamo tiene un campo 'estado')
        prestamos_activos = Prestamo.query.filter_by(estado='Activo').count()

        # Conteo de multas pendientes (asumiendo que el modelo Multa tiene un campo 'estado')
        multas_pendientes = Multa.query.filter_by(estado='Pendiente').count()

        # Conteo de usuarios por rol, uniéndose a la tabla Rol
        lectores = Usuario.query.join(Rol).filter(Rol.nombre == 'Lector').count()
        bibliotecarios = Usuario.query.join(Rol).filter(Rol.nombre == 'Bibliotecario').count()
        administradores = Usuario.query.join(Rol).filter(Rol.nombre == 'Admin').count() # Asume 'Admin' como el nombre de rol en tu BD

        # Conteo de usuarios suspendidos/inactivos (si el modelo Usuario tiene un campo 'estado')
        usuarios_suspendidos = Usuario.query.filter_by(estado='Suspendido').count() if hasattr(Usuario, 'estado') else 0
        usuarios_inactivos = Usuario.query.filter_by(estado='Inactivo').count() if hasattr(Usuario, 'estado') else 0


        summary_data = {
            "totalUsuarios": total_usuarios,
            "usuariosActivos": usuarios_activos,
            "prestamosActivos": prestamos_activos,
            "multasPendientes": multas_pendientes,
            "lectores": lectores,
            "bibliotecarios": bibliotecarios,
            "administradores": administradores,
            "usuariosSuspendidos": usuarios_suspendidos,
            "usuariosInactivos": usuarios_inactivos,
        }

        return jsonify(summary_data), 200

    except Exception as e:
        db.session.rollback() # Deshacer cualquier cambio pendiente en la sesión de la base de datos
        print(f"ERROR EN get_panel_summary: {e}")
        traceback.print_exc() # Imprimir el traceback completo para depuración
        return jsonify({"message": "Error al obtener el resumen del panel de administración", "error": str(e)}), 500

# --- ENDPOINT: LISTAR TODOS LOS USUARIOS ---
# Devuelve una lista detallada de todos los usuarios registrados.
@admin_bp.route('/usuarios', methods=['GET'])
@jwt_required() # Requiere un token JWT válido
def get_all_users():
    # Verifica si el usuario tiene permisos de administrador
    if not check_admin():
        return jsonify({"message": "Acceso restringido a administradores"}), 403

    try:
        usuarios = Usuario.query.order_by(Usuario.id).all() # Obtiene todos los usuarios, ordenados por ID
        resultado = []
        for usuario in usuarios:
            # Inicializar contadores para evitar errores si las relaciones no existen o están vacías
            prestamos_activos_count = 0
            prestamos_historicos_count = 0
            multas_pendientes_count = 0

            # Contar préstamos y multas si la relación 'prestamos' existe y no está vacía
            if hasattr(usuario, 'prestamos') and usuario.prestamos:
                # Filtrar en Python los objetos Prestamo ya cargados por SQLAlchemy
                prestamos_activos_count = sum(1 for p in usuario.prestamos if p.estado == 'Activo')
                prestamos_historicos_count = sum(1 for p in usuario.prestamos if p.estado != 'Activo')
                
                # Iterar sobre las multas de cada préstamo para sumar las pendientes
                for prestamo in usuario.prestamos:
                    if hasattr(prestamo, 'multas') and prestamo.multas:
                        multas_pendientes_count += sum(1 for m in prestamo.multas if m.estado == 'Pendiente')

            user_data = {
                "id": usuario.id,
                # Usar getattr para acceder a atributos que podrían ser opcionales o None
                "nombre": getattr(usuario, 'nombre', ''),
                "apellidoPaterno": getattr(usuario, 'apellido_paterno', ''),
                "apellidoMaterno": getattr(usuario, 'apellido_materno', ''),
                "email": getattr(usuario, 'email', ''),
                # Obtener el nombre del rol. Asegurarse que 'rol' y 'nombre' existen en el objeto.
                "rol": usuario.rol.nombre if hasattr(usuario, 'rol') and hasattr(usuario.rol, 'nombre') else 'Desconocido',
                
                # 'estado' del usuario: Asumiendo "Activo" si no hay campo 'estado' en models.py
                "estado": getattr(usuario, 'estado', 'Activo'), 
                
                # Formatear fechas a ISO 8601 si los campos existen y tienen valor
                "fechaRegistro": usuario.fecha_registro.isoformat() if hasattr(usuario, 'fecha_registro') and usuario.fecha_registro else None,
                
                # Campos que no existen en tu modelo Usuario según models.py, se devuelven como None
                "ultimoAcceso": None, 
                "numeroUsuario": None, 
                "avatar": None, 
                
                # Campos que sí existen en models.py
                "telefono": getattr(usuario, 'telefono', None),
                "direccion": getattr(usuario, 'direccion', None),
                "fechaNacimiento": usuario.fecha_nacimiento.isoformat() if hasattr(usuario, 'fecha_nacimiento') and usuario.fecha_nacimiento else None,
                "genero": getattr(usuario, 'genero', None),

                "prestamosActivos": prestamos_activos_count,
                "prestamosHistoricos": prestamos_historicos_count,
                "multasPendientes": multas_pendientes_count,
            }
            resultado.append(user_data)
        
        return jsonify(resultado), 200

    except Exception as e:
        db.session.rollback() # Deshacer la transacción en caso de error
        print(f"ERROR EN get_all_users: {e}")
        traceback.print_exc() # Imprimir el traceback completo para depuración
        return jsonify({"message": "Error al obtener la lista de usuarios", "error": str(e)}), 500

# --- ENDPOINT: AGREGAR NUEVO USUARIO (POST) ---
# Permite a un administrador crear un nuevo usuario en el sistema.
@admin_bp.route('/usuarios', methods=['POST'])
@jwt_required()
def add_user():
    # Verifica si el usuario tiene permisos de administrador
    if not check_admin():
        return jsonify({"message": "Acceso restringido a administradores"}), 403

    data = request.get_json() # Obtiene los datos JSON de la solicitud

    # Validación de campos obligatorios
    required_fields = ['nombre', 'apellidoPaterno', 'email', 'password', 'rol']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"message": f"El campo '{field}' es obligatorio"}), 400

    # Verificar si el email ya existe en la base de datos
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({"message": "El email ya está registrado"}), 409 # 409 Conflict

    try:
        # Obtener el objeto Rol basado en el nombre de rol proporcionado
        rol = Rol.query.filter_by(nombre=data['rol']).first()
        if not rol:
            return jsonify({"message": f"El rol '{data['rol']}' no es válido"}), 400

        # Crear una nueva instancia de Usuario con los datos recibidos
        nuevo_usuario = Usuario(
            nombre=data['nombre'],
            apellido_paterno=data['apellidoPaterno'],
            apellido_materno=data.get('apellidoMaterno'), # Es opcional, se obtiene con .get()
            email=data['email'],
            rol_id=rol.id, # Asigna el ID del rol encontrado
            
            # Campos opcionales del perfil que existen en models.py
            fecha_nacimiento=datetime.strptime(data['fechaNacimiento'], '%Y-%m-%d').date() if data.get('fechaNacimiento') else None,
            telefono=data.get('telefono'),
            direccion=data.get('direccion'),
            genero=data.get('genero')
            # Si el campo 'estado' se añadió a Usuario en models.py, incluirlo aquí:
            # estado=data.get('estado', 'Activo') 
        )
        # Establecer la contraseña usando el método del modelo Usuario
        nuevo_usuario.set_password(data['password'])

        db.session.add(nuevo_usuario) # Añadir el nuevo usuario a la sesión
        db.session.commit() # Guardar los cambios en la base de datos

        # Después de commit, nuevo_usuario.id tendrá el ID asignado por la BD
        return jsonify({"message": "Usuario creado exitosamente", "user_id": nuevo_usuario.id}), 201 # 201 Created

    except Exception as e:
        db.session.rollback() # Deshacer la transacción en caso de error
        print(f"ERROR EN add_user: {e}")
        traceback.print_exc() # Imprimir el traceback completo para depuración
        return jsonify({"message": "Error interno del servidor al crear usuario", "error": str(e)}), 500

# --- ENDPOINT: EDITAR USUARIO (PUT/PATCH) ---
# Permite a un administrador actualizar los datos de un usuario existente.
@admin_bp.route('/usuarios/<int:user_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_user(user_id):
    if not check_admin():
        return jsonify({"message": "Acceso restringido a administradores"}), 403

    data = request.get_json()
    user_to_update = db.session.get(Usuario, user_id) # Busca el usuario por su ID

    if not user_to_update:
        return jsonify({"message": "Usuario no encontrado"}), 404

    try:
        # Actualizar campos básicos
        user_to_update.nombre = data.get('nombre', user_to_update.nombre)
        user_to_update.apellido_paterno = data.get('apellidoPaterno', user_to_update.apellido_paterno)
        user_to_update.apellido_materno = data.get('apellidoMaterno', user_to_update.apellido_materno)
        user_to_update.email = data.get('email', user_to_update.email)

        # Si el email se cambia, verificar que no exista ya
        if 'email' in data and data['email'] != user_to_update.email:
            if Usuario.query.filter(Usuario.email == data['email'], Usuario.id != user_id).first():
                return jsonify({"message": "El nuevo email ya está registrado por otro usuario"}), 409

        # Actualizar rol si se proporciona
        if 'rol' in data:
            new_rol_name = data['rol']
            rol_obj = Rol.query.filter_by(nombre=new_rol_name).first()
            if not rol_obj:
                return jsonify({"message": f"El rol '{new_rol_name}' no es válido"}), 400
            user_to_update.rol_id = rol_obj.id

        # Actualizar campos opcionales del perfil
        user_to_update.telefono = data.get('telefono', user_to_update.telefono)
        user_to_update.direccion = data.get('direccion', user_to_update.direccion)
        user_to_update.genero = data.get('genero', user_to_update.genero)
        
        # Actualizar fecha de nacimiento
        if 'fechaNacimiento' in data and data['fechaNacimiento'] is not None:
            user_to_update.fecha_nacimiento = datetime.strptime(data['fechaNacimiento'], '%Y-%m-%d').date()
        elif 'fechaNacimiento' in data and data['fechaNacimiento'] is None: # Permite borrar la fecha
             user_to_update.fecha_nacimiento = None

        # Si el campo 'estado' se añadió a Usuario en models.py, actualizarlo aquí:
        if hasattr(user_to_update, 'estado') and 'estado' in data:
            user_to_update.estado = data['estado']


        db.session.commit() # Guardar los cambios

        return jsonify({"message": "Usuario actualizado exitosamente", "user_id": user_to_update.id}), 200

    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN update_user: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error interno del servidor al actualizar usuario", "error": str(e)}), 500

# --- ENDPOINT: ELIMINAR USUARIO (DELETE) ---
# Permite a un administrador eliminar un usuario existente.
@admin_bp.route('/usuarios/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    if not check_admin():
        return jsonify({"message": "Acceso restringido a administradores"}), 403

    user_to_delete = db.session.get(Usuario, user_id) # Busca el usuario por su ID

    if not user_to_delete:
        return jsonify({"message": "Usuario no encontrado"}), 404

    try:
        # Regla de negocio: No se puede eliminar un usuario con préstamos activos o multas pendientes.
        # Asumo que las relaciones 'prestamos' y 'multas' en Usuario/Prestamo/Multa funcionan para esto.
        # Si estas relaciones están configuradas correctamente con cascade delete, se borrarán.
        # Sin embargo, la regla de negocio sugiere evitar la eliminación si hay activos.

        # Verificar préstamos activos
        if hasattr(user_to_delete, 'prestamos') and user_to_delete.prestamos.filter_by(estado='Activo').first():
            return jsonify({"message": "No se puede eliminar el usuario: tiene préstamos activos."}), 409

        # Verificar multas pendientes (si Multa está relacionada directamente con Usuario o a través de Prestamo)
        # Si Multa tiene id_usuario:
        # if Multa.query.filter_by(id_usuario=user_id, estado='Pendiente').first():
        #     return jsonify({"message": "No se puede eliminar el usuario: tiene multas pendientes."}), 409
        
        # Si Multa está relacionada solo con Prestamo (como en models.py):
        # Necesitamos verificar si los préstamos del usuario tienen multas pendientes.
        has_pending_multas = False
        if hasattr(user_to_delete, 'prestamos') and user_to_delete.prestamos:
            for prestamo in user_to_delete.prestamos:
                if hasattr(prestamo, 'multas') and prestamo.multas.filter_by(estado='Pendiente').first():
                    has_pending_multas = True
                    break
        if has_pending_multas:
            return jsonify({"message": "No se puede eliminar el usuario: tiene multas pendientes."}), 409


        db.session.delete(user_to_delete) # Eliminar el usuario
        db.session.commit() # Guardar los cambios

        return jsonify({"message": "Usuario eliminado exitosamente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN delete_user: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error interno del servidor al eliminar usuario", "error": str(e)}), 500