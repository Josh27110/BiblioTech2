# app/admin/routes.py

from flask import Blueprint, jsonify
from app.models import db, Usuario, Rol, Prestamo, Multa # Asegúrate de que todos estén importados
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
import traceback # Para imprimir el traceback completo en caso de errores

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/api/v1/admin')

# --- FUNCIÓN DE AYUDA PARA VERIFICAR ROL DE ADMIN (MOVIDA AL INICIO) ---
# <<< ESTA FUNCIÓN HA SIDO MOVIDA AQUÍ >>>
def check_admin():
    user_id_str = get_jwt_identity() # user_id_str será un string porque así lo creamos en el token
    
    try:
        user_id_int = int(user_id_str) # Convertir a INT para la consulta a la base de datos
    except (ValueError, TypeError):
        print("DEBUG: check_admin - ID de usuario inválido en token.")
        return False

    user = db.session.get(Usuario, user_id_int) # Usar db.session.get para obtener el usuario por ID
    
    # Comprobación de rol. Asegúrate que 'Admin' sea el nombre exacto del rol en tu BD.
    if not user or not hasattr(user, 'rol') or not hasattr(user.rol, 'nombre') or user.rol.nombre != 'Admin':
        rol_db = user.rol.nombre if user and hasattr(user, 'rol') and hasattr(user.rol, 'nombre') else 'N/A'
        print(f"DEBUG: Acceso denegado en check_admin. User ID: {user_id_int}, Rol DB: {rol_db}. Rol requerido: Admin.")
        return False
    print(f"DEBUG: Acceso permitido en check_admin. User ID: {user_id_int}, Rol DB: {user.rol.nombre}.")
    return True
# <<< FIN DE LA FUNCIÓN MOVIDA >>>


@admin_bp.route('/panel/summary', methods=['GET'])
@jwt_required() # Decorador que requiere un JWT válido
def get_panel_summary():
    if not check_admin():
        return jsonify({"message": "Acceso restringido a administradores"}), 403
    
    try:
        total_usuarios = Usuario.query.count()
        
        usuarios_activos = Usuario.query.filter_by(estado='Activo').count() if hasattr(Usuario, 'estado') else total_usuarios
        
        prestamos_activos = Prestamo.query.filter_by(estado='Activo').count() # Asumo que Prestamo tiene campo 'estado'
        multas_pendientes = Multa.query.filter_by(estado='Pendiente').count() # Asumo que Multa tiene campo 'estado'

        lectores = Usuario.query.join(Rol).filter(Rol.nombre == 'Lector').count()
        bibliotecarios = Usuario.query.join(Rol).filter(Rol.nombre == 'Bibliotecario').count()
        administradores = Usuario.query.join(Rol).filter(Rol.nombre == 'Admin').count() # Asumo 'Admin' como nombre de rol en BD

        summary_data = {
            "totalUsuarios": total_usuarios,
            "usuariosActivos": usuarios_activos,
            "prestamosActivos": prestamos_activos,
            "multasPendientes": multas_pendientes,
            "lectores": lectores,
            "bibliotecarios": bibliotecarios,
            "administradores": administradores,
            "usuariosSuspendidos": Usuario.query.filter_by(estado='Suspendido').count() if hasattr(Usuario, 'estado') else 0,
            "usuariosInactivos": Usuario.query.filter_by(estado='Inactivo').count() if hasattr(Usuario, 'estado') else 0,
        }

        return jsonify(summary_data), 200

    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN get_panel_summary: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error al obtener el resumen del panel de administración", "error": str(e)}), 500


@admin_bp.route('/usuarios', methods=['GET'])
@jwt_required() # Decorador que requiere un JWT válido
def get_all_users():
    if not check_admin():
        return jsonify({"message": "Acceso restringido a administradores"}), 403

    try:
        usuarios = Usuario.query.order_by(Usuario.id).all()
        resultado = []
        for usuario in usuarios:
            prestamos_activos_count = 0
            prestamos_historicos_count = 0
            multas_pendientes_count = 0

            if hasattr(usuario, 'prestamos') and usuario.prestamos:
                prestamos_activos_count = sum(1 for p in usuario.prestamos if p.estado == 'Activo')
                prestamos_historicos_count = sum(1 for p in usuario.prestamos if p.estado != 'Activo')
                
                for prestamo in usuario.prestamos:
                    if hasattr(prestamo, 'multas') and prestamo.multas:
                        multas_pendientes_count += sum(1 for m in prestamo.multas if m.estado == 'Pendiente')

            user_data = {
                "id": usuario.id,
                "nombre": getattr(usuario, 'nombre', ''),
                "apellidoPaterno": getattr(usuario, 'apellido_paterno', ''),
                "apellidoMaterno": getattr(usuario, 'apellido_materno', ''),
                "email": getattr(usuario, 'email', ''),
                "rol": usuario.rol.nombre if hasattr(usuario, 'rol') and hasattr(usuario.rol, 'nombre') else 'Desconocido',
                
                "estado": getattr(usuario, 'estado', 'Activo'), # Proporciona 'Activo' si no existe el campo 'estado'
                
                "fechaRegistro": usuario.fecha_registro.isoformat() if hasattr(usuario, 'fecha_registro') and usuario.fecha_registro else None,
                
                "ultimoAcceso": None, # No existe en tu modelo Usuario
                "numeroUsuario": None, # No existe en tu modelo Usuario
                "avatar": None, # No existe en tu modelo Usuario
                
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
        db.session.rollback()
        print(f"ERROR EN get_all_users: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error al obtener la lista de usuarios", "error": str(e)}), 500