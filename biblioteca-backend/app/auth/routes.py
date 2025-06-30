# /app/auth/routes.py

from flask import Blueprint, request, jsonify
from app.models import db, Usuario
from flask_jwt_extended import create_access_token
from datetime import datetime

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Faltan el email y la contraseña"}), 400

    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({"message": "El correo electrónico ya está registrado"}), 409

    try:
        # Extraemos la contraseña para manejarla por separado
        password = data.pop('password')
        
        # Convertimos la fecha de string a objeto Date si existe
        if 'fecha_nacimiento' in data and data['fecha_nacimiento']:
            data['fecha_nacimiento'] = datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date()

        # --- LÓGICA CORREGIDA Y SIMPLIFICADA ---
        # Creamos el usuario pasando todos los datos del formulario directamente.
        # SQLAlchemy asignará automáticamente cada campo al modelo correspondiente.
        nuevo_usuario = Usuario(**data, rol_id=1) # rol_id=1 para Lector
        
        # Encriptamos y asignamos la contraseña
        nuevo_usuario.set_password(password)
        
        db.session.add(nuevo_usuario)
        db.session.commit()
        
        return jsonify({"message": "Usuario registrado exitosamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Ocurrió un error al registrar el usuario", "error": str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Faltan el email y la contraseña"}), 400

    user = Usuario.query.filter_by(email=data.get('email')).first()

    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=user.id, additional_claims={'rol': user.rol.nombre})
        return jsonify(
            access_token=access_token,
            user={
                "id": user.id,
                "rol": user.rol.nombre,
                "nombreCompleto": f"{user.nombre} {user.apellido_paterno}".strip()
            }
        ), 200

    return jsonify({"message": "Credenciales inválidas"}), 401