// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Confirmación elegante para eliminar
    const deleteButtons = document.querySelectorAll('.btn-danger, a[style*="color: red"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const confirmacion = confirm("¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.");
            if (!confirmacion) {
                e.preventDefault();
            }
        });
    });

    // 2. Validación simple de puntajes en el formulario
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            const puntajeInput = document.querySelector('input[name="puntaje_final"]');
            const valor = parseFloat(puntajeInput.value);

            if (valor < 0 || valor > 100) { // Ajusta el rango según lo que necesite el colegio
                alert("Por favor, ingresa un puntaje válido entre 0 y 100.");
                e.preventDefault();
            }
        });
    }

    // 3. Efecto de resaltado al pasar el mouse por las filas de la tabla
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#f1f5f9';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = 'transparent';
        });
    });
});