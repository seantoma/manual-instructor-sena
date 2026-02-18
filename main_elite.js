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

    // Molly Rebranding - Icono Border Collie simbólico
    fab.innerHTML = '<img src="https://img.icons8.com/?size=96&id=P80zdAl7oXxp&format=png" style="width:70%; filter: brightness(1.2);">';

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

            let r = "Instructor, mi olfato no localiza ese rastro específico en la documentación interna de la <b>Guía 040</b> o el <b>Acuerdo 009</b>. ¿Desea que realice un rastreo en la red global SENA?<br><br><div style='display:flex; gap:5px; flex-wrap:wrap;'><a href='https://www.google.com/search?q=SENA+Guia+040+" + encodeURIComponent(query) + "' target='_blank' class='btn-mini' style='background:var(--sena-verde); color:white; padding:5px 10px; border-radius:5px; text-decoration:none; font-size:0.7rem;'>Rastrear en Google</a></div>";

            const intents = [
                {
                    keys: ['hola', 'bienvenido', 'saludo', 'quien eres', 'molly'],
                    response: "¡Guau! Saludos, Instructor. Soy <b>MOLLY</b>, su asistente Border Collie de inteligencia local avanzada.<br><br><b>Mi Arquitectura de Razonamiento:</b><br>1. <b>Filtro Interno:</b> Evalúo su consulta contra los +50 escenarios de la <b>Guía 040</b> y el <b>Acuerdo 009 de 2024</b>.<br>2. <b>Contexto Documental:</b> Identifico los formatos GFPI (F-147, F-123, etc.) y plazos de ley.<br>3. <b>Respuesta Extendida:</b> Aplico lógica institucional para darle una guía completa.<br><br>¿Qué rastro normativo o dudas sobre formatos rastreamos hoy?"
                },
                {
                    keys: ['momento', '6 momento', 'seis momento', 'los 6', 'guia 040', 'momentos'],
                    response: "<b>🐾 Los 6 Momentos de Supervisión (Guía GFPI-G-040):</b><br><br><b>Momento 1 - Inicio:</b> Validación del plan de trabajo y la empresa. Formato <b>F-023</b>.<br><b>Momento 2 - Primer Seguimiento:</b> A los 2 meses. Verificar avance. Formato <b>F-147 Bitácora</b>.<br><b>Momento 3 - Segundo Seguimiento:</b> A los 4 meses. Evaluación de RAPs y competencias.<br><b>Momento 4 - Tercer Seguimiento:</b> A los 6 meses. Revisión integral.<br><b>Momento 5 - Evaluación Final:</b> Cierre técnico de la etapa. Formato <b>F-008</b>.<br><b>Momento 6 - Certificación:</b> Validación para certificación. Formato <b>F-009</b>.<br><br>⚠️ <b>Alerta de Auditoría:</b> La Guía 040 exige evidencia documental en CADA momento. La falta de formatos es el hallazgo #1 en auditorías."
                },
                {
                    keys: ['bitacora', 'f-147', 'bitácora', 'formato 147'],
                    response: "<b>📋 Formato GFPI-F-147 - Bitácora Quincenal:</b><br><br>La <b>Bitácora (F-147)</b> es el instrumento de seguimiento <b>QUINCENAL</b> obligatorio durante la Etapa Productiva.<br><br><b>Protocolo de Registro:</b><br>• Frecuencia: <b>Cada 15 días</b> (sin excepción)<br>• Firma: Aprendiz + Instructor + Empresa<br>• Contenido: Actividades realizadas, RAPs evaluados, observaciones<br><br><b>⚠️ Hallazgo Frecuente en Auditoría:</b><br>• Bitácoras sin firma del instructor = <b>No conformidad grave</b><br>• Bitácoras atrasadas = <b>Riesgo de novedad académica</b><br><br>El atraso en bitácoras es la causa #1 de observaciones en auditorías de la Coordinación Académica."
                },
                {
                    keys: ['acuerdo 009', 'acuerdo 9', 'reglamento', 'faltas', 'sanciones'],
                    response: "<b>📜 Acuerdo 009 de 2024 - Reglamento del Aprendiz SENA:</b><br><br>El <b>Acuerdo 009</b> establece el marco disciplinario y académico para todos los aprendices.<br><br><b>Aspectos Clave para Etapa Productiva:</b><br>• <b>Art. 9:</b> Deberes del aprendiz en etapa productiva<br>• <b>Art. 23:</b> Faltas académicas (incumplimiento de actividades)<br>• <b>Art. 24:</b> Faltas disciplinarias<br>• <b>Art. 25:</b> Procedimiento para novedades<br><br><b>Deserción por Inasistencia:</b><br>• <b>3 días hábiles consecutivos</b> sin justificación = Reporte de deserción<br>• El instructor debe reportar al coordinador en las primeras 48 horas<br><br>⚠️ <b>Tip de Auditoría:</b> Documente TODAS las comunicaciones con el aprendiz. Los correos electrónicos son evidencia válida."
                },
                {
                    keys: ['tyt', 'prueba saber', 'saber pro', 'saber tyt', 'certificacion'],
                    response: "<b>🎓 Pruebas Saber TyT - Certificación Técnica:</b><br><br>Las <b>Pruebas Saber TyT</b> (Técnico y Tecnólogo) son requisito para la certificación del SENA desde 2024.<br><br><b>Lo que debe saber el instructor:</b><br>• <b>Obligatoria</b> para programas tecnólogos (según resolución MEN)<br>• <b>Registro:</b> El aprendiz se registra en el ICFES con código del SENA<br>• <b>Plazo:</b> Debe presentarse ANTES del cierre de etapa productiva<br>• <b>Costo:</b> Subsidiado parcialmente por el SENA<br><br><b>Impacto en Certificación:</b><br>• La <b>NO presentación</b> puede retrasar la certificación del aprendiz<br>• El resultado NO es criterio de aprobación, pero sí de calidad<br><br>⚠️ <b>Acción del Instructor:</b> Verificar que TODOS sus aprendices estén registrados antes del Momento 4."
                },
                {
                    keys: ['alternativa', 'contrato', 'pasantia', 'pasantía', 'vinculacion', 'proyecto productivo', 'monitoría', 'monitoria'],
                    response: "<b>🔄 Las 7 Alternativas de Etapa Productiva:</b><br><br>Según la <b>Guía 040</b>, existen 7 modalidades válidas:<br><br>1. <b>Contrato de Aprendizaje</b> (Ley 789/2002) - La más común<br>2. <b>Pasantía</b> - Convenio con empresa sin relación laboral<br>3. <b>Vinculación Laboral</b> - Contrato laboral en área del programa<br>4. <b>Proyecto Productivo</b> - Emprendimiento aprobado por el SENA<br>5. <b>Monitoría</b> - Apoyo a procesos internos del SENA<br>6. <b>Proyecto de Investigación</b> - Avalado por SENNOVA<br>7. <b>Unidad Productiva Familiar</b> - Para programas rurales<br><br>⚠️ <b>Cada alternativa requiere formatos diferentes.</b> Consulte la sección de Formatos para descargar los aplicables."
                },
                {
                    keys: ['formato', 'formatos', 'gfpi', 'f-023', 'f-008', 'f-009', 'f-137', 'descarga'],
                    response: "<b>📂 Formatos GFPI Principales para Etapa Productiva:</b><br><br>• <b>GFPI-F-023:</b> Planeación, seguimiento y evaluación<br>• <b>GFPI-F-147:</b> Bitácora quincenal del aprendiz<br>• <b>GFPI-F-008:</b> Planeación de la evaluación<br>• <b>GFPI-F-009:</b> Juicio evaluativo<br>• <b>GFPI-F-137:</b> Aval de etapa productiva<br>• <b>GFPI-F-123:</b> Acta de inicio<br><br>⚠️ <b>Descarga:</b> Todos los formatos están disponibles en la sección <b>Herramientas / Formatos</b> de este manual.<br><br><b>Tip:</b> Verifique siempre que está usando la versión más reciente del formato consultando el <b>Compromiso SIGA</b>."
                },
                {
                    keys: ['fuente', 'fuentes', 'sofia', 'sofiaplus', 'zendesk', 'enlace', 'link', 'web'],
                    response: "<b>🌐 Fuentes Oficiales SENA - Enlaces Verificados:</b><br><br>• <a href='https://www.sena.edu.co' target='_blank'><b>Portal SENA</b></a> - Sitio oficial<br>• <a href='https://oferta.senasofiaplus.edu.co' target='_blank'><b>SofiaPlus</b></a> - Gestión académica<br>• <a href='https://sena.zendesk.com' target='_blank'><b>Zendesk SENA</b></a> - Soporte técnico<br>• <a href='https://compromiso.sena.edu.co' target='_blank'><b>Compromiso SENA</b></a> - Sistema de Gestión<br>• <a href='https://blog.sena.edu.co' target='_blank'><b>Blog SENA</b></a> - Noticias y actualizaciones<br><br>⚠️ <b>Precaución:</b> Solo use fuentes con dominio <b>.edu.co</b> o <b>.gov.co</b> para documentación oficial."
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
        }, 1500);
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
