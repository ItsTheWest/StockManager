
import { Menu } from "../components/menu";
import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabase-client";
// Mock data for categories
const initialCategories = [
    {
        id: 1,
        name: "Electrónica",
        description: "Dispositivos electrónicos, gadgets y accesorios de última tecnología."
    },
    {
        id: 2,
        name: "Ropa y Moda",
        description: "Vestimenta, calzado y accesorios para hombres, mujeres y niños."
    },
    {
        id: 3,
        name: "Hogar y Jardín",
        description: "Artículos para la decoración, cocina y mantenimiento del hogar."
    },
    {
        id: 4,
        name: "Deportes",
        description: "Equipamiento, ropa y accesorios para diversas actividades deportivas."
    },
    {
        id: 5,
        name: "Juguetes",
        description: "Juguetes educativos, de mesa y electrónicos para todas las edades."
    },
    {
        id: 6,
        name: "Libros y Papelería",
        description: "Libros de diversos géneros, material escolar y de oficina."
    }
];

export function Categorias() {
    const [newCategory, setNewCategory] = useState({
        nombre: "",
        descripcion: "",
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('Categorias').insert(newCategory).single();
            // Inserta el nuevo producto y espera la respuesta
            if (error) {
                console.error('Error al agregar el producto:', error); //es posible que el async lanze una excepcion lo cual se captura en el catch para que no se rompa la apliacion
            } else {
                setNewCategory({ nombre: "", descripcion: "" });
                e.target.reset();
                console.log('Producto agregado exitosamente:', newCategory.nombre); //uso nweproduct ya que es el estado que se esta utilizando para guardar los datos del nuevo producto
            }
        } catch (error) { // Captura y muestra cualquier error que pueda ocurrir posiblemente un error de internet o de base de datos
            console.error('Error al agregar el producto:', error) // sirve para asegurar que se muestra el error en la consola
        }
    };



    const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenActionMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close modal when clicking outside
    useEffect(() => {
        function handleModalClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        }
        if (isModalOpen) {
            document.addEventListener("mousedown", handleModalClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleModalClickOutside);
        };
    }, [isModalOpen]);

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const toggleActionMenu = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (openActionMenuId === id) {
            setOpenActionMenuId(null);
        } else {
            setOpenActionMenuId(id);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Menu>
            <div className="font-sans min-h-screen">
                <main className="flex-1 p-5">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
                            <p className="text-gray-500 mt-1">Gestiona las categorías de tus productos para organizar tu inventario.</p>
                        </div>
                    </div>

                    {/* Card Container */}
                    <div className="bg-white border rounded-xl shadow-sm border-gray-200">
                        {/* Filter Bar */}
                        <div className="p-5 flex justify-between items-center border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="relative w-80">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Buscar..."
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                    Filtrar
                                </button>
                            </div>
                            <button
                                onClick={openModal}
                                className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Añadir Categoría
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-blue-600 border-b border-blue-600">
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center w-1/4">
                                            <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200">
                                                Nombre
                                            </div>
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">
                                            <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200">
                                                Descripción
                                            </div>
                                        </th>
                                        <th className="p-5 w-20"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {initialCategories.map((category, index) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="p-5 font-medium text-gray-900">
                                                {category.name}
                                            </td>
                                            <td className="p-5 text-gray-600">
                                                {category.description}
                                            </td>
                                            <td className={`p-5 text-right relative ${openActionMenuId === category.id ? "z-20" : "z-0"}`}>
                                                <button
                                                    onClick={(e) => toggleActionMenu(category.id, e)}
                                                    className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="2" />
                                                        <circle cx="19" cy="12" r="2" />
                                                        <circle cx="5" cy="12" r="2" />
                                                    </svg>
                                                </button>

                                                {/* Action Menu - Rendered only if this row is selected */}
                                                {openActionMenuId === category.id && (
                                                    <div
                                                        ref={menuRef}
                                                        className={`absolute right-8 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 animation-fade-in ${index >= initialCategories.length - 2 ? "bottom-8 origin-bottom-right" : "top-8 origin-top-right"
                                                            }`}
                                                        style={{ animation: "fadeIn 0.2s ease-out" }}
                                                    >
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
                                                            onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                                                        >
                                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Ver detalles
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2"
                                                            onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                                                        >
                                                            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                                            onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                                                        >
                                                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / Pagination */}
                        <div className="p-5 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-sm text-gray-600 font-medium">
                                Mostrando <span className="font-bold text-gray-900">1</span> a <span className="font-bold text-gray-900">6</span> de <span className="font-bold text-gray-900">6</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50" disabled>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold text-white bg-blue-600 shadow-sm">
                                    1
                                </button>
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600" disabled>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Modal para Agregar Categoría */}
                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center transition-opacity"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}
                    >
                        <div
                            ref={modalRef}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">Agregar Nueva Categoría</h2>
                                <button
                                    onClick={closeModal}
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
                                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            onChange={(e) => setNewCategory({ ...newCategory, nombre: e.target.value })}
                                            type="text"
                                            id="nombre"
                                            name="nombre"
                                            required
                                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Ej: Electrónica"
                                        />
                                    </div>

                                    {/* Input Descripción */}
                                    <div>
                                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                                            Descripción <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            onChange={(e) => setNewCategory({ ...newCategory, descripcion: e.target.value })}
                                            id="descripcion"
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
                                        type="submit"
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                                    >
                                        Guardar Categoría
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Menu>
    );
}