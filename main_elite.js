/* 
   SENA_INST_BOT v3.5 - The Theoretical Brain
   Especialización en Guía 040, Acuerdo 009 y Procesos de Certificación (TyT)
*/

document.addEventListener('DOMContentLoaded', () => {
    initEliteComponents();
    loadPersistentChecklists();
});

function initEliteComponents() {
    const btnBackToTop = document.getElementById('btn-back-to-top');
    if (btnBackToTop) {
        window.addEventListener('scroll', () => {
            btnBackToTop.style.display = window.scrollY > 400 ? "flex" : "none";
        });
        btnBackToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    initInstBot();
}

const GEMINI_API_KEY = "AIzaSyC9dYIUiNGOQ-1JNNR-BdnloAgbVDMPR04";

function initInstBot() {
    const fab = document.getElementById('ai-fab');
    const win = document.getElementById('chat-window');
    const close = document.getElementById('close-chat');
    const send = document.getElementById('chat-send');
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');

    if (!fab || !win) return;

    // Molly Rebranding - Icono Border Collie simbólico
    fab.innerHTML = '<img src="https://img.icons8.com/color/96/border-collie.png" style="width:70%; filter: brightness(1.2);">';

    fab.addEventListener('click', () => win.classList.toggle('show'));
    close.addEventListener('click', () => win.classList.remove('show'));

    const addMsg = (text, sender) => {
        const m = document.createElement('div');
        m.className = `msg ${sender}`;
        m.innerHTML = text;
        body.appendChild(m);
        body.scrollTop = body.scrollHeight;
    };

    // Sugerencias rápidas adaptadas a MOLLY
    const suggestions = ['¿Molly, qué es TyT?', 'Los 6 Momentos', 'Acuerdo 009', 'Bitácoras', 'Fuentes Confiables'];
    const sugContainer = document.createElement('div');
    sugContainer.style.padding = '0.5rem 1rem';
    sugContainer.style.display = 'flex';
    sugContainer.style.gap = '5px';
    sugContainer.style.flexWrap = 'wrap';
    sugContainer.style.background = '#fff';
    sugContainer.style.borderTop = '1px solid #eee';

    suggestions.forEach(s => {
        const b = document.createElement('button');
        b.innerText = s;
        b.style.fontSize = '0.7rem';
        b.style.padding = '4px 8px';
        b.style.borderRadius = '15px';
        b.style.border = '1px solid var(--sena-verde)';
        b.style.background = 'transparent';
        b.style.cursor = 'pointer';
        b.style.color = 'var(--sena-verde)';
        b.addEventListener('click', () => {
            input.value = s;
            send.click();
        });
        sugContainer.appendChild(b);
    });
    win.insertBefore(sugContainer, document.querySelector('.chat-footer'));

    const showTyping = () => {
        const dot = document.createElement('div');
        dot.className = 'msg bot typing';
        dot.innerHTML = '<i class="fas fa-dog fa-bounce"></i> Molly está rastreando la normativa...';
        dot.id = 'typing-indicator';
        body.appendChild(dot);
        body.scrollTop = body.scrollHeight;
    };

    const processQuery = (q) => {
        const query = q.toLowerCase();
        showTyping();

        setTimeout(() => {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();

            let r = "Instructor, no localizo ese término en mi rastreo de la Guía 040 o Acuerdo 009. <b>¿Desea que busque en la red global SENA?</b><br><br><div style='display:flex; gap:5px; flex-wrap:wrap;'><a href='https://www.google.com/search?q=SENA+Guia+040+" + encodeURIComponent(query) + "' target='_blank' class='btn-mini' style='background:var(--sena-verde); color:white; padding:5px 10px; border-radius:5px; text-decoration:none; font-size:0.7rem;'>Buscar en Google</a> <a href='https://sissenagit-ub43lappzgna58vrvklfj3k.streamlit.app/' target='_blank' class='btn-mini' style='background:var(--sena-azul-navy); color:white; padding:5px 10px; border-radius:5px; text-decoration:none; font-size:0.7rem;'>Consultar SEP_SENA</a></div>";

            const intents = [
                {
                    keys: ['hola', 'bienvenido', 'saludo', 'quien eres', 'molly'],
                    response: "¡Guau! Saludos, Instructor. Soy <b>MOLLY</b>, su asistente Border Collie experta en Etapa Productiva.<br><br>Mi olfato está entrenado en:<br>• <b>Guía 040:</b> Protocolos de supervisión.<br>• <b>Acuerdo 009 (2024):</b> Reglamento del aprendiz.<br>• <b>Bitácoras:</b> Control quincenal.<br><br>¿Qué rastro normativo seguimos hoy?"
                },
                {
                    keys: ['tyt', 'examen', 'saber', 'requisito'],
                    response: "<b>Molly Nota: Pruebas Saber TyT</b><br>Es requisito para tecnólogos. El aprendiz debe presentar el reporte de asistencia para certificar Etapa Productiva. <br><a href='https://www.icfes.gov.co/' target='_blank' class='btn-mini' style='color:var(--sena-verde)'>Ir al ICFES</a>"
                },
                {
                    keys: ['momento', 'paso', 'etapa', 'fase'],
                    response: "<b>Guía 040 - Los 6 Momentos:</b><br>Como Border Collie, vigilo que se cumplan todos:<br>• **M1:** Inducción.<br>• **M3:** Concertación (15 días).<br>• **M6:** Certificación.<br>Cada uno tiene sus formatos GFPI específicos."
                },
                {
                    keys: ['acuerdo 009', 'reglamento', 'sancion', 'falta', 'deserción'],
                    response: "<b>Rastreo Normativo (Acuerdo 009 de 2024):</b><br>La falta de reporte o 3 días de inasistencia en empresa se consideran novedad de deserción. Mantenga las bitácoras al día para evitar contratiempos."
                },
                {
                    keys: ['bitacora', 'f147', 'formato', 'quincenal'],
                    response: "<b>Control de Bitácoras:</b><br>Indispensable la firma quincenal del aprendiz y del jefe inmediato en el formato F-147."
                },
                {
                    keys: ['fuente', 'confiable', 'web', 'link'],
                    response: "<b>Fuentes Oficiales:</b><br>1. <a href='http://senasofiaplus.edu.co' target='_blank'>SofiaPlus</a><br>2. <a href='https://caprendizaje.sena.edu.co' target='_blank'>SGVA</a><br>3. <a href='https://seantoma.github.io/manual-aprendiz-sena/index.html' target='_blank'>Portal Aprendiz</a>"
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
        }, 800);
    };

    send.addEventListener('click', () => {
        if (!input.value.trim()) return;
        addMsg(input.value, 'user');
        processQuery(input.value);
        input.value = '';
    });

    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') send.click(); });
}

// Persistencia y Navegación
function toggleCheck(item) {
    item.classList.toggle('checked');
    const icon = item.querySelector('i');
    icon.className = item.classList.contains('checked') ? 'fas fa-check-square' : 'far fa-square';
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
