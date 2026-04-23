from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

# Inicializamos la aplicación Flask
app = Flask(__name__)

# Configuración de la base de datos SQLite (se crea un archivo .db localmente)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'agenda_estudiante.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Definimos el modelo de la tabla de contactos
class Contacto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100))
    categoria = db.Column(db.String(50), default='General')

# Creamos la base de datos automáticamente al ejecutar el script
with app.app_context():
    db.create_all()

# --- RUTAS DE LA APLICACIÓN ---

@app.route('/')
def index():
    """Ruta que carga la página principal (HTML)"""
    return render_template('index.html')

@app.route('/api/contactos', methods=['GET'])
def obtener_contactos():
    """API: Retorna todos los contactos en formato JSON"""
    contactos = Contacto.query.all()
    lista = [{
        'id': c.id, 
        'nombre': c.nombre, 
        'telefono': c.telefono, 
        'email': c.email, 
        'categoria': c.categoria
    } for c in contactos]
    return jsonify(lista)

@app.route('/api/contactos', methods=['POST'])
def agregar_contacto():
    """API: Recibe datos y crea un nuevo registro"""
    data = request.json
    nuevo = Contacto(
        nombre=data['nombre'],
        telefono=data['telefono'],
        email=data.get('email'),
        categoria=data.get('categoria', 'General')
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({'mensaje': 'Contacto guardado', 'id': nuevo.id}), 201

@app.route('/api/contactos/<int:id>', methods=['DELETE'])
def eliminar_contacto(id):
    """API: Borra un contacto por su ID"""
    contacto = Contacto.query.get_or_404(id)
    db.session.delete(contacto)
    db.session.commit()
    return jsonify({'mensaje': 'Contacto eliminado'})

if __name__ == '__main__':
    # Ejecución del servidor en el puerto 5000 por defecto
    print("Servidor de Agenda iniciado en http://127.0.0.1:5000")
    app.run(debug=True)