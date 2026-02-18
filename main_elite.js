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

    // Initialize chat history from localStorage
    let chatHistory = [];
    try {
        const saved = localStorage.getItem('molly_chat_history');
        if (saved) chatHistory = JSON.parse(saved);
    } catch (e) {
        console.warn('Could not load chat history:', e);
    }

    // Gemini REST API endpoint (using v1 instead of v1beta to avoid 404)
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    async function callGeminiAPI(userMessage) {
        try {
            // Extract documentation context
            const docContext = MOLLY_CONTEXT.extractPageContext();

            // Build system instruction
            const systemInstruction = `Eres MOLLY (🐶), la Border Collie asistente del instructor SENA para la Etapa Productiva.

TU PERSONALIDAD:
- Eres una Border Collie inteligente, leal y meticulosa
- Usas metáforas de pastoreo cuando es apropiado ("rastrear", "vigilar", "supervisar")
- Eres profesional pero amigable
- Priorizas la precisión y el cumplimiento normativo

TU MISIÓN:
1. PRIORIZAR DOCUMENTACIÓN INTERNA: Responde basándote en el contexto del manual del instructor
2. SER ESPECÍFICA: Cita números de formatos (F-147, F-023), artículos del Acuerdo 009, momentos de la Guía 040
3. DAR RESPUESTAS EXTENDIDAS: No seas breve. Explica el contexto, los plazos, las consecuencias
4. ALERTAR SOBRE RIESGOS: Menciona hallazgos de auditoría, plazos críticos, errores comunes
5. SOLO COMO ÚLTIMO RECURSO: Si no encuentras la respuesta en tu documentación, sugiere búsqueda externa

FORMATO DE RESPUESTA:
- Usa HTML para formato (negrita con <b>, saltos con <br>, listas)
- Estructura tus respuestas con secciones claras
- Incluye ejemplos prácticos cuando sea relevante
- Termina con un consejo o recomendación práctica

CONTEXTO DE DOCUMENTACIÓN:
${docContext.substring(0, 15000)}

RECUERDA: Nunca inventes información. Si no sabes algo, admítelo y sugiere dónde buscar.`;

            // Build contents array
            const contents = [];

            // Add system instruction
            contents.push({
                role: "user",
                parts: [{ text: systemInstruction }]
            });
            contents.push({
                role: "model",
                parts: [{ text: "Entendido. Soy MOLLY, tu asistente Border Collie. Estoy lista para ayudarte." }]
            });

            // Add recent chat history (last 4 messages)
            const recentHistory = chatHistory.slice(-4);
            for (const msg of recentHistory) {
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                });
            }

            // Add current message
            contents.push({
                role: "user",
                parts: [{ text: userMessage }]
            });

            // Call API
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                console.error('Invalid API response:', data);
                throw new Error('Respuesta inválida de la API');
            }

            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    const processQuery = async (q) => {
        const query = q.trim();
        if (!query) return;

        showTyping();

        try {
            // Call Gemini API
            const response = await callGeminiAPI(query);

            // Remove typing indicator
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();

            // Add response
            addMsg(response, 'bot');

            // Save to history
            chatHistory.push({ role: 'user', content: query });
            chatHistory.push({ role: 'assistant', content: response });

            // Keep only last 20 messages
            if (chatHistory.length > 20) {
                chatHistory = chatHistory.slice(-20);
            }

            // Save to localStorage
            try {
                localStorage.setItem('molly_chat_history', JSON.stringify(chatHistory));
            } catch (e) {
                console.warn('Could not save chat history:', e);
            }

        } catch (error) {
            console.error('Error getting response:', error);
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();

            let errorMsg = "❌ Ocurrió un error al procesar tu consulta. ";

            const errorStr = error.toString().toLowerCase();
            if (errorStr.includes('quota') || errorStr.includes('429')) {
                errorMsg += "Se ha excedido la cuota de la API. Por favor, intenta más tarde.";
            } else if (errorStr.includes('api') || errorStr.includes('key')) {
                errorMsg += "Hay un problema con la configuración de la API.";
            } else if (errorStr.includes('network') || errorStr.includes('fetch')) {
                errorMsg += "No se pudo conectar al servicio. Verifica tu conexión a internet.";
            } else {
                errorMsg += "Por favor, intenta nuevamente.";
            }

            addMsg(errorMsg, 'bot');
        }
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
