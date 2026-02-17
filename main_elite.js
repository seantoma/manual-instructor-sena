// --- SENA Portal Elite 2.0 - Instructor Assistant Logic ---

document.addEventListener('DOMContentLoaded', () => {
    initEliteComponents();
    loadPersistentChecklists();
});

function initEliteComponents() {
    // Scroll to top button logic
    const btnBackToTop = document.getElementById('btn-back-to-top');
    if (btnBackToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btnBackToTop.style.display = "flex";
            } else {
                btnBackToTop.style.display = "none";
            }
        });

        btnBackToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Chatbot Initialization
    initInstBot();
}

// Checklist toggle with persistence
function toggleCheck(item) {
    item.classList.toggle('checked');
    const icon = item.querySelector('i');
    if (item.classList.contains('checked')) {
        icon.className = 'fas fa-check-square';
    } else {
        icon.className = 'far fa-square';
    }
    saveChecklistState();
    updateProgress();
}

function saveChecklistState() {
    const checks = [];
    document.querySelectorAll('.checklist li').forEach((li, index) => {
        checks.push({ index, checked: li.classList.contains('checked') });
    });
    localStorage.setItem('sena_inst_checklist', JSON.stringify(checks));
}

function loadPersistentChecklists() {
    const saved = localStorage.getItem('sena_inst_checklist');
    if (saved) {
        const checks = JSON.parse(saved);
        const lis = document.querySelectorAll('.checklist li');
        checks.forEach(item => {
            if (lis[item.index]) {
                if (item.checked) {
                    lis[item.index].classList.add('checked');
                    const icon = lis[item.index].querySelector('i');
                    if (icon) icon.className = 'fas fa-check-square';
                }
            }
        });
        updateProgress();
    }
}

// --- SENA_INST_BOT v2.0: Advanced Auditor Logic ---
function initInstBot() {
    const fab = document.getElementById('ai-fab');
    const win = document.getElementById('chat-window');
    const close = document.getElementById('close-chat');
    const send = document.getElementById('chat-send');
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');

    if (!fab || !win) return;

    fab.onclick = () => win.classList.toggle('show');
    close.onclick = () => win.classList.remove('show');

    const addMsg = (text, sender) => {
        const m = document.createElement('div');
        m.className = `msg ${sender}`;
        m.innerHTML = text;
        body.appendChild(m);
        body.scrollTop = body.scrollHeight;
    };

    const processQuery = (q) => {
        const query = q.toLowerCase();
        let r = "Instructor, no reconozco ese término técnico. ¿Desea consultar sobre plazos de <b>Bitácoras</b>, el formato <b>F023</b> o sanciones por <b>incumplimiento</b>?";

        const intents = [
            {
                keys: ['hola', 'buenos', 'quien eres', 'ayuda'],
                response: "Buen día, Instructor. Soy <b>SENA_INST_BOT v2.0</b>. Mi lógica ha sido reforzada para asistirle en auditoría técnica según la <b>Guía 040</b>. ¿Qué proceso desea validar hoy?"
            },
            {
                keys: ['bitacora', 'f147', 'quince', 'mensual', 'reporte'],
                response: "<b>Auditoría de Bitácoras (F147):</b><br>• El aprendiz debe reportar cada 15 días.<br>• Usted tiene <b>5 días hábiles</b> para retroalimentar.<br>• <b>Crítico:</b> Verifique que las tareas desarrollen las competencias del programa."
            },
            {
                keys: ['f023', 'planeacion', 'seguimiento', 'visita', 'concertacion'],
                response: "<b>Seguimiento F023 (3 Visitas):</b><br>1. <b>Concertación:</b> Primeros 15 días hábiles.<br>2. <b>Parcial:</b> Mes 3 (Verificar bitácoras).<br>3. <b>Final:</b> Mes 6 (Evaluación y juicio).<br><b>Nota:</b> Todas requieren firmas del Instructor, Aprendiz y Ente Coformador."
            },
            {
                keys: ['plazo', 'tiempo', 'dias', 'limite', 'vence', 'cuando'],
                response: "<b>Plazos Legales para el Instructor:</b><br>• Registro de Juicio: 8 días hábiles tras cierre.<br>• Visita de Concertación: 15 días hábiles tras inicio.<br>• Respuesta a Bitácoras: 5 días hábiles.<br>• Comités: Según Reglamento del Aprendiz."
            },
            {
                keys: ['incumplimiento', 'falla', 'sancion', 'comite', 'inasistencia', 'abandono'],
                response: "<b>Gestión de Incumplimiento:</b><br>1. Si falla 2 bitácoras consecutivas: Reporte a Coordinación.<br>2. Inasistencia injustificada (3 días): Proceso de deserción.<br>3. Falta grave: Citación a <b>Comité de Evaluación</b> según Acuerdo 009 de 2024."
            },
            {
                keys: ['sofia', 'cargue', 'evidencia', 'territorium', 'sharepoint'],
                response: "<b>Sincronización Documental:</b><br>• Las evidencias deben reposar en el repositorio del Centro (SharePoint/Drive).<br>• El juicio evaluativo (Aprobado/Deficiente) se registra en <b>SofiaPlus</b> al cierre definitivo."
            },
            {
                keys: ['cambio', 'alternativa', 'f165', 'vinculo', 'pasantia'],
                response: "<b>Cambio de Alternativa (F165):</b><br>Requiere aval técnico del instructor y aprobación de Coordinación. El aprendiz solo puede cambiar UNA vez durante su proceso. <a href='alternativas.html' style='color:var(--sena-verde)'>Ver detalles técnicos</a>."
            }
        ];

        let bestMatch = null;
        let maxScore = 0;
        intents.forEach(intent => {
            let score = 0;
            intent.keys.forEach(key => { if (query.includes(key)) score++; });
            if (score > maxScore) { maxScore = score; bestMatch = intent.response; }
        });

        if (bestMatch) r = bestMatch;
        setTimeout(() => addMsg(r, 'bot'), 500);
    };

    send.onclick = () => {
        if (input.value.trim()) {
            const userMsg = input.value;
            addMsg(userMsg, 'user');
            processQuery(userMsg);
            input.value = "";
        }
    };

    input.onkeypress = (e) => { if (e.key === 'Enter') send.click(); };
}

// Legacy helpers (Accordions)
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    header.classList.toggle('active');
    content.classList.toggle('show');
}

function updateProgress() {
    const all = document.querySelectorAll('.checklist li').length;
    const checked = document.querySelectorAll('.checklist li.checked').length;
    const bar = document.getElementById('progressBar');
    if (bar && all > 0) {
        const p = Math.round((checked / all) * 100);
        bar.style.width = p + '%';
        bar.textContent = p + '%';
    }
}
