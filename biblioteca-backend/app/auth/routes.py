# app/auth/routes.py

from flask import Blueprint, request, jsonify
from app.models import db, Usuario # Asegúrate de que Usuario está importado
from flask_jwt_extended import create_access_token # Asegúrate de que create_access_token está importado
from datetime import datetime
# Importaciones necesarias para el hashing de contraseña si Usuario.set_password/check_password las usan
# from app import bcrypt # Si tu modelo Usuario usa bcrypt de la instancia global

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    # ... (tu código de registro existente)
    pass # Reemplaza con tu código real de registro

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Faltan el email y la contraseña"}), 400

    user = Usuario.query.filter_by(email=data.get('email')).first()

    # Asumo que user.check_password está bien definido en tu modelo Usuario
    # y maneja el hashing de contraseña.
    if user and user.check_password(data.get('password')):
        # --- CAMBIO CRUCIAL AQUÍ ---
        # Convertimos user.id a string para la identidad del token
        access_token = create_access_token(identity=str(user.id), additional_claims={'rol': user.rol.nombre})
        # --- FIN DEL CAMBIO ---

        return jsonify(
            access_token=access_token,
            user={
                "id": user.id,
                "rol": user.rol.nombre, # Asumo que user.rol es un objeto con un atributo 'nombre'
                "nombreCompleto": f"{user.nombre} {user.apellido_paterno}".strip()
            }
        ), 200

    return jsonify({"message": "Credenciales inválidas"}), 401