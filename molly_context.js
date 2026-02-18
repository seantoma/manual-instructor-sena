/**
 * MOLLY Documentation Context Extractor
 * Extracts text content from manual pages to build RAG context for Gemini API
 */

const MOLLY_CONTEXT = {
    // Cache for extracted documentation
    cache: null,

    /**
     * Extracts text content from the current page and builds context
     */
    extractPageContext: function () {
        if (this.cache) return this.cache;

        let context = "MANUAL DEL INSTRUCTOR SENA - ETAPA PRODUCTIVA\n\n";

        // Extract main content from the page
        const mainContent = document.querySelector('main') || document.body;
        const textContent = this.extractTextFromElement(mainContent);

        context += textContent;

        // Add specific knowledge base
        context += this.getStaticKnowledgeBase();

        this.cache = context;
        return context;
    },

    /**
     * Recursively extracts text from an element, preserving structure
     */
    extractTextFromElement: function (element) {
        let text = '';

        // Skip script, style, and chat elements
        if (element.tagName === 'SCRIPT' ||
            element.tagName === 'STYLE' ||
            element.id === 'chat-window' ||
            element.id === 'ai-fab') {
            return '';
        }

        // Add headings with markers
        if (element.tagName && element.tagName.match(/^H[1-6]$/)) {
            text += '\n\n## ' + element.textContent.trim() + '\n';
            return text;
        }

        // Process child nodes
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const trimmed = node.textContent.trim();
                if (trimmed) {
                    text += trimmed + ' ';
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                text += this.extractTextFromElement(node);
            }
        }

        return text;
    },

    /**
     * Static knowledge base with core SENA regulations
     */
    getStaticKnowledgeBase: function () {
        return `

=== GUÍA GFPI-G-040: LOS 6 MOMENTOS DE SUPERVISIÓN ===

La Guía 040 establece el protocolo oficial para el seguimiento de la Etapa Productiva:

MOMENTO 1 - PLANEACIÓN:
- Registro de la alternativa en SofiaPlus
- Inicio formal del proceso de supervisión
- Verificación de requisitos previos del aprendiz

MOMENTO 2 - CARGUE DE DOCUMENTOS:
- Verificación de contrato o documento legal
- Validación de afiliación a ARL
- Revisión de documentos iniciales de la empresa coformadora
- Plazo: Máximo 15 días hábiles tras inicio de etapa

MOMENTO 3 - CONCERTACIÓN:
- Primera bitácora (Formato F-147)
- Definición de plan de trabajo con el aprendiz
- Establecimiento de competencias a desarrollar
- Plazo: Máximo 15 días tras inicio de etapa productiva

MOMENTO 4 Y 5 - SEGUIMIENTO PARCIAL:
- Evaluación quincenal obligatoria
- Mínimo 12 bitácoras para proceso de 6 meses
- Visitas técnicas (virtuales o presenciales)
- Registro continuo en formato F-147
- Verificación de evidencias de aprendizaje

MOMENTO 6 - EVALUACIÓN FINAL:
- Juicio evaluativo final
- Verificación de paz y salvo
- Cargue de evidencias para certificación
- Validación de cumplimiento de todos los momentos anteriores

=== FORMATO F-147: BITÁCORA DE SEGUIMIENTO ===

ESTRUCTURA OBLIGATORIA:
- Competencia específica según programa de formación
- Actividades realizadas en el periodo (detalladas)
- Evidencias de aprendizaje generadas
- Observaciones del instructor

FRECUENCIA:
- QUINCENAL (no mensual, no semestral)
- Mínimo 12 bitácoras para 6 meses
- Máximo 24 bitácoras para 6 meses

PROTOCOLO DE FIRMAS:
1. Firma del Aprendiz
2. Firma/Sello del Jefe Inmediato (Empresa Coformadora)
3. Firma del Instructor de Seguimiento

CRÍTICO: Una bitácora sin detalle de actividades es considerada documento vacío en auditoría.

=== ACUERDO 009 DE 2024: REGLAMENTO DEL APRENDIZ ===

DESERCIÓN POR INASISTENCIA:
- 3 días hábiles consecutivos sin justificación = Reporte de deserción inmediata
- Justificaciones válidas: médicas o fuerza mayor (con soporte)

INCUMPLIMIENTO DE BITÁCORAS:
- No entrega de 2+ bitácoras consecutivas = Comité de evaluación
- Faculta al instructor para citar por incumplimiento de deberes

FALTAS GRAVÍSIMAS:
- Alteración de documentos (firmas falsas en F-147)
- Faltas a la ética en empresa coformadora
- Consecuencia: Cancelación de matrícula directa

NOVEDADES DE EMPRESA:
- Cambio de jefe inmediato: Reporte en máximo 5 días hábiles
- Terminación anticipada: Reporte inmediato
- Cambio de sede: Notificación previa

=== PRUEBAS SABER TYT (TECNÓLOGOS) ===

OBLIGATORIEDAD:
- Requisito de ley para certificación de tecnólogos
- NO es opcional

DOCUMENTACIÓN REQUERIDA:
- Reporte de Asistencia emitido por ICFES
- No es necesario esperar resultados, solo soporte de presentación

VERIFICACIÓN:
- Momento 6 (Cierre): Instructor debe verificar existencia del soporte
- Sin soporte = No se puede emitir juicio evaluativo "Aprobado"

EXCEPCIONES:
- Solo bajo circular expresa de dirección general
- Casos fortuitos documentados

=== FORMATOS GFPI PRINCIPALES ===

F-023 (JUICIO EVALUATIVO):
- Parte 1: Concertación inicial
- Parte 2: Seguimiento parcial
- Parte 3: Evaluación final
- Firmas digitales NO válidas sin autorización expresa

F-147 (BITÁCORA):
- Frecuencia quincenal obligatoria
- Debe incluir evidencias fotográficas según circular 2025
- Firmas originales requeridas

F-123 (PLAN DE MEJORAMIENTO):
- Cuando aprendiz no cumple con desempeño esperado
- Plazo: 30 días hábiles para ejecución
- Seguimiento semanal obligatorio

=== PLAZOS CRÍTICOS QUE GENERAN HALLAZGOS ===

15 DÍAS HÁBILES:
- Cargue de documentos iniciales (Momento 2)
- Primera bitácora de concertación (Momento 3)

QUINCENAL:
- Registro de bitácoras F-147
- Seguimiento de actividades

30 DÍAS HÁBILES:
- Ejecución de plan de mejoramiento
- Respuesta a novedades críticas

5 DÍAS HÁBILES:
- Reporte de cambios en empresa coformadora
- Notificación de novedades administrativas

=== ALTERNATIVAS DE ETAPA PRODUCTIVA ===

1. CONTRATO DE APRENDIZAJE:
   - Apoyo de sostenimiento: 50% SMLV (lectiva) / 75% SMLV (productiva)
   - ARL obligatoria a cargo de empresa
   - Duración según programa

2. VÍNCULO LABORAL:
   - Contrato de trabajo relacionado con formación
   - No requiere apoyo de sostenimiento adicional
   - Debe demostrar aplicación de competencias

3. PROYECTO PRODUCTIVO:
   - Emprendimiento propio
   - Plan de negocio aprobado
   - Seguimiento de indicadores de gestión

4. PASANTÍA:
   - Sin remuneración
   - Carta de compromiso empresa-aprendiz-SENA
   - Mínimo 6 meses

5. MONITORÍA:
   - Apoyo en procesos formativos del centro
   - Selección por mérito académico
   - Apoyo de sostenimiento por centro

6. UNIDAD PRODUCTIVA FAMILIAR:
   - Negocio familiar existente
   - Certificación de actividad económica
   - Aplicación de competencias del programa

7. SERVICIO MILITAR:
   - Válido como etapa productiva
   - Certificación de servicio
   - Análisis de competencias aplicadas

=== FUENTES OFICIALES SENA ===

SOFIAPLUS:
- Registro de fichas y aprendices
- Juicios evaluativos
- Gestión académica oficial

SGVA (Sistema de Gestión Virtual de Aprendices):
- Contratos de aprendizaje
- Seguimiento de empresas
- Reportes de novedades

TERRITORIUM (LMS):
- Evidencias de aprendizaje
- Actividades de proyecto
- Recursos formativos

ZENDESK ACADÉMICO:
- Soporte para procesos administrativos
- Consultas sobre normativa
- Casos especiales

=== CONSEJOS DE AUDITORÍA ===

DOCUMENTACIÓN CRÍTICA:
- Todas las bitácoras con firmas originales
- Evidencias fotográficas de visitas
- Correos de seguimiento a empresas
- Reportes de novedades con fecha

ERRORES COMUNES:
- Bitácoras mensuales (debe ser quincenal)
- Firmas digitales sin autorización
- Ausencia de evidencias en bitácoras
- No reportar novedades a tiempo

PROTECCIÓN DEL INSTRUCTOR:
- Documentar TODO en sistema de gestión
- Guardar correos de comunicación
- Registrar intentos de contacto fallidos
- Mantener carpeta digital por aprendiz

`;
    }
};
