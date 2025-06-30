# /app/admin/routes.py

from flask import Blueprint, jsonify
from app.models import db, Usuario, Rol
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/api/v1/admin')

# --- FUNCIÓN DE AYUDA PARA VERIFICAR ROL DE ADMIN ---
# (Podríamos mover esto a un decorador personalizado más adelante)
def check_admin():
    user_id = get_jwt_identity()
    user = db.session.get(Usuario, user_id)
    if not user or user.rol.nombre != 'Administrador':
        return False
    return True

@admin_bp.route('/usuarios', methods=['GET'])
@jwt_required()
def get_all_users():
    """
    Endpoint para obtener la lista de todos los usuarios.
    Protegido para que solo un Administrador pueda acceder.
    """
    if not check_admin():
        return jsonify({"message": "Acceso restringido a administradores"}), 403

    try:
        usuarios = Usuario.query.order_by(Usuario.id).all()
        resultado = []
        for usuario in usuarios:
            user_data = {
                "id": usuario.id,
                "nombre": f"{usuario.nombre} {usuario.apellido_paterno} {usuario.apellido_materno or ''}".strip(),
                "email": usuario.email,
                "rol": usuario.rol.nombre
                # Añade aquí cualquier otro campo que quieras mostrar en la tabla
            }
            resultado.append(user_data)
        
        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"message": "Error al obtener la lista de usuarios", "error": str(e)}), 500