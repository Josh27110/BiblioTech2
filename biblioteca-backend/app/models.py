# /app/models.py

from . import db, bcrypt
from datetime import datetime

# --- Tablas de Asociación ---
libro_autor = db.Table('libro_autor',
    db.Column('libro_id', db.ForeignKey('libro.id'), primary_key=True),
    db.Column('autor_id', db.ForeignKey('autor.id'), primary_key=True)
)

libro_genero = db.Table('libro_genero',
    db.Column('libro_id', db.ForeignKey('libro.id'), primary_key=True),
    db.Column('genero_id', db.ForeignKey('genero.id'), primary_key=True)
)

solicitud_libro = db.Table('solicitud_libro',
    db.Column('solicitud_id', db.ForeignKey('solicitud.id'), primary_key=True),
    db.Column('libro_id', db.ForeignKey('libro.id'), primary_key=True)
)


# --- Clases de Modelos ---

class Rol(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), unique=True, nullable=False)
    usuarios = db.relationship('Usuario', backref='rol', lazy=True)

# --- CLASE USUARIO ACTUALIZADA CON CAMPOS DEL PERFIL ---
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido_paterno = db.Column(db.String(100), nullable=False)
    apellido_materno = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    rol_id = db.Column(db.Integer, db.ForeignKey('rol.id'), nullable=False)
    
    # --- CAMPOS NUEVOS AÑADIDOS ---
    fecha_nacimiento = db.Column(db.Date, nullable=True)
    telefono = db.Column(db.String(20), nullable=True)
    direccion = db.Column(db.String(255), nullable=True)
    genero = db.Column(db.String(50), nullable=True)
    
    # Relaciones existentes
    solicitudes_realizadas = db.relationship('Solicitud', foreign_keys='Solicitud.id_usuario_lector', backref='lector', lazy=True)
    prestamos = db.relationship('Prestamo', backref='usuario_prestamo', lazy=True)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Libro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    isbn = db.Column(db.String(20), unique=True, nullable=False)
    nombre = db.Column(db.String(255), nullable=False)
    cantidad = db.Column(db.Integer, default=1)
    autores = db.relationship('Autor', secondary=libro_autor, backref=db.backref('libros', lazy='dynamic'))
    generos = db.relationship('Genero', secondary=libro_genero, backref=db.backref('libros', lazy='dynamic'))

class Autor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    ap_paterno = db.Column(db.String(100), nullable=True)

class Genero(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), unique=True, nullable=False)

class Solicitud(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_usuario_lector = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    fecha_solicitud = db.Column(db.DateTime, default=datetime.utcnow)
    estado = db.Column(db.String(50), default='Pendiente') # Pendiente, Aprobada, Rechazada
    
    libros = db.relationship('Libro', secondary=solicitud_libro, backref='solicitudes')
    prestamo = db.relationship('Prestamo', backref='solicitud_origen', uselist=False, lazy=True)

class Prestamo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_solicitud = db.Column(db.Integer, db.ForeignKey('solicitud.id'), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    fecha_inicio = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_devolucion_limite = db.Column(db.DateTime, nullable=False)
    fecha_devolucion_real = db.Column(db.DateTime, nullable=True)
    estado = db.Column(db.String(50), default='Activo') # Activo, Devuelto, Vencido
    multas = db.relationship('Multa', backref='prestamo_origen', lazy=True)

class Multa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_prestamo = db.Column(db.Integer, db.ForeignKey('prestamo.id'), nullable=False)
    monto = db.Column(db.Float, nullable=False)
    fecha_generacion = db.Column(db.DateTime, default=datetime.utcnow)
    estado = db.Column(db.String(50), default='Pendiente') # Pendiente, Pagada