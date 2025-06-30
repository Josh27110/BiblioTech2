# /app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # --- CONFIGURACIÓN DE CORS DEFINITIVA Y GLOBAL ---
    # Esto aplica las reglas a todas las rutas que empiecen con /api/v1/
    CORS(app, resources={r"/api/v1/*": {
        "origins": "http://localhost:3000",  # Permite solo a tu frontend
        "methods": ["GET", "POST", "PUT", "DELETE"],  # Permite todos los métodos que usaremos
        "allow_headers": ["Content-Type", "Authorization"]  # Permite las cabeceras necesarias
    }})

    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Registrar Blueprints (módulos de la API)
    from app.auth.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    
    from app.libros.routes import libros_bp
    app.register_blueprint(libros_bp, url_prefix='/api/v1/libros')

    from app.lector.routes import lector_bp
    app.register_blueprint(lector_bp, url_prefix='/api/v1/lector')

    from app.admin.routes import admin_bp
    app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')

    return app