/*
 * -----------------------------------------------------------------
 * EL CEREBRO DE AULITA VIRTUAL (v4 - Totalmente Secuencial)
 * -----------------------------------------------------------------
 * Todos los pasos usan el formato "sequence" para un control
 * total sobre el orden de texto, imágenes y enlaces.
 * -----------------------------------------------------------------
 */

const chatFlow = {
    // ---------------------------------
    // INICIO Y VALIDACIÓN DE ROL
    // ---------------------------------
    "inicio": {
        "sequence": [
            { "type": "text", "content": "¡Hola! Soy Tecno-Ruiz, tu asistente de soporte académico." },
            { "type": "text", "content": "Para poder ayudarte de la mejor manera, necesito algunos datos básicos." }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Sí, continuar", "siguiente_paso": "pedir_rol" },
            { "texto": "No, gracias", "siguiente_paso": "despedida_no_continua" }
        ]
    },
    "despedida_no_continua": {
        "sequence": [
            { "type": "text", "content": "Entendido. Si cambias de opinión, simplemente reinicia la conversación. ¡Hasta pronto! 👋" }
        ],
        "tipo": "final"
    },
    "pedir_rol": {
        "sequence": [
            { "type": "text", "content": "Por favor, indícame si eres estudiante o docente." }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Soy Estudiante", "siguiente_paso": "pedir_nombre" },
            { "texto": "Soy Docente", "siguiente_paso": "validar_docente" }
        ]
    },
    "validar_docente": {
        "sequence": [
            { "type": "text", "content": "Esta es una sección solo para docentes. Por favor, ingresa la clave de acceso:" }
        ],
        "tipo": "texto",
        "variable": "clave_docente",
        "siguiente_paso": "pedir_nombre",
        "paso_fallido": "pedir_rol"
    },

    // ---------------------------------
    // RECOLECCIÓN DE DATOS (COMÚN)
    // ---------------------------------
    "pedir_nombre": {
        "sequence": [
            { "type": "text", "content": "Por favor, indícame tu nombre y apellido." }
        ],
        "tipo": "texto",
        "variable": "nombre",
        "siguiente_paso": "pedir_correo"
    },
    "pedir_correo": {
        "sequence": [
            { "type": "text", "content": "Gracias, {nombre}." },
            { "type": "text", "content": "Ahora, ¿podrías facilitarme tu correo institucional?" }
        ],
        "tipo": "texto",
        "variable": "correo",
        "siguiente_paso": "redirigir_menu_principal"
    },

    // ---------------------------------
    // MENÚS PRINCIPALES (POR ROL)
    // ---------------------------------
    "menu_principal_estudiante": {
        "sequence": [
            { "type": "text", "content": "¡Excelente, {nombre}! 😊" },
            { "type": "text", "content": "Cuéntame, ¿con qué tema necesitas ayuda hoy?" }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "a) Aula Virtual", "siguiente_paso": "menu_aula_virtual_estudiante" },
            { "texto": "b) Teams", "siguiente_paso": "menu_teams_estudiante" },
            { "texto": "c) Otro problema técnico", "siguiente_paso": "otro_problema" },
            { "texto": "d) Requiero una asesoría", "siguiente_paso": "asesoria" }
        ]
    },
    "menu_principal_docente": {
        "sequence": [
            { "type": "text", "content": "¡Excelente, {nombre}! 😊 (Portal Docente)" },
            { "type": "text", "content": "Cuéntame, ¿con qué tema necesitas ayuda hoy?" }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "a) Aula Virtual", "siguiente_paso": "menu_aula_virtual_docente" },
            { "texto": "b) Teams", "siguiente_paso": "menu_teams_docente" },
            { "texto": "c) Otro problema técnico", "siguiente_paso": "otro_problema" },
            { "texto": "d) Requiero una asesoría", "siguiente_paso": "asesoria" }
        ]
    },

    // ---------------------------------
    // 1. FLUJO AULA VIRTUAL (ESTUDIANTE)
    // ---------------------------------
    "menu_aula_virtual_estudiante": {
        "sequence": [
            { "type": "text", "content": "Perfecto, {nombre}. Indícame qué tipo de problema tienes con la Aula Virtual:" }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "a) Cargar un recurso", "siguiente_paso": "aula_recurso" },
            { "texto": "b) No carga correctamente", "siguiente_paso": "aula_no_carga" },
            { "texto": "c) No encuentro mi curso", "siguiente_paso": "aula_no_encuentro" },
            { "texto": "d) ¿Dónde están mis cursos?", "siguiente_paso": "aula_no_encuentro" }
        ]
    },
    "aula_recurso": {
        "sequence": [
            { "type": "text", "content": "Para subir un recurso, nos dirigimos la tarea correspondiente y damos clic en agregar entrega:" },
            { "type": "image", "src": "assets/imagen1.jpg" },
            { "type": "text", "content": "Luego, dentro de esta acción hacemos clic como indica la imagen:" },
            { "type": "image", "src": "assets/imagen2.jpg" },
            { "type": "text", "content": "A continuación en subir un archivo y seguido en seleccionar archivo:" },
            { "type": "image", "src": "assets/imagen3.png" },
            { "type": "text", "content": "Luego elegimos el archivo correspondiente y clic en abrir:" },
            { "type": "image", "src": "assets/imagen4.jpg" },
            { "type": "text", "content": "Hacemos clic en guardar cambios:" },
            { "type": "image", "src": "assets/imagen5.jpg" },
            { "type": "text", "content": "Y verificamos que figure como entregado:" },
            { "type": "image", "src": "assets/imagen6.jpg" },
            { "type": "text", "content": "Si presenta un problema, por favor envía un correo a 📧 aula.virtual@uarm.pe explicando tu caso y adjuntando las capturas correspondientes." }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Volver al menú principal", "siguiente_paso": "redirigir_menu_principal" },
            { "texto": "Terminar chat", "siguiente_paso": "despedida_final" }
        ]
    },
    "aula_no_encuentro": {
        "sequence": [
            { "type": "text", "content": "En primer paso verificaremos recordar que debemos estar matriculados y estar en la fecha correspondiente de habilitación de curso, una vez validado esto nos vamos a mis cursos:" },
            { "type": "image", "src": "assets/imagen7.jpg" },
            { "type": "text", "content": "Estando en mis cursos, revisamos los filtros de visualización:" },
            { "type": "image", "src": "assets/imagen8.jpg" },
            { "type": "text", "content": "y seleccionamos todos:" },
            { "type": "image", "src": "assets/imagen10.jpg" },
            { "type": "text", "content": "con ello nos permitirá ver todos los cursos:" },
            { "type": "image", "src": "assets/imagen9.jpg" },
            { "type": "text", "content": "Si con ello no logra visualizar sus cursos En este caso, envía un correo a 📧 contacto.sar@uarm.pe, con copia a aula.virtual@uarm.pe, indicando tu nombre completo y curso faltante." }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Volver al menú principal", "siguiente_paso": "redirigir_menu_principal" },
            { "texto": "Terminar chat", "siguiente_paso": "despedida_final" }
        ]
    },

    // ---------------------------------
    // 2. FLUJO AULA VIRTUAL (DOCENTE)
    // ---------------------------------
    "menu_aula_virtual_docente": {
        "sequence": [
            { "type": "text", "content": "Perfecto, {nombre}. Indícame qué tipo de problema tienes con la Aula Virtual:" }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "a) No carga correctamente", "siguiente_paso": "aula_no_carga" },
            { "texto": "b) No encuentro mi curso", "siguiente_paso": "aula_no_encuentro" }
        ]
    },

    // ---------------------------------
    // 3. FLUJO TEAMS (ESTUDIANTE)
    // ---------------------------------
    "menu_teams_estudiante": {
        "sequence": [
            { "type": "text", "content": "Indica qué tipo de inconveniente tienes con Microsoft Teams:" }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "a) Problemas para unirme a una reunión", "siguiente_paso": "teams_reunion" },
            { "texto": "b) Problemas para entrar por la aplicación", "siguiente_paso": "teams_app" },
            { "texto": "c) Cómo ingresar a una reunión", "siguiente_paso": "teams_ingresar" }
        ]
    },

    // ---------------------------------
    // 4. FLUJO TEAMS (DOCENTE)
    // ---------------------------------
    "menu_teams_docente": {
        "sequence": [
            { "type": "text", "content": "Indica qué tipo de inconveniente tienes con Microsoft Teams:" }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "a) Problemas para unirme a una reunión", "siguiente_paso": "teams_reunion" },
            { "texto": "b) Problemas para entrar por la aplicación", "siguiente_paso": "teams_app" },
            { "texto": "c) Cómo crear una reunión Teams", "siguiente_paso": "teams_crear" },
            { "texto": "d) Cómo ingresar a una reunión", "siguiente_paso": "teams_ingresar" }
        ]
    },
    "teams_crear": {
        "sequence": [
            { "type": "text", "content": "Si estás presentando problemas para crear una sala Teams por favor ingresa al siguiente enlace, donde podrás encontrar una guía paso a paso de cómo realizar dicha acción:" },
            { "type": "link", "text": "🎥 Crear sala Teams (Video)", "url": "https://correouarmedu-my.sharepoint.com/:v:/g/personal/junior_pari_uarm_pe/EUrrXi1ao8lAjSqLMHvUuDYBRFKtZZfnEqmL1qGLEQh3aA?e=MrcRYA" },
            { "type": "link", "text": "🎥 Crear reunión en Serie (Video)", "url": "https://correouarmedu-my.sharepoint.com/:v:/g/personal/junior_pari_uarm_pe/Ebf4J8Gy9EVDuBVxJEm8NzwBlclrLmcvlckLsMQBqYRJwg?e=9AHexP" }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Volver al menú principal", "siguiente_paso": "redirigir_menu_principal" },
            { "texto": "Terminar chat", "siguiente_paso": "despedida_final" }
        ]
    },

    // ---------------------------------
    // 5. PASOS COMUNES (COMPARTIDOS POR AMBOS ROLES)
    // ---------------------------------
    "aula_no_carga": {
        "sequence": [
            { "type": "text", "content": "Si presenta dificultades y no logra visualizar correctamente el aula virtual, le sugerimos ingresar desde una ventana de incógnito o borrar la caché del navegador." },
            { "type": "text", "content": "Asimismo, verifique su conexión a internet y, en última instancia, intente acceder desde otro dispositivo." },
            { "type": "text", "content": "👉 (Aquí se puede incluir una guía paso a paso o un enlace explicativo)." },
            { "type": "text", "content": "En caso el inconveniente persista, por favor envíe un correo a 📧 aula.virtual@uarm.pe, detallando su situación y adjuntando las capturas correspondientes." }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Volver al menú principal", "siguiente_paso": "redirigir_menu_principal" },
            { "texto": "Terminar chat", "siguiente_paso": "despedida_final" }
        ]
    },
    "teams_reunion": {
        "sequence": [
            { "type": "text", "content": "Asegúrese de estar conectado con su cuenta institucional como cuenta principal en Microsoft Teams. Si tiene otras cuentas personales abiertas, por favor cierre sesión en ellas." },
            { "type": "text", "content": "Si el problema continúa, pruebe ingresar desde otro navegador donde no tenga otras cuentas de correo vinculadas. Si está usando la aplicación de Teams, revise que su cuenta institucional sea la principal; de no ser así, le recomendamos acceder desde el navegador." }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Volver al menú principal", "siguiente_paso": "redirigir_menu_principal" },
            { "texto": "Terminar chat", "siguiente_paso": "despedida_final" }
        ]
    },
    "teams_app": {
        "sequence": [
            { "type": "text", "content": "Asegúrese de que su cuenta institucional esté configurada como la principal." },
            { "type": "text", "content": "Para verificarlo, haga clic en su foto de perfil ubicada en la parte superior derecha de Microsoft Teams:" },
            { "type": "image", "src": "assets/imagen11.jpg" },
            { "type": "text", "content": "Allí podrá visualizar todas las cuentas vinculadas." },
            { "type": "image", "src": "assets/imagen12.jpg" },
            { "type": "text", "content": "Seleccione su cuenta institucional; en caso no se encuentre iniciada, diríjase a “Agregar cuenta” e inicie sesión con sus credenciales institucionales. De esta manera, evitará inconvenientes de acceso o sincronización." },
            { "type": "image", "src": "assets/imagen13.jpg" },
            { "type": "text", "content": "Si el problema continúa, intenta ingresar desde la versión web de Teams para evitar demoras." }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Volver al menú principal", "siguiente_paso": "redirigir_menu_principal" },
            { "texto": "Terminar chat", "siguiente_paso": "despedida_final" }
        ]
    },
    "teams_ingresar": {
        "sequence": [
            { "type": "text", "content": "Para comenzar Ingrese a su curso correspondiente. En la parte inicial encontrará la opción “Reuniones Teams”:" },
            { "type": "image", "src": "assets/imagen14.jpg" },
            { "type": "text", "content": "Al acceder, se le solicitará iniciar sesión con su cuenta institucional; para ello, haga clic en “Iniciar sesión”:" },
            { "type": "image", "src": "assets/imagen15.jpg" },
            { "type": "text", "content": "A continuación, podrá visualizar todas las reuniones programadas en Teams. Para ingresar a una reunión, seleccione la opción “Unirse”:" },
            { "type": "image", "src": "assets/imagen16.jpg" },
            { "type": "text", "content": "Finalmente, el sistema le mostrará dos alternativas de acceso: mediante la aplicación de escritorio o desde la versión web, según su preferencia:" },
            { "type": "image", "src": "assets/imagen17.jpg" },
            { "type": "text", "content": "En caso luego de iniciar sesión no aprecie ninguna reunión, comunícate con tu docente mediante un correo para confirmar el enlace y copia a 📧 contacto.sar@uarm.pe." }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Volver al menú principal", "siguiente_paso": "redirigir_menu_principal" },
            { "texto": "Terminar chat", "siguiente_paso": "despedida_final" }
        ]
    },
    "asesoria": {
        "sequence": [
            { "type": "text", "content": "En caso presente alguna dificultad adicional o requiera un acompañamiento personalizado, puede reservar una asesoría individual a través del siguiente enlace:" },
            { "type": "link", "text": "🌐 Reservar Asesoría en línea", "url": "https://outlook.office.com/book/AsesoraenLinea@uarm.pe/s/WIlOf_muhkyF7M53Qgqwkg2?ismsaljsauthenabled=true" }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Volver al menú principal", "siguiente_paso": "redirigir_menu_principal" },
            { "texto": "Terminar chat", "siguiente_paso": "despedida_final" }
        ]
    },
    "otro_problema": {
        "sequence": [
            { "type": "text", "content": "En caso presente dificultades para actualizar su contraseña, problemas con el correo electrónico o con el portal del estudiante, debe comunicarse al siguiente correo:\n📧 soporte.ruiz@uarm.pe" },
            { "type": "text", "content": "Si presenta problemas con sus horarios, o requiere información sobre sus cursos o docentes, puede escribir a:\n📧 contacto.sar@uarm.pe" },
            { "type": "text", "content": "En caso tenga inconvenientes con el aula virtual o necesite asistencia relacionada a la plataforma, puede contactarse con el equipo de soporte a través de:\n📧 aula.virtual@uarm.pe" }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Volver al menú principal", "siguiente_paso": "redirigir_menu_principal" },
            { "texto": "Terminar chat", "siguiente_paso": "despedida_final" }
        ]
    },

    // ---------------------------------
    // 6. FIN DEL CHAT
    // ---------------------------------
    "despedida_final": {
        "sequence": [
            { "type": "text", "content": "¡Un gusto ayudarte, {nombre}! Vuelve pronto. 👋" }
        ],
        "tipo": "opciones",
        "opciones": [
            { "texto": "Reiniciar chat", "siguiente_paso": "inicio" }
        ]
    }
};