import { useEffect } from 'react';

// Propiedades necesarias para el mensaje de notificación (Toast)
interface MessageProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
    type?: 'success' | 'error';
}

export function Message({ message, isVisible, onClose, duration = 3000, type = 'success' }: MessageProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const isError = type === 'error';

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
            <div className="fixed top-18 right-5 z-50 animate-fade-in-down">
                <div className={`flex items-center gap-3 px-4 py-3 bg-white border ${isError ? 'border-red-500' : 'border-green-500'} rounded-lg shadow-md min-w-[300px]`}>
                    <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {isError ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{message}</span>
                </div>
            </div>
        </>
    );
}
