import os
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

# --- CONFIGURACIÓN DE RUTAS ---
# Detectamos la ubicación real de la carpeta donde está este archivo app.py
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, 
            template_folder=os.path.join(basedir, 'templates'),
            static_folder=os.path.join(basedir, 'static'))

# Configuración de la Base de Datos SQLite (se creará en la misma carpeta)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'alumnos.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- MODELO DE LA BASE DE DATOS ---
class Alumno(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    curso = db.Column(db.String(50), nullable=False)
    puntaje_final = db.Column(db.Float, nullable=False)

# Crear la base de datos automáticamente al iniciar
with app.app_context():
    db.create_all()

# --- RUTAS DEL SISTEMA ---

@app.route('/')
def index():
    # Mostramos todos los alumnos registrados
    alumnos = Alumno.query.all()
    return render_template('index.html', alumnos=alumnos)

@app.route('/agregar', methods=['POST'])
def agregar():
    nombre = request.form.get('nombre')
    curso = request.form.get('curso')
    puntaje = float(request.form.get('puntaje_final'))
    
    nuevo_alumno = Alumno(nombre=nombre, curso=curso, puntaje_final=puntaje)
    db.session.add(nuevo_alumno)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/editar/<int:id>', methods=['GET', 'POST'])
def editar(id):
    alumno = Alumno.query.get_or_404(id)
    if request.method == 'POST':
        alumno.nombre = request.form.get('nombre')
        alumno.curso = request.form.get('curso')
        alumno.puntaje_final = float(request.form.get('puntaje_final'))
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('editar.html', alumno=alumno)

@app.route('/eliminar/<int:id>')
def eliminar(id):
    alumno = Alumno.query.get_or_404(id)
    db.session.delete(alumno)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/ranking')
def ranking():
    # TOP 10 General ordenado de mayor a menor puntaje
    top_10 = Alumno.query.order_by(Alumno.puntaje_final.desc()).limit(10).all()
    # Obtenemos los cursos únicos para el menú desplegable del filtro
    cursos_db = db.session.query(Alumno.curso).distinct().all()
    cursos = [c[0] for c in cursos_db]
    return render_template('ranking.html', alumnos=top_10, cursos=cursos)

@app.route('/ranking_curso')
def ranking_curso():
    curso_sel = request.args.get('curso')
    # Ranking filtrado por curso específico (TOP 10)
    top_curso = Alumno.query.filter_by(curso=curso_sel).order_by(Alumno.puntaje_final.desc()).limit(10).all()
    cursos_db = db.session.query(Alumno.curso).distinct().all()
    cursos = [c[0] for c in cursos_db]
    return render_template('ranking.html', alumnos=top_curso, cursos=cursos, seleccionado=curso_sel)

# --- INICIO DEL SERVIDOR ---
if __name__ == '__main__':
    app.run(debug=True)