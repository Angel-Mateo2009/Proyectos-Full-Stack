/**
 * Lógica del Frontend para la Agenda.
 * Desarrollado para la presentación de Bachillerato.
 */

let contactosBase = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    fetchContactos();
    
    // Listener para el buscador
    const inputBusqueda = document.getElementById('inputBusqueda');
    inputBusqueda.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtrados = contactosBase.filter(c => 
            c.nombre.toLowerCase().includes(query) || 
            c.telefono.includes(query)
        );
        pintarContactos(filtrados);
    });
});

// Función para obtener datos desde Python
async function fetchContactos() {
    try {
        const res = await fetch('/api/contactos');
        contactosBase = await res.json();
        pintarContactos(contactosBase);
    } catch (err) {
        console.error("Error al conectar con el servidor Flask:", err);
    }
}

// Función para renderizar la lista en el HTML
function pintarContactos(contactos) {
    const grid = document.getElementById('gridContactos');
    const divVacio = document.getElementById('vacio');
    
    grid.innerHTML = '';
    
    if (contactos.length === 0) {
        divVacio.classList.remove('hidden');
    } else {
        divVacio.classList.add('hidden');
        contactos.forEach(c => {
            const div = document.createElement('div');
            div.className = 'tarjeta-contacto';
            div.innerHTML = `
                <div>
                    <h3 class="text-lg font-bold text-gray-800">${c.nombre}</h3>
                    <p class="text-blue-600 font-semibold">${c.telefono}</p>
                    <p class="text-xs text-gray-400">${c.email || 'Sin correo'}</p>
                    <span class="tag tag-${c.categoria.toLowerCase()}">${c.categoria}</span>
                </div>
                <button onclick="window.eliminar(${c.id})" class="btn-eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            `;
            grid.appendChild(div);
        });
    }
}

// Agregar nuevo contacto
document.getElementById('formNuevo').onsubmit = async (e) => {
    e.preventDefault();
    
    const nuevo = {
        nombre: document.getElementById('nom').value,
        telefono: document.getElementById('tel').value,
        email: document.getElementById('ema').value,
        categoria: document.getElementById('cat').value
    };

    const res = await fetch('/api/contactos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
    });

    if (res.ok) {
        window.toggleModal(false);
        e.target.reset();
        fetchContactos();
    }
};

// Eliminar contacto
window.eliminar = async function(id) {
    if (confirm('¿Quieres eliminar este contacto?')) {
        await fetch(`/api/contactos/${id}`, { method: 'DELETE' });
        fetchContactos();
    }
}

// Control del Modal
window.toggleModal = function(show) {
    const modal = document.getElementById('modal');
    show ? modal.classList.remove('hidden') : modal.classList.add('hidden');
}