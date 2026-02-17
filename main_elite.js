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
        dot.innerHTML = '<i class="fas fa-dog fa-bounce"></i> Molly está pensando...';
        dot.id = 'typing-indicator';
        body.appendChild(dot);
        body.scrollTop = body.scrollHeight;
    };

    async function callGemini(prompt) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Eres MOLLY, una asistente experta en el SENA Etapa Productiva. Tienes la personalidad de una perrita Border Collie inteligente, atenta y profesional. Tu objetivo es ayudar a los instructores con la Guía 040, Acuerdo 009 de 2024 y procesos de certificación. 
                        
                        CONTEXTO CLAVE:
                        - Guía 040: Define los 6 momentos de seguimiento.
                        - Acuerdo 009 (2024): Nuevo reglamento del aprendiz.
                        - TyT: Requisito indispensable para tecnólogos.
                        - Bitácoras (F-147): Deben ser quincenales.
                        
                        REGLAS DE RESPUESTA:
                        1. Sé amable y usa un tono profesional pero cercano (estilo Border Collie servicial).
                        2. Si mencionas enlaces, usa los oficiales que conoces: SofiaPlus, SGVA, SEP_SENA.
                        3. Tus respuestas deben ser precisas y basadas en la normativa SENA.
                        
                        Consulta del Instructor: ${prompt}`
                        }]
                    }]
                })
            });
            const data = await response.json();
            return data.candidates[0].content.parts[0].text.replace(/\n/g, '<br>');
        } catch (error) {
            console.error("Gemini Error:", error);
            return "Lo siento, Instructor. Mi conexión con el motor de IA ha tenido un hipo. ¿Podría intentarlo de nuevo?";
        }
    }

    const processQuery = async (q) => {
        showTyping();
        const response = await callGemini(q);
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
        addMsg(response, 'bot');
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
