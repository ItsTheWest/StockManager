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
                "Escribir documentación de API"
            ]
        },
        {
            title: "AYER",
            items: [
                "Mejorar acceso login de página",
                "Crear estado de advertencia",
                "Optimizar consultas SQL complejas",
                "Revisar logs del servidor de producción"
            ]
        },
        {
            title: "DÍAS ANTERIORES",
            items: [
                "Planificación de sprint mensual",
                "Diseño de arquitectura de microservicios",
                "Configuración de pipeline CI/CD",
                "Investigación de nuevas librerías UI",
                "Reunión de feedback con stakeholders"
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
                /* Scrollbar personalizada */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px; /* Ajustado para ser más sutil como en diseños modernos */
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1; /* slate-300 */
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8; /* slate-400 */
                }

                /* Ajuste para que el textarea no muestre barra a menos que se necesite,
                   y si se necesita, use la personalizada */
                .textarea-scrollbar::-webkit-scrollbar {
                    width: 6px; 
                }
                .textarea-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0; /* slate-200, más claro para el input */
                    border-radius: 10px;
                }
            `}</style>

            <div className="font-sans min-h-screen bg-gray-50">
                <div className="p-5 pb-0 h-full flex flex-col">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chatbot AI</h1>
                            <p className="text-gray-500 mt-1">Asistente inteligente para ayudarte con tus consultas y tareas.</p>
                        </div>
                    </div>

                    {/* Contenedor principal del Chat y Sidebar */}
                    {/* h-[calc(100vh-180px)] asegura que el contenedor principal use el espacio disponible */}
                    <div className="flex flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden h-[calc(100vh-180px)] shadow-sm">

                        {/* Área principal del Chat (Mensajes e Input) - IZQUIERDA */}
                        <div className="flex-1 flex flex-col relative bg-white min-w-0">

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