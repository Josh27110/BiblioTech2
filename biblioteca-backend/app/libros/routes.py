# /app/libros/routes.py

from flask import Blueprint, jsonify, request
from app.models import db, Libro, Autor, Genero

libros_bp = Blueprint('libros', __name__)

@libros_bp.route('/', methods=['GET'])
def get_libros():
    try:
        libros = Libro.query.all()
        resultado = []
        for libro in libros:
            libro_data = {
                'id': libro.id,
                'nombre': libro.nombre,
                'isbn': libro.isbn,
                # Los campos 'editorial' y 'edicion' se han eliminado porque no están en el modelo.
                'cantidad': libro.cantidad,
                'autores': [f"{autor.nombre} {autor.ap_paterno or ''}".strip() for autor in libro.autores],
                'generos': [genero.nombre for genero in libro.generos],
                # Añadimos campos dummy para que coincida con la expectativa del frontend
                'portada': '/placeholder.svg',
                'rating': 4.5 
            }
            resultado.append(libro_data)
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({'message': 'Error al obtener los libros', 'error': str(e)}), 500

@libros_bp.route('/generos', methods=['GET'])
def get_generos():
    try:
        generos = Genero.query.all()
        resultado = [{'id': genero.id, 'nombre': genero.nombre} for genero in generos]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({'message': 'Error al obtener los géneros', 'error': str(e)}), 500

@libros_bp.route('/autores', methods=['GET'])
def get_autores():
    try:
        autores = Autor.query.all()
        resultado = [{'id': autor.id, 'nombre': f"{autor.nombre} {autor.ap_paterno or ''}".strip()} for autor in autores]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({'message': 'Error al obtener los autores', 'error': str(e)}), 500

# ... (El resto de tus rutas POST, PUT, etc. se mantienen igual) ...