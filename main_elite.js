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

/* 
   SENA_INST_BOT v3.0 - Global Intelligence Suite
   Simulates cloud connectivity and advanced technical searching.
*/

function initInstBot() {
    const fab = document.getElementById('ai-fab');
    const win = document.getElementById('chat-window');
    const close = document.getElementById('close-chat');
    const send = document.getElementById('chat-send');
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');

    if (!fab || !win) return;

    fab.addEventListener('click', () => win.classList.toggle('show'));
    close.addEventListener('click', () => win.classList.remove('show'));

    const addMsg = (text, sender) => {
        const m = document.createElement('div');
        m.className = `msg ${sender}`;
        m.innerHTML = text;
        body.appendChild(m);
        body.scrollTop = body.scrollHeight;
    };

    const showTyping = () => {
        const dot = document.createElement('div');
        dot.className = 'msg bot typing';
        dot.innerHTML = '<i class="fas fa-network-wired fa-spin"></i> Consultando base de datos global...';
        dot.id = 'typing-indicator';
        body.appendChild(dot);
        body.scrollTop = body.scrollHeight;
    };

    const processQuery = (q) => {
        const query = q.toLowerCase();

        // UI FEEDBACK
        showTyping();

        setTimeout(() => {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();

            let r = `
                <div style="border-left:2px solid #ef4444; padding-left:10px;">
                    Instructor, este caso requiere <b>Sincronización Externa</b>. 
                    No encuentro la respuesta exacta en la Guía 040 local. 
                    <br><br>
                    <b>Opciones de Red SENA:</b><br>
                    <a href="https://senasofiaplus.edu.co/sofia-public/buscar-oferta.html?q=${encodeURIComponent(query)}" target="_blank" class="btn-mini" style="display:inline-block; background:#39A900; color:white; margin:5px 0;">Buscar en SofiaPlus</a><br>
                    <a href="https://www.google.com/search?q=SENA+Guia+040+${encodeURIComponent(query)}+instructores" target="_blank" class="btn-mini" style="display:inline-block; background:var(--sena-azul); color:white;">Consultar en Google</a>
                </div>
            `;

            const intents = [
                {
                    keys: ['hola', 'bienvenido', 'quien eres', 'asistente'],
                    response: "Buen día, Instructor. Soy <b>SENA_INST_BOT v3.0</b>. He sincronizado con la red global del SENA para asistirle en auditoría, normativa y procesos técnicos. ¿Qué modulo desea consultar?"
                },
                {
                    keys: ['bitacora', 'f147', 'reporte', 'seguimiento'],
                    response: "<b>Módulo de Bitácoras (Nube SENA):</b><br>Las bitácoras deben subirse quincenalmente. Usted como instructor debe:<br>1. Validar cronología.<br>2. Firmar digitalmente.<br>3. <a href='https://zendsena.zendesk.com/hc/es-419' target='_blank' style='color:var(--sena-verde)'>Ver manual de cargue en Zendesk</a>."
                },
                {
                    keys: ['f023', 'concertación', 'visita', 'planeación'],
                    response: "<b>Protocolo F023 (Global):</b><br>Se han detectado 3 hitos vitales. El formato debe ser cargado al drive institucional tras cada visita. Si tiene problemas con el formato excel, puede <a href='https://portal.misena.edu.co/' target='_blank'>acceder a SharePoint aquí</a>."
                },
                {
                    keys: ['normativa', 'ley', 'acuerdo', 'reglamento', '009'],
                    response: "<b>Sincronización con Acuerdo 009 de 2024:</b><br>El nuevo reglamento del aprendiz establece protocolos estrictos para el seguimiento. Consulte el Cap. V sobre Derechos y Deberes en Etapa Productiva. <a href='fundamentos.html' style='color:var(--sena-verde)'>Abrir visor normativo</a>."
                },
                {
                    keys: ['sofia', 'plataforma', 'juicio', 'calificación'],
                    response: "<b>Conectado a SofiaPlus:</b><br>El juicio evaluativo solo debe emitirse cuando el portafolio esté al 100%. <br><a href='https://senasofiaplus.edu.co/' target='_blank' class='btn-mini' style='background:#39A900; color:white; padding:5px; border-radius:4px; text-decoration:none;'>Ir a SofiaPlus</a>"
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
            addMsg(r, 'bot');
        }, 1200); // Simulate "Internet search" delay
    };

    send.addEventListener('click', () => {
        if (!input.value.trim()) return;
        addMsg(input.value, 'user');
        processQuery(input.value);
        input.value = '';
    });

    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') send.click(); });
}

document.addEventListener('DOMContentLoaded', initInstBot);

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
