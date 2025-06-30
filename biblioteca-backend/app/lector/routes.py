# /app/lector/routes.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Usuario, Prestamo, Multa # Importamos los modelos que necesitamos

# Creamos el nuevo blueprint
lector_bp = Blueprint('lector', __name__)

@lector_bp.route('/panel/summary', methods=['GET'])
@jwt_required() # ¡Esta línea protege la ruta!
def get_panel_summary():
    # Obtenemos la identidad (el ID) del usuario desde el token JWT
    current_user_id = get_jwt_identity()
    
    # Buscamos al usuario en la base de datos
    usuario = Usuario.query.get(current_user_id)
    if not usuario:
        return jsonify({"message": "Usuario no encontrado"}), 404

    # Calculamos las estadísticas
    try:
        prestamos_activos = Prestamo.query.filter_by(id_usuario=current_user_id, estado='Activo').count()
        multas_activas = Multa.query.join(Prestamo).filter(
            Prestamo.id_usuario == current_user_id, 
            Multa.estado == 'Pendiente'
        ).count()
        # ... aquí podríamos añadir más cálculos en el futuro ...

        # Creamos el objeto JSON de respuesta
        summary_data = {
            "nombreCompleto": f"{usuario.nombre} {usuario.apellido_paterno}",
            "prestamosActivos": prestamos_activos,
            "multasActivas": multas_activas,
            "reservasPendientes": 0, # Placeholder por ahora
            "totalPrestados": 0,    # Placeholder por ahora
        }

        return jsonify(summary_data), 200

    except Exception as e:
        return jsonify({'message': 'Error al calcular el resumen del panel', 'error': str(e)}), 500