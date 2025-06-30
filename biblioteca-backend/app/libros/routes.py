# app/libros/routes.py

from flask import Blueprint, jsonify, request
from app.models import db, Libro, Autor, Genero # Asegúrate de que todos los modelos estén importados
from flask_jwt_extended import jwt_required, get_jwt_identity # Importar para proteger rutas
from sqlalchemy import func # Importar func para funciones de agregación SQL (si se necesitan)
import traceback # Para imprimir el traceback completo en caso de errores

libros_bp = Blueprint('libros', __name__)

# --- ENDPOINT: OBTENER LISTA DE LIBROS ---
# <<< CAMBIO CRUCIAL AQUÍ: Definir la ruta para ambas versiones (con y sin barra final) >>>
@libros_bp.route('', methods=['GET']) # Para /api/v1/libros
@libros_bp.route('/', methods=['GET']) # Para /api/v1/libros/
@jwt_required() # Asegúrate de proteger esta ruta si el catálogo público lo requiere
def get_libros():
    try:
        libros = Libro.query.all()
        resultado = []
        for libro in libros:
            # Asegúrate de que 'autores' y 'generos' sean relaciones y los campos existan
            autores_nombres = [f"{autor.nombre} {getattr(autor, 'ap_paterno', '')}".strip() for autor in libro.autores] if hasattr(libro, 'autores') else []
            generos_nombres = [genero.nombre for genero in libro.generos] if hasattr(libro, 'generos') else []

            libro_data = {
                'id': libro.id,
                'nombre': getattr(libro, 'nombre', ''),
                'isbn': getattr(libro, 'isbn', ''),
                'cantidad': getattr(libro, 'cantidad', 0),
                'editorial': getattr(libro, 'editorial', None), # Asegúrate de que 'editorial' existe en tu modelo Libro
                'edicion': getattr(libro, 'edicion', None),     # Asegúrate de que 'edicion' existe en tu modelo Libro
                'autores': autores_nombres,
                'generos': generos_nombres,
                'portada': getattr(libro, 'portada', '/placeholder.svg'), # Si tienes campo 'portada'
                'rating': getattr(libro, 'rating', 0.0), # Si tienes campo 'rating'
            }
            resultado.append(libro_data)
        return jsonify(resultado), 200
    except Exception as e:
        db.session.rollback() # Siempre hacer rollback en un except
        print(f"ERROR EN get_libros (Libros API): {e}")
        traceback.print_exc()
        return jsonify({'message': 'Error al obtener los libros', 'error': str(e)}), 500

# --- ENDPOINT: OBTENER GÉNEROS ---
@libros_bp.route('/generos', methods=['GET'])
# No requiere jwt_required si los géneros son públicos
def get_generos():
    try:
        generos = Genero.query.all()
        resultado = [{'id': genero.id, 'nombre': genero.nombre} for genero in generos]
        return jsonify(resultado), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN get_generos: {e}")
        traceback.print_exc()
        return jsonify({'message': 'Error al obtener los géneros', 'error': str(e)}), 500

# --- ENDPOINT: OBTENER AUTORES ---
@libros_bp.route('/autores', methods=['GET'])
# No requiere jwt_required si los autores son públicos
def get_autores():
    try:
        autores = Autor.query.all()
        resultado = [{'id': autor.id, 'nombre': f"{autor.nombre} {getattr(autor, 'ap_paterno', '')}".strip()} for autor in autores]
        return jsonify(resultado), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN get_autores: {e}")
        traceback.print_exc()
        return jsonify({'message': 'Error al obtener los autores', 'error': str(e)}), 500

# --- ENDPOINT: AGREGAR NUEVO LIBRO (POST) ---
# Se asume que el bibliotecario puede añadir libros.
# Deberías tener una función check_bibliotecario() en tu app/bibliotecario/routes.py
# o una función genérica de verificación de rol si quieres centralizarla.
@libros_bp.route('', methods=['POST']) # Para /api/v1/libros
@libros_bp.route('/', methods=['POST']) # Para /api/v1/libros/
@jwt_required()
def add_libro():
    # Asumo que la verificación de rol de bibliotecario se hará aquí.
    # Necesitarías importar check_bibliotecario de app.bibliotecario.routes o similar.
    # if not check_bibliotecario(): return jsonify({"message": "Acceso denegado"}), 403
    
    data = request.get_json()
    required_fields = ['isbn', 'nombre', 'cantidad', 'autores', 'generos']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"message": f"El campo '{field}' es obligatorio"}), 400

    if Libro.query.filter_by(isbn=data['isbn']).first():
        return jsonify({"message": "Ya existe un libro con ese ISBN"}), 409

    try:
        # Procesar autores: buscar existentes o crear nuevos
        autores_objs = []
        for autor_name_full in data['autores']:
            # Intentar dividir por espacio para nombre y apellido paterno
            parts = autor_name_full.split(' ', 1)
            nombre_autor = parts[0]
            ap_paterno_autor = parts[1] if len(parts) > 1 else None

            autor_obj = Autor.query.filter_by(nombre=nombre_autor, ap_paterno=ap_paterno_autor).first()
            if not autor_obj:
                autor_obj = Autor(nombre=nombre_autor, ap_paterno=ap_paterno_autor)
                db.session.add(autor_obj)
                db.session.flush() # flush para que los nuevos autores tengan ID antes de usarlos
            autores_objs.append(autor_obj)

        # Procesar géneros: buscar existentes o crear nuevos
        generos_objs = []
        for genero_name in data['generos']:
            genero_obj = Genero.query.filter_by(nombre=genero_name).first()
            if not genero_obj:
                genero_obj = Genero(nombre=genero_name)
                db.session.add(genero_obj)
                db.session.flush() # flush para que los nuevos géneros tengan ID
            generos_objs.append(genero_obj)

        nuevo_libro = Libro(
            isbn=data['isbn'],
            nombre=data['nombre'],
            cantidad=data['cantidad'],
            editorial=data.get('editorial'), # Asumo que estos campos están en el modelo Libro
            edicion=data.get('edicion'),     # Asumo que estos campos están en el modelo Libro
            autores=autores_objs, # Asigna la lista de objetos Autor
            generos=generos_objs # Asigna la lista de objetos Genero
        )
        db.session.add(nuevo_libro)
        db.session.commit()
        return jsonify({"message": "Libro añadido exitosamente", "libro_id": nuevo_libro.id}), 201
    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN add_libro: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error interno del servidor al añadir libro", "error": str(e)}), 500

# --- ENDPOINT: EDITAR LIBRO (PUT/PATCH) ---
@libros_bp.route('/<int:libro_id>', methods=['PUT', 'PATCH']) # Para /api/v1/libros/:id
@libros_bp.route('/<int:libro_id>/', methods=['PUT', 'PATCH']) # Para /api/v1/libros/:id/
@jwt_required()
def update_libro(libro_id):
    # Asumo que la verificación de rol de bibliotecario se hará aquí.
    # if not check_bibliotecario(): return jsonify({"message": "Acceso denegado"}), 403
    
    data = request.get_json()
    libro_to_update = db.session.get(Libro, libro_id)
    if not libro_to_update:
        return jsonify({"message": "Libro no encontrado"}), 404

    try:
        libro_to_update.isbn = data.get('isbn', libro_to_update.isbn)
        libro_to_update.nombre = data.get('nombre', libro_to_update.nombre)
        libro_to_update.cantidad = data.get('cantidad', libro_to_update.cantidad)
        libro_to_update.editorial = data.get('editorial', libro_to_update.editorial)
        libro_to_update.edicion = data.get('edicion', libro_to_update.edicion)

        # Procesar autores si se proporcionan
        if 'autores' in data and data['autores'] is not None:
            autores_objs = []
            for autor_name_full in data['autores']:
                parts = autor_name_full.split(' ', 1)
                nombre_autor = parts[0]
                ap_paterno_autor = parts[1] if len(parts) > 1 else None
                autor_obj = Autor.query.filter_by(nombre=nombre_autor, ap_paterno=ap_paterno_autor).first()
                if not autor_obj:
                    autor_obj = Autor(nombre=nombre_autor, ap_paterno=ap_paterno_autor)
                    db.session.add(autor_obj)
                autores_objs.append(autor_obj)
            libro_to_update.autores = autores_objs # Reemplaza la lista de autores
            db.session.flush() # flush para que los nuevos autores tengan ID antes de commit

        # Procesar géneros si se proporcionan
        if 'generos' in data and data['generos'] is not None:
            generos_objs = []
            for genero_name in data['generos']:
                genero_obj = Genero.query.filter_by(nombre=genero_name).first()
                if not genero_obj:
                    genero_obj = Genero(nombre=genero_name)
                    db.session.add(genero_obj)
                generos_objs.append(genero_obj)
            libro_to_update.generos = generos_objs # Reemplaza la lista de géneros
            db.session.flush() # flush para que los nuevos géneros tengan ID


        db.session.commit()
        return jsonify({"message": "Libro actualizado exitosamente", "libro_id": libro_to_update.id}), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN update_libro: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error interno del servidor al actualizar libro", "error": str(e)}), 500

# --- ENDPOINT: ELIMINAR LIBRO (DELETE) ---
@libros_bp.route('/<int:libro_id>', methods=['DELETE']) # Para /api/v1/libros/:id
@libros_bp.route('/<int:libro_id>/', methods=['DELETE']) # Para /api/v1/libros/:id/
@jwt_required()
def delete_libro(libro_id):
    # Asumo que la verificación de rol de bibliotecario se hará aquí.
    # if not check_bibliotecario(): return jsonify({"message": "Acceso denegado"}), 403
    
    libro_to_delete = db.session.get(Libro, libro_id)
    if not libro_to_delete:
        return jsonify({"message": "Libro no encontrado"}), 404
    
    try:
        # Regla de negocio: No permitir eliminar si hay préstamos activos asociados a este libro.
        # Esto requeriría una relación directa entre Prestamo y Libro (ej. libro_prestado_id = db.Column(db.Integer, db.ForeignKey('libro.id')) )
        # Si tienes esa relación:
        # if Prestamo.query.filter_by(libro_id=libro_id, estado='Activo').first():
        #    return jsonify({"message": "No se puede eliminar el libro: tiene préstamos activos."}), 409

        db.session.delete(libro_to_delete)
        db.session.commit()
        return jsonify({"message": "Libro eliminado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR EN delete_libro: {e}")
        traceback.print_exc()
        return jsonify({"message": "Error interno del servidor al eliminar libro", "error": str(e)}), 500