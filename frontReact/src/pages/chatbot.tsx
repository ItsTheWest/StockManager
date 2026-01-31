import { Menu } from '../components/menu';

export function Chatbot() {
    const historySections = [
        {
            title: "HOY",
            items: [
                "Redactar un correo de seguimiento al cliente",
                "Generar lógica responsive para el dashboard",
                "Crear estado de advertencia en formularios",
                "Sugerir paleta de colores corporativa",
                "Revisar componentes de UI",
                "Escribir documentación de API",
                "Optimizar rendimiento del frontend",
                "Implementar autenticación con JWT",
                "Diseñar wireframes para nueva sección",
                "Corregir bug en el módulo de pagos"
            ]
        },
        {
            title: "AYER",
            items: [
                "Mejorar acceso login de página",
                "Crear estado de advertencia",
                "Optimizar consultas SQL complejas",
                "Revisar logs del servidor de producción",
                "Actualizar dependencias del proyecto",
                "Configurar variables de entorno",
                "Implementar validación de formularios",
                "Refactorizar código legacy",
                "Crear componentes reutilizables",
                "Migrar base de datos a PostgreSQL"
            ]
        },
        {
            title: "ESTA SEMANA",
            items: [
                "Planificación de sprint mensual",
                "Diseño de arquitectura de microservicios",
                "Configuración de pipeline CI/CD",
                "Investigación de nuevas librerías UI",
                "Reunión de feedback con stakeholders",
                "Implementar sistema de notificaciones",
                "Optimizar tiempo de carga de imágenes",
                "Crear dashboard de analytics",
                "Integración con API de terceros",
                "Configurar sistema de caché Redis",
                "Desarrollar módulo de reportes",
                "Implementar búsqueda avanzada"
            ]
        },
        {
            title: "SEMANA PASADA",
            items: [
                "Migración de servidor a AWS",
                "Implementar sistema de roles y permisos",
                "Optimizar consultas de base de datos",
                "Crear componente de calendario",
                "Integrar pasarela de pagos Stripe",
                "Desarrollar API REST para mobile",
                "Configurar monitoreo con Datadog",
                "Implementar sistema de logs centralizado",
                "Crear tests unitarios para componentes",
                "Optimizar bundle size de JavaScript",
                "Implementar lazy loading de imágenes",
                "Configurar HTTPS y certificados SSL"
            ]
        },
        {
            title: "HACE DOS SEMANAS",
            items: [
                "Rediseño completo de la interfaz de usuario",
                "Implementar modo oscuro en toda la app",
                "Crear sistema de comentarios",
                "Desarrollar módulo de chat en tiempo real",
                "Integración con WebSockets",
                "Optimizar SEO de todas las páginas",
                "Implementar PWA con service workers",
                "Crear sistema de notificaciones push",
                "Desarrollar API GraphQL",
                "Migrar de JavaScript a TypeScript",
                "Implementar internacionalización (i18n)",
                "Crear documentación técnica completa"
            ]
        },
        {
            title: "ESTE MES",
            items: [
                "Planificación de roadmap Q1 2026",
                "Análisis de métricas de usuarios",
                "Implementar A/B testing",
                "Optimizar conversión del funnel",
                "Crear landing pages para campañas",
                "Desarrollar módulo de exportación de datos",
                "Implementar sistema de backup automático",
                "Configurar CDN para assets estáticos",
                "Crear herramienta de debugging interno",
                "Implementar rate limiting en API",
                "Desarrollar sistema de auditoría",
                "Optimizar queries N+1 en ORM",
                "Crear dashboard para administradores",
                "Implementar autenticación de dos factores",
                "Desarrollar API de webhooks"
            ]
        }
    ];

    const messages = [
        {
            role: 'user',
            content: "¿Puedes generar un texto de marcador de posición aleatorio, creativo y atractivo para mí? No necesita seguir ninguna estructura específica, simplemente algo divertido o interesante para rellenar el espacio temporalmente."
        },
        {
            role: 'bot',
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et varius tortor. Aenean dui magna, vehicula in lacinia non, euismod sed odio. Aliquam erat volutpat.\n\nInteger iaculis eu tellus vel tincidunt. Sed sed dictum orci, in pretium erat. Proin ut mi a arcu mollis hendrerit. Ut id est finibus, egestas tellus ac."
        },
        {
            role: 'user',
            content: "¿Podrías darme otro ejemplo un poco más técnico? Estoy trabajando en una sección de documentación."
        },
        {
            role: 'bot',
            content: "Claro. Aquí tienes un texto de relleno con un tono más técnico:\n\nEl protocolo de enlace dinámico permite que los módulos del kernel se carguen bajo demanda, optimizando el uso de memoria en tiempo de ejecución. Sin embargo, la latencia en la resolución de símbolos puede aumentar si no se gestionan correctamente las cachés de instrucciones (I-Cache) y datos (D-Cache). En arquitecturas distribuidas, la consistencia eventual suele ser preferible para mantener la disponibilidad del sistema frente a particiones de red."
        },
        {
            role: 'user',
            content: "¡Excelente! ¿Y uno con un tono más poético o abstracto?"
        },
        {
            role: 'bot',
            content: "Bajo el manto estelar, el código fluye como un río de plata. Las variables susurran secretos antiguos al compilador, mientras los bucles eternos danzan en la memoria del silicio. Cada línea es un verso, cada función una estrofa en la gran sinfonía del software, construyendo mundos invisibles que cobran vida con el parpadeo de un cursor. La lógica es el ritmo; la creatividad, la melodía."
        },
        {
            role: 'user',
            content: "Me encanta, gracias. ¿Puedes ayudarme con un ejemplo de arquitectura de microservicios?"
        },
        {
            role: 'bot',
            content: "Por supuesto. Una arquitectura de microservicios moderna típicamente incluye:\n\n1. **API Gateway**: Punto de entrada único para todas las solicitudes de clientes\n2. **Service Discovery**: Registro dinámico de servicios disponibles\n3. **Load Balancer**: Distribución de carga entre instancias\n4. **Message Broker**: Comunicación asíncrona entre servicios (RabbitMQ, Kafka)\n5. **Container Orchestration**: Gestión de contenedores (Kubernetes, Docker Swarm)\n\nCada microservicio debe ser:\n- Independientemente desplegable\n- Altamente cohesivo y débilmente acoplado\n- Responsable de su propia base de datos\n- Capaz de escalar horizontalmente"
        },
        {
            role: 'user',
            content: "Perfecto. ¿Y qué patrones de diseño recomiendas para el backend?"
        },
        {
            role: 'bot',
            content: "Para un backend robusto y mantenible, te recomiendo estos patrones:\n\n**Patrones Arquitectónicos:**\n- Repository Pattern: Abstracción de la capa de datos\n- Service Layer Pattern: Lógica de negocio separada\n- Factory Pattern: Creación de objetos complejos\n- Strategy Pattern: Algoritmos intercambiables\n- Observer Pattern: Notificaciones de eventos\n\n**Principios SOLID:**\n- Single Responsibility\n- Open/Closed\n- Liskov Substitution\n- Interface Segregation\n- Dependency Inversion\n\nEstos patrones te ayudarán a crear un código más limpio, testeable y escalable."
        },
        {
            role: 'user',
            content: "Excelente información. ¿Tienes algún consejo sobre optimización de bases de datos?"
        },
        {
            role: 'bot',
            content: "¡Claro! Aquí van algunos consejos clave para optimizar bases de datos:\n\n**Indexación:**\n- Crea índices en columnas frecuentemente consultadas\n- Usa índices compuestos para queries con múltiples condiciones\n- Evita índices en columnas con baja cardinalidad\n\n**Queries:**\n- Evita SELECT * y especifica solo las columnas necesarias\n- Usa EXPLAIN para analizar planes de ejecución\n- Implementa paginación para grandes resultados\n- Minimiza subconsultas anidadas\n\n**Caché:**\n- Implementa Redis o Memcached para datos frecuentes\n- Usa query caching cuando sea apropiado\n- Cachea resultados computacionalmente costosos\n\n**Normalización vs Desnormalización:**\n- Normaliza para evitar redundancia\n- Desnormaliza estratégicamente para mejorar lecturas"
        },
        {
            role: 'user',
            content: "¿Y sobre seguridad en aplicaciones web?"
        },
        {
            role: 'bot',
            content: "La seguridad es fundamental. Aquí están las mejores prácticas esenciales:\n\n**Autenticación y Autorización:**\n- Implementa JWT o OAuth 2.0\n- Usa bcrypt o Argon2 para hashear contraseñas\n- Implementa autenticación de dos factores (2FA)\n- Establece políticas de contraseñas fuertes\n\n**Protección de Datos:**\n- Usa HTTPS (TLS/SSL) para todas las comunicaciones\n- Encripta datos sensibles en reposo\n- Implementa CORS correctamente\n- Valida y sanitiza todas las entradas de usuario\n\n**Prevención de Ataques:**\n- Protege contra SQL Injection (usa prepared statements)\n- Previene XSS (Cross-Site Scripting)\n- Implementa CSRF tokens\n- Rate limiting para prevenir DDoS\n- Mantén dependencias actualizadas\n\n**Headers de Seguridad:**\n- Content-Security-Policy\n- X-Frame-Options\n- X-Content-Type-Options\n- Strict-Transport-Security"
        },
        {
            role: 'user',
            content: "Me encanta, gracias."
        },
        {
            role: 'bot',
            content: "¡De nada! Me alegra que te haya gustado. Si necesitas más textos, código o cualquier otra asistencia, solo pregunta. ¡Estoy aquí para ayudar!"
        }
    ];

    return (
        <Menu>
            {/* ESTILOS DE LA BARRA DE DESPLAZAMIENTO (SCROLLBAR) */}
            <style>{`
                /* Scrollbar personalizada - Más visible y profesional */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9; /* slate-100 */
                    border-radius: 10px;
                    margin: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1; /* slate-300 */
                    border-radius: 10px;
                    border: 2px solid #f1f5f9;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8; /* slate-400 */
                }

                /* Scrollbar para el textarea */
                .textarea-scrollbar::-webkit-scrollbar {
                    width: 6px; 
                }
                .textarea-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .textarea-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0; /* slate-200, más claro para el input */
                    border-radius: 10px;
                }
                .textarea-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1; /* slate-300 */
                }
            `}</style>

            <div className=" h-screen flex flex-col overflow-hidden">
                <div className=" flex flex-col h-full">
                    {/* Contenedor principal del Chat y Sidebar */}
                    {/* flex-1 con min-h-0 permite que este contenedor  ajuste y permita scroll interno */}
                    <div className="m-5 flex flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm min-h-0">

                        {/* Área principal del Chat (Mensajes e Input) - IZQUIERDA */}
                        <div className="flex-1 flex flex-col relative bg-white min-w-0 min-h-0">

                            {/* Contenedor de Mensajes - CON BARRA INDEPENDIENTE */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar min-h-0">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-2xl text-base leading-relaxed p-6 rounded-2xl
                                            ${msg.role === 'user'
                                                ? 'bg-[#E6F0FF] text-gray-800 rounded-tr-sm'
                                                : 'bg-gray-50 text-gray-800 rounded-tl-sm'}
                                        `}>
                                            {msg.content.split('\n\n').map((paragraph, i) => (
                                                <p key={i} className={i < msg.content.split('\n\n').length - 1 ? "mb-4" : ""}>
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Área de Input - SIN BARRA PRINCIPAL */}
                            <div className="p-8 pt-0 shrink-0">
                                <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 h-40 flex flex-col justify-between">
                                    <textarea
                                        className="w-full h-full resize-none outline-none text-gray-600 placeholder-gray-400 bg-transparent text-lg overflow-y-auto textarea-scrollbar"
                                        placeholder="Escribe tu mensaje aquí..."
                                    ></textarea>

                                    <div className="flex justify-between items-center mt-2">
                                        <button className="flex items-center text-gray-500 hover:text-gray-700 font-medium text-sm gap-2 transition-colors">
                                            <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                            </svg>
                                            Adjuntar
                                        </button>

                                        <button className="bg-[#1A1F2C] hover:bg-black text-white p-2 rounded-lg transition-colors shadow-md">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Historial) - DERECHA */}
                        <div className="w-80 border-l border-gray-100 bg-white flex flex-col p-6 h-full min-w-[20rem] shrink-0">

                            {/* Botón Nuevo Chat */}
                            <button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-6 transition-colors shadow-sm shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Nuevo Chat
                            </button>

                            {/* Barra de Búsqueda */}
                            <div className="relative mb-8 shrink-0">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Buscar..."
                                />
                            </div>

                            {/* Lista de Historial - CON BARRA INDEPENDIENTE */}
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                                {historySections.map((section, sIndex) => (
                                    <div key={sIndex} className="mb-6 last:mb-0">
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{section.title}</h3>
                                        <ul className="space-y-3">
                                            {section.items.map((item, iIndex) => (
                                                <li key={iIndex}>
                                                    <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 truncate transition-colors">
                                                        {item}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Menu>
    );
}