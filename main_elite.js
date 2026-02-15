// --- SENA Portal Elite Interface Logic ---

// Accordion
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// Checklist toggle
function toggleCheck(item) {
    item.classList.toggle('checked');
    const icon = item.querySelector('i');
    if (item.classList.contains('checked')) {
        icon.classList.remove('fa-square');
        icon.classList.add('fa-check-square');
    } else {
        icon.classList.remove('fa-check-square');
        icon.classList.add('fa-square');
    }
}

// Update progress bar (if exists on page)
function updateProgress() {
    const allItems = document.querySelectorAll('.checklist li');
    if (allItems.length === 0) return;
    
    const checkedItems = document.querySelectorAll('.checklist li.checked');
    const percentage = Math.round((checkedItems.length / allItems.length) * 100);

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (progressBar) {
        progressBar.style.width = percentage + '%';
        progressBar.textContent = percentage + '%';
    }
    if (progressText) {
        progressText.textContent = checkedItems.length + '/' + allItems.length;
    }
}

// Reset checklist
function resetChecklist() {
    document.querySelectorAll('.checklist li').forEach(item => {
        item.classList.remove('checked');
        const icon = item.querySelector('i');
        icon.classList.remove('fa-check-square');
        icon.classList.add('fa-square');
    });
    updateProgress();
}

// Simulator Logic
function simularFechas() {
    const fechaVal = document.getElementById('fechaLectiva').value;
    if (!fechaVal) return;

    const baseDate = new Date(fechaVal);
    const tabla = document.getElementById('tablaSimulador');
    const results = document.getElementById('simuladorResultados');
    
    if (results) results.style.display = "block";
    if (tabla) {
        tabla.innerHTML = "";
        const addRow = (momento, hito, fecha, norma) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${momento}</strong></td><td>${hito}</td><td>${fecha.toLocaleDateString()}</td><td><small>${norma}</small></td>`;
            tabla.appendChild(tr);
        };

        const m1 = new Date(baseDate); m1.setMonth(m1.getMonth() - 4);
        const m2 = new Date(baseDate); m2.setMonth(m2.getMonth() - 2);
        const inicio = new Date(baseDate); inicio.setDate(inicio.getDate() + 1);
        const m3 = new Date(inicio); m3.setDate(m3.getDate() + 15);
        const plazoMax = new Date(baseDate); plazoMax.setFullYear(plazoMax.getFullYear() + 2);

        addRow("Momento 1", "Taller Vida Laboral", m1, "Guía 040 (-4 meses)");
        addRow("Momento 2", "Taller Bitácoras", m2, "Guía 040 (-2 meses)");
        addRow("Inicio EP", "Primer día Etapa Productiva", inicio, "Reglamento Aprendiz");
        addRow("Momento 3", "Visita Concertación (Límite)", m3, "Guía 040 (15 días hábiles)");
        addRow("Crítico", "Plazo Máximo Inicio EP", plazoMax, "Acuerdo 007 de 2012");
    }
}

// Calculator Logic
function calcularHoras() {
    const tipo = document.getElementById('tipoCalculo').value;
    const horasMes = document.getElementById('horasMes');
    const numAprendices = document.getElementById('numAprendices');

    if (horasMes && numAprendices) {
        if (tipo === 'completo') {
            horasMes.textContent = '128';
            numAprendices.textContent = '64';
        } else {
            horasMes.textContent = '12.8';
            numAprendices.textContent = '6.4';
        }
    }
}

// Initialize components on load
document.addEventListener('DOMContentLoaded', () => {
    // Check for progress on load
    updateProgress();
    
    // Set active link in navbar based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Auto-dismiss notification if exists
    const toast = document.querySelector('.toast-notification');
    if (toast) {
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.style.display = 'none', 500);
        }, 8000);
    }
});
