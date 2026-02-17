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
            
            const tdMomento = document.createElement('td');
            const strong = document.createElement('strong');
            strong.textContent = momento;
            tdMomento.appendChild(strong);
            
            const tdHito = document.createElement('td');
            tdHito.textContent = hito;
            
            const tdFecha = document.createElement('td');
            tdFecha.textContent = fecha.toLocaleDateString();
            
            const tdNorma = document.createElement('td');
            const small = document.createElement('small');
            small.textContent = norma;
            tdNorma.appendChild(small);
            
            tr.appendChild(tdMomento);
            tr.appendChild(tdHito);
            tr.appendChild(tdFecha);
            tr.appendChild(tdNorma);
            
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
    // Scroll to top button logic
    const btnBackToTop = document.getElementById('btn-back-to-top');
    if (btnBackToTop) {
        window.onscroll = function () {
            if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                btnBackToTop.style.display = "flex";
            } else {
                btnBackToTop.style.display = "none";
            }
        };

        btnBackToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
