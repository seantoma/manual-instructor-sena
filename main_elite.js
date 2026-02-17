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

    // Sugerencias rápidas
    const suggestions = ['¿Qué es TyT?', 'Los 6 Momentos', 'Acuerdo 009', 'Bitácoras', 'Fuentes Confiables'];
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
        dot.innerHTML = '<i class="fas fa-microchip fa-spin"></i> Procesando motor normativo v4.0...';
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

            let r = "Instructor, no localizo ese término en mis registros locales de la Guía 040 o Acuerdo 009. <b>¿Desea que consulte en la red global SENA?</b><br><br><div style='display:flex; gap:5px; flex-wrap:wrap;'><a href='https://www.google.com/search?q=SENA+Guia+040+" + encodeURIComponent(query) + "' target='_blank' class='btn-mini' style='background:var(--sena-verde); color:white; padding:5px 10px; border-radius:5px; text-decoration:none; font-size:0.7rem;'>Buscar en Google</a> <a href='https://sissenagit-ub43lappzgna58vrvklfj3k.streamlit.app/' target='_blank' class='btn-mini' style='background:var(--sena-azul-navy); color:white; padding:5px 10px; border-radius:5px; text-decoration:none; font-size:0.7rem;'>Consultar SEP_SENA</a></div>";

            const intents = [
                {
                    keys: ['hola', 'bienvenido', 'saludo', 'quien eres'],
                    response: "¡Saludos, Instructor! Soy <b>SENA_INST_BOT v4.0 (Turbo Edition)</b>.<br><br>Mi motor ha sido actualizado con:<br>• <b>Guía 040 (2023):</b> Protocolo de Momentos.<br>• <b>Acuerdo 009 (2024):</b> Nuevo Reglamento.<br>• <b>Decreto 1072:</b> Normativa laboral y ARL.<br><br>¿En qué proceso de auditoría o acompañamiento puedo asistirle hoy?"
                },
                {
                    keys: ['tyt', 'examen', 'saber', 'requisito'],
                    response: "<b>Asunto: Pruebas Saber TyT</b><br>Basado en la Circular 2024 y Guía de Certificación:<br>1. **Obligatoriedad:** Es requisito indispensable para certificar Tecnólogos.<br>2. **Evidencia:** El aprendiz debe cargar el reporte de presentación (o asistencia) en su carpeta.<br>3. **Fuente Confiable:** <a href='https://www.icfes.gov.co/' target='_blank' style='color:var(--sena-azul-claro)'>Portal Oficial ICFES</a>"
                },
                {
                    keys: ['momento', 'paso', 'etapa', 'fase'],
                    response: "<b>Estructura Técnica (Guía 040):</b><br>Los 6 Momentos son el pilar de la supervisión. Destacan:<br>• **M1 (Inducción):** Validación de RAPs al 100%.<br>• **M3 (Concertación):** Primeros 15 días, firma de F-023.<br>• **M6 (Certificación):** Cierre definitivo.<br><br><i>Fuente: Manual de Procedimiento GFPI.</i>"
                },
                {
                    keys: ['acuerdo 009', 'reglamento', 'sancion', 'falta', 'deserción'],
                    response: "<b>Alerta Normativa - Acuerdo 009 de 2024:</b><br>• **Deserción:** 3 días de inasistencia injustificada en la empresa.<br>• **Etapa Productiva:** El instructor debe reportar novedades en SofiaPlus máximo 5 días después de detectarlas.<br>• **Fuente Legal:** <a href='http://noticias.sena.edu.co/' target='_blank' style='color:var(--sena-azul-claro)'>Repositorio Normativo SENA</a>"
                },
                {
                    keys: ['bitacora', 'f147', 'formato', 'quincenal'],
                    response: "<b>Control de Bitácoras (F-147):</b><br>• **Frecuencia:** Cada 15 días calendario.<br>• **Firma:** Deben tener firma del aprendiz y del Jefe Inmediato (o sello empresa).<br>• **Auditoría:** El instructor debe revisar que las tareas aporten a las competencias técnicas del programa."
                },
                {
                    keys: ['sgva', 'contrato', 'pila', 'arl'],
                    response: "<b>Gestión Contractual:</b><br>Para Contrato de Aprendizaje, valide siempre en:<br>• **SGVA:** <a href='https://caprendizaje.sena.edu.co/' target='_blank' style='color:var(--sena-azul-claro)'>Login SGVA</a><br>• **PILA:** Verifique que el IBC sea correcto para el pago de ARL."
                },
                {
                    keys: ['fuente', 'confiable', 'web', 'link'],
                    response: "<b>Fuentes Oficiales y Confiables:</b><br>1. <a href='https://www.sena.edu.co' target='_blank'>Portal Institucional SENA</a><br>2. <a href='http://oferta.senasofiaplus.edu.co/sofia-oferta/' target='_blank'>SofiaPlus Personal</a><br>3. <a href='https://sissenagit-ub43lappzgna58vrvklfj3k.streamlit.app/' target='_blank'>Portal SEP_SENA (Gestión IA)</a><br>4. <a href='https://outlook.office.com/' target='_blank'>Correo Misena</a>"
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
        }, 1200);
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
