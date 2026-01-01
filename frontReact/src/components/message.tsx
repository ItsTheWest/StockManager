import { useEffect } from 'react';

// Propiedades necesarias para el mensaje de notificación (Toast)
interface MessageProps {
    message: string;      // El texto que se mostrará en pantalla
    isVisible: boolean;    // Controla si el mensaje aparece o desaparece
    onClose: () => void;   // Función para cerrar el mensaje (cambiar el estado a false)
    duration?: number;     // Tiempo opcional antes de que se cierre solo (default 3s)
}

export function Message({ message, isVisible, onClose, duration = 3000 }: MessageProps) {
    // Efecto para manejar el cierre automático por tiempo
    useEffect(() => {
        // Solo iniciamos el temporizador si el mensaje es visible
        if (isVisible) {
            // Creamos un cronómetro que ejecutará 'onClose' después de la duración definida
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            
            // Limpieza: si el componente desaparece antes del tiempo, borramos el cronómetro
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]); // Dependencias: se reinicia si alguna de estas cambia

    // Si no debe ser visible, no dibujamos el componente en el DOM
    if (!isVisible) return null;

    return (
        <>
            <style>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translate3d(0, -20px, 0);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0);
                    }
                }
                .animate-fade-in-down {
                    animation: fadeInDown 0.5s ease-out forwards;
                }
            `}</style>
            <div className="fixed top-5 right-5 z-50 animate-fade-in-down">
                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-green-500 rounded-lg shadow-md min-w-[300px]">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{message}</span>
                </div>
            </div>
        </>
    );
}
