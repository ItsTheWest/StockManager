
import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabase-client";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category?: { id: number; nombre: string; descripcion: string } | null;
}

export function CategoryModal({ isOpen, onClose, onSuccess, category }: CategoryModalProps) {
    const [newCategory, setNewCategory] = useState({
        nombre: "",
        descripcion: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ nombre?: string }>({});
    const modalRef = useRef<HTMLDivElement>(null);

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Si hay una categoría para editar, cargar sus datos
            if (category) {
                setNewCategory({
                    nombre: category.nombre || "",
                    descripcion: category.descripcion || "",
                });
            } else {
                setNewCategory({ nombre: "", descripcion: "" });
            }
        } else {
            document.body.style.overflow = 'unset';
            // Resetear el estado al cerrar
            setNewCategory({ nombre: "", descripcion: "" });
            setErrors({});
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, category]);

    // Cerrar el modal al hacer clic fuera de él
    useEffect(() => {
        function handleModalClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleModalClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleModalClickOutside);
        };
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            if (category?.id) {
                // Modo Edición
                const { error } = await supabase
                    .from('Categorias')
                    .update({ ...newCategory })
                    .eq('id', category.id);

                if (error) throw error;
            } else {
                // Modo Creación
                const { error } = await supabase
                    .from('Categorias')
                    .insert({ ...newCategory, estado: true });
                
                if (error) throw error;
            }

            setNewCategory({ nombre: "", descripcion: "" });
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error en la operación:', error);
            if (error.code === '23505') {
                setErrors({ nombre: "Esta categoría ya existe" });
            } else {
                alert("Ocurrió un error al procesar la categoría");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity py-10"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {category ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5">
                        {/* Input Nombre */}
                        <div>
                            <label htmlFor="modal_nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={newCategory.nombre}
                                onChange={(e) => {
                                    setNewCategory({ ...newCategory, nombre: e.target.value });
                                    if (errors.nombre) setErrors({ ...errors, nombre: undefined });
                                }}
                                type="text"
                                id="modal_nombre"
                                name="nombre"
                                required
                                className={`block w-full px-4 py-2.5 border rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                    errors.nombre 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                                placeholder="Ej: Electrónica"
                            />
                            {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
                        </div>

                        {/* Input Descripción */}
                        <div>
                            <label htmlFor="modal_descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={newCategory.descripcion}
                                onChange={(e) => setNewCategory({ ...newCategory, descripcion: e.target.value })}
                                id="modal_descripcion"
                                name="descripcion"
                                required
                                rows={4}
                                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                placeholder="Describe la categoría..."
                            />
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Guardando...' : category ? 'Actualizar Categoría' : 'Guardar Categoría'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
