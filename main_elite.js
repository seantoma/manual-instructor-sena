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

// --- SENA_INST_BOT: Robust Assistant ---
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
        if (sender === 'user') {
            m.textContent = text;
        } else {
            m.innerHTML = text;
        }
        body.appendChild(m);
        body.scrollTop = body.scrollHeight;
    };

    const processQuery = (q) => {
        const query = q.toLowerCase();
        let r = "Lo siento, como asistente técnico para instructores, mi base de conocimientos se enfoca en la <b>Guía 040</b> y el <b>Acuerdo 009 de 2024</b>. ¿Podrías ser más específico?";

        if (query.includes("hola") || query.includes("buenos") || query.includes("quien eres")) {
            r = "Buen día, Instructor. Soy <b>SENA_INST_BOT</b>, su asistente técnico para la gestión de la Etapa Productiva. ¿En qué proceso normativo puedo asistirle hoy?";
        } else if (query.includes("guia 040") || query.includes("normativa")) {
            r = "La <b>Guía GFPI-G-040</b> establece los lineamientos para el seguimiento y evaluación. Incluye los 6 momentos clave y el uso obligatorio del Formato F023. <a href='momentos.html' style='color:var(--sena-verde)'>Ver más detalles del flujo</a>.";
        } else if (query.includes("plazo") || query.includes("tiempo") || query.includes("dias")) {
            r = "<b>Plazos Críticos:</b><br>• Retroinformar bitácoras: 5 días hábiles.<br>• Registro de juicio evaluativo: 8 días hábiles tras el cierre.<br>• Visita 1: Primeros 15 días tras el inicio.";
        } else if (query.includes("formato") || query.includes("f023") || query.includes("f147")) {
            r = "Los formatos oficiales vigentes son:<br>• <b>GFPI-F-023:</b> Planeación y Seguimiento.<br>• <b>GFPI-F-147:</b> Bitácora Mensual.<br>• <b>GFPI-F-165:</b> Cambio de Alternativa.<br><a href='formatos.html' style='color:var(--sena-verde)'>Ir al centro de descargas</a>.";
        } else if (query.includes("visita") || query.includes("seguimiento")) {
            r = "Debe realizar 3 visitas obligatorias: Concertación (M3), Seguimiento Parcial (M4) y Seguimiento Final (M5). Todas deben quedar soportadas en el F023 con firmas del Instructor, Aprendiz y Jefe Inmediato.";
        } else if (query.includes("sofia") || query.includes("cargue")) {
            r = "El cargue de evidencias se realiza en el espacio designado por su Centro (SharePoint/Territorium) y el registro de horas en SofiaPlus para el reporte de ejecución.";
        }

        setTimeout(() => addMsg(r, 'bot'), 500);
    };

    send.onclick = () => {
        if (input.value.trim()) {
            addMsg(input.value, 'user');
            processQuery(input.value);
            input.value = "";
        }
    };

    input.onkeypress = (e) => {
        if (e.key === 'Enter') send.click();
    };
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
