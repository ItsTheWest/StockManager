import { useEffect } from 'react';

// Definimos las propiedades que el componente necesita para funcionar
interface DeleteModalProps {
    isOpen: boolean;    // Booleano: indica si el modal está visible
    onClose: () => void;  // Función: se ejecuta al cancelar
    onConfirm: () => void; // Función: se ejecuta al confirmar la eliminación
}

export function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
    // Efecto para bloquear el scroll del fondo cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            // Si el modal se abre, quitamos el scroll al cuerpo de la página
            document.body.style.overflow = 'hidden';
        } else {
            // Si el modal se cierra, restauramos el scroll normal
            document.body.style.overflow = 'unset';
        }
        // Función de limpieza: se asegura de restaurar el scroll si el componente se desmonta
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]); // Solo se ejecuta cuando cambia el estado de 'isOpen'

    // Si el modal no debe estar abierto, no renderizamos absolutamente nada
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}
        >
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 transform transition-all scale-100">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">¿Eliminar producto?</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
