/*
 * -----------------------------------------------------------------
 * EL MOTOR DE AULITA VIRTUAL (v5 - Con Session_ID)
 * -----------------------------------------------------------------
 * ¡NUEVO! Genera un ID de sesión único al cargar
 * y lo envía con cada log a Google Sheets.
 * -----------------------------------------------------------------
 */

/* * -----------------------------------------------------------------
 * CONFIGURACIÓN OBLIGATORIA
 * -----------------------------------------------------------------
 */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwb_GlmAw5RabmUCsq4bnn-daIbM7MNZvk45SmTUZTmleZsZPsEtUPqY39CTTq40ahu/exec";
const TEACHER_PASSWORD = "Docente2025_Uarm";

// ¡NUEVO! Se genera un ID único para esta "sesión" (carga de página)
const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);

// --- Ejecutar todo cuando el DOM esté cargado ---
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REFERENCIAS A ELEMENTOS DEL DOM ---
    const toggleButton = document.getElementById('chatbot-toggle-button');
    const chatContainer = document.getElementById('chatbot-container');
    const closeButton = document.getElementById('close-chat-btn');
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');
    const inputArea = document.getElementById('chat-input-area');
    const inputField = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');

    // --- 2. VARIABLES DE ESTADO ---
    let currentStep = "inicio";
    let userData = {
        nombre: "",
        correo: "",
        rol: "estudiante"
    };

    // --- 3. LÓGICA PARA MOSTRAR/OCULTAR CHAT Y LIGHTBOX ---
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('show');
    });

    closeButton.addEventListener('click', () => {
        chatContainer.classList.remove('show');
    });

    function openLightbox(src) {
        lightboxImage.src = src;
        lightboxImage.classList.remove('hidden');
        lightboxVideo.classList.add('hidden');
        lightbox.classList.remove('hidden');
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
        lightboxImage.src = "";
    }

    // --- 4. LÓGICA CENTRAL DEL PROCESADOR DE FLUJO ---
    
    function processStep(stepName) {
        const step = chatFlow[stepName];
        if (!step) {
            console.error(`Error: No se encontró el paso "${stepName}" en flow.js`);
            return;
        }

        currentStep = stepName;
        optionsContainer.innerHTML = '';
        
        let index = 0;
        const delay = 400;

        function showNextItem() {
            if (!step.sequence || index >= step.sequence.length) {
                if (step.tipo === 'opciones') {
                    showOptions(step.opciones);
                    inputArea.classList.add('hidden');
                } else if (step.tipo === 'texto') {
                    inputArea.classList.remove('hidden');
                    inputField.focus();
                } else if (step.tipo === 'final') {
                    inputArea.classList.add('hidden');
                }
                return;
            }

            const item = step.sequence[index];

            if (item.type === 'text') {
                addBotMessage(item.content);
            } else if (item.type === 'image') {
                addImageThumbnail(item.src);
            } else if (item.type === "link") {
                addLinkCard(item.text, item.url);
            }
            
            index++;
            setTimeout(showNextItem, delay);
        }

        showNextItem();
    }

    // --- 5. FUNCIONES DE VISUALIZACIÓN (RENDER) ---

    function addBotMessage(text) {
        const processedText = text.replace(/{nombre}/g, userData.nombre);
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot-message';
        msgDiv.textContent = processedText; 
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function showOptions(options) {
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option.texto;
            button.dataset.nextStep = option.siguiente_paso; 
            optionsContainer.appendChild(button);
        });
    }

    function addImageThumbnail(src) {
        const img = document.createElement('img');
        img.className = 'chat-image-thumbnail';
        img.src = src;
        img.dataset.src = src;
        messagesContainer.appendChild(img);
        scrollToBottom();
    }

    function addLinkCard(text, url) {
        const link = document.createElement('a');
        link.className = 'chat-link-card';
        link.href = url;
        link.textContent = text;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        messagesContainer.appendChild(link);
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function resetChat() {
        messagesContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
        // ¡Importante! No reseteamos el 'sessionId', 
        // pero sí el resto de los datos del usuario.
        userData = { nombre: "", correo: "", rol: "estudiante" };
        processStep("inicio");
    }

    function redirectToMenu() {
        if (userData.rol === 'docente') {
            processStep('menu_principal_docente');
        } else {
            processStep('menu_principal_estudiante');
        }
    }

    // --- 6. MANEJADORES DE EVENTOS DEL USUARIO ---

    optionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-button')) {
            const text = e.target.textContent;
            const nextStep = e.target.dataset.nextStep;
            
            addUserMessage(text);
            logToSheet("Opcion", text, nextStep); // ¡Envía el log!
            
            if (nextStep === 'inicio') {
                resetChat();
            } else if (nextStep === 'redirigir_menu_principal') {
                redirectToMenu();
            } else {
                processStep(nextStep);
            }
        }
    });

    messagesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-image-thumbnail')) {
            const src = e.target.dataset.src;
            openLightbox(src);
        }
    });

    function handleTextInput() {
        const text = inputField.value.trim();
        if (text === '') return;

        const stepConfig = chatFlow[currentStep];

        if (currentStep === 'validar_docente') {
            addUserMessage("******");
            
            if (text === TEACHER_PASSWORD) {
                userData.rol = 'docente';
                logToSheet("Acceso Docente", "Éxito", stepConfig.siguiente_paso); // ¡Envía el log!
                inputField.value = '';
                processStep(stepConfig.siguiente_paso);
            } else {
                logToSheet("Acceso Docente", "Fallo de clave", stepConfig.paso_fallido); // ¡Envía el log!
                inputField.value = '';
                addBotMessage("Clave incorrecta. Por favor, selecciona tu rol nuevamente.");
                processStep(stepConfig.paso_fallido);
            }
            return;
        }

        addUserMessage(text);
        
        if (stepConfig.variable) {
            userData[stepConfig.variable] = text;
        }

        logToSheet(stepConfig.variable || "Texto", text, stepConfig.siguiente_paso); // ¡Envía el log!
        
        inputField.value = '';
        
        if (stepConfig.siguiente_paso === 'redirigir_menu_principal') {
            redirectToMenu();
        } else {
            processStep(stepConfig.siguiente_paso);
        }
    }

    sendButton.addEventListener('click', handleTextInput);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleTextInput();
        }
    });

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') {
            closeLightbox();
        }
    });

    // --- 7. FUNCIÓN DE LOG A GOOGLE SHEETS (ACTUALIZADA) ---
    function logToSheet(dataType, value, nextStep) {
        
        if (GOOGLE_SCRIPT_URL === "AQUÍ_VA_TU_URL_DE_GOOGLE_APPS_SCRIPT") {
            console.warn("ADVERTENCIA: GOOGLE_SCRIPT_URL no está configurada.");
            return;
        }

        const data = {
            sessionId: sessionId, // <-- ¡AQUÍ ESTÁ EL CAMBIO!
            timestamp: new Date().toLocaleString("es-PE", { timeZone: "America/Lima" }),
            nombre: userData.nombre || "N/A",
            correo: userData.correo || "N/A",
            rol: userData.rol || "N/A",
            tipo_interaccion: dataType,
            valor: value,
            siguiente_paso: nextStep || "N/A"
        };

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        })
        .then(response => response.json())
        .then(data => {
            if(data.result === "success") {
                console.log("Datos enviados correctamente a Google Sheet.");
            } else {
                console.warn("El script de Google devolvió un error:", data);
            }
        })
        .catch(error => {
            console.error("Error al enviar a Google Sheet:", error);
        });
    }

    // --- 8. INICIAR EL CHAT ---
    resetChat();
});