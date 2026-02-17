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

    const showTyping = () => {
        const dot = document.createElement('div');
        dot.className = 'msg bot typing';
        dot.innerHTML = '<i class="fas fa-microchip fa-spin"></i> Procesando motor normativo v3.5...';
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

            let r = "Instructor, no reconozco ese término en los niveles locales. <b>¿Desea que realice una búsqueda en la red global del SENA?</b><br><br><a href='https://www.google.com/search?q=SENA+Guia+040+" + encodeURIComponent(query) + "' target='_blank' class='btn-mini' style='background:var(--sena-verde); color:white;'>Buscar en Red SENA</a>";

            const intents = [
                {
                    keys: ['hola', 'bienvenido', 'saludo'],
                    response: "Buen día, Instructor. Soy <b>SENA_INST_BOT v3.5</b>. Mi base de conocimientos ha sido fortalecida con la teoría íntegra de la <b>Guía 040</b> y el <b>Acuerdo 009 de 2024</b>. ¿Qué proceso técnico o normativo desea desglosar hoy?"
                },
                {
                    keys: ['tyt', 'examen', 'prueba', 'presento'],
                    response: "<b>Marco Normativo de Pruebas TyT:</b><br>Según la normativa institucional y los lineamientos de certificación, la presentación de las <b>Pruebas Saber TyT</b> es un **requisito obligatorio** para el proceso de certificación de los aprendices de nivel Tecnólogo.<br><br><b>¿Qué sucede si un aprendiz no las presenta?</b><br>1. <b>Bloqueo de Certificación:</b> El aprendiz no podrá optar al título hasta que presente la prueba en la siguiente convocatoria oficial del ICFES.<br>2. <b>Incumplimiento Administrativo:</b> El Centro de Formación no podrá registrar el cierre definitivo del programa.<br>3. <b>Excepción:</b> Solo causas de fuerza mayor debidamente documentadas pueden ser consideradas ante el Comité, pero la obligación de presentar la prueba persiste para el grado.<br><br><a href='https://www.icfes.gov.co/examenes-saber-tyt' target='_blank' style='color:var(--sena-verde)'>Ver fechas ICFES</a>"
                },
                {
                    keys: ['momento', 'paso', 'etapa', 'fase'],
                    response: "<b>Desglose de los 6 Momentos (Guía 040):</b><br>1. <b>Momento 1 (Preparación):</b> Socialización de la Etapa Productiva antes de terminar la lectiva.<br>2. <b>Momento 2 (Selección):</b> Registro de la alternativa en SofiaPlus.<br>3. <b>Momento 3 (Concertación):</b> Realización de la Visita 1. Definición del Plan de Trabajo (F023) en los primeros 15 días.<br>4. <b>Momento 4 (Seguimiento):</b> Ejecución y revisión de bitácoras (Visita 2 al mes 3).<br>5. <b>Momento 5 (Evaluación):</b> Visita 3 final. Emisión parcial del juicio.<br>6. <b>Momento 6 (Certificación):</b> Verificación documental final y Juicio Evaluativo Aprobado.<br><br><b>¿Desea profundizar en algún momento específico?</b>"
                },
                {
                    keys: ['acuerdo 009', 'reglamento', 'sancion', 'comite'],
                    response: "<b>Teoría del Acuerdo 009 de 2024 (Reglamento):</b><br>Este acuerdo redefine los deberes y prohibiciones. En Etapa Productiva, es fundamental:<br>• **Art. 22:** Obligación de mantener la vinculación vigente y reportar novedades.<br>• **Art. 25:** Trámite de novedades (Traslados, aplazamientos, retiros).<br>• **Inasistencia:** Si el aprendiz falta 3 días consecutivos sin justificar a la empresa, se inicia proceso de **Deserción**.<br>• **Comité de Evaluación:** Procedimiento administrativo para resolver faltas leves, graves o gravísimas detectadas durante la supervisión."
                },
                {
                    keys: ['f023', 'f147', 'bitacora', 'formato'],
                    response: "<b>Protocolo Técnico de Formatos:</b><br>1. <b>GFPI-F-023:</b> Es el instrumento de Planeación, Seguimiento y Evaluación. Se diligencia en 3 etapas. Verifique que las firmas coincidan con los representantes legales o jefes delegados.<br>2. <b>GFPI-F-147 (Bitácora):</b> Registro descriptivo de actividades. <br>• **Teoría:** Debe demostrar la aplicación de las competencias del perfil de salida.<br>• **Procedimiento:** El aprendiz entrega cada quincena, el instructor retroalimenta en máximo 5 días hábiles."
                },
                {
                    keys: ['proceso', 'supervisión', 'instructor', 'visita'],
                    response: "<b>El Proceso de Supervisión Técnica:</b><br>Como instructor, su rol trasciende lo administrativo; es un **Mentor Técnico**. <br><br><b>Pasos de Auditoría:</b><br>1. **Validación de Entorno:** Verificar que la empresa ofrezca condiciones de seguridad y salud (SST).<br>2. **Control de Evidencias:** No solo es recibir bitácoras, es auditar que lo que el aprendiz hace corresponda al programa.<br>3. **Verificación SofiaPlus:** El registro de inasistencias o novedades debe ser oportuno para evitar reprocesos en la certificación."
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
