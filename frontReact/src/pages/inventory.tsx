
import { Menu } from "../components/menu";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import { Message } from "../components/Message";
import { DeleteModal } from "../components/DeleteModal";
// Mock data to match the image



export function Inventory() {
    const [products, setProducts] = useState<any[]>([]);
    
    // Función para obtener productos desde Supabase
    const getProducts = async () => {
        try {
            const { error, data } = await supabase
                .from('Productos')
                // Seleccionamos todos los campos de productos y el nombre de la categoria relacionada
                // Asumiendo que la relación se llama 'Categorias' (mayúscula inicial como la tabla)
                .select('*, Categorias(nombre)')
                .eq('estado', true) // Solo mostrar productos activos
                .order('nombre', { ascending: true });
                
            if (error) {
                console.error('Error al obtener los productos:', error);
                return;
            }
            if (data) {
                setProducts(data);
            }
        } catch (err) {
            console.error('Error inesperado:', err);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

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

    const toggleActionMenu = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (openActionMenuId === id) {
            setOpenActionMenuId(null);
        } else {
            setOpenActionMenuId(id);
        }
    };

    // --- Lógica de Componentes (Modal y Mensajes) ---
    // isDeleteModalOpen: controla si el modal de confirmación es visible
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // productToDelete: guarda temporalmente el ID del producto que el usuario quiere borrar
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    // toastConfig: configuración para el mensaje de éxito (si se muestra y qué dice)
    const [toastConfig, setToastConfig] = useState({ show: false, message: '' });

    // Se ejecuta cuando el usuario hace clic en el botón "Eliminar" de la tabla
    const handleDeleteClick = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); 
        setProductToDelete(id);      // Guardamos el ID para saber qué borrar después
        setIsDeleteModalOpen(true);  // Abrimos el modal de confirmación
        setOpenActionMenuId(null);   // Cerramos el menú de acciones (los 3 puntitos)
    };

    // Se ejecuta solo si el usuario confirma la eliminación dentro del modal
    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            // Soft delete en la base de datos (cambiamos estado a false en lugar de borrar la fila)
            const { error } = await supabase
                .from('Productos')
                .update({ estado: false })
                .eq('id', productToDelete);

            if (error) {
                console.error('Error al eliminar:', error);
            } else {
                // Actualizamos la lista local para que el producto desaparezca de la tabla
                setProducts(products.filter(p => p.id !== productToDelete));
                // Activamos el mensaje de éxito (Toast)
                setToastConfig({ show: true, message: 'Producto eliminado correctamente' });
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            // Cerramos el modal y limpiamos el ID pase lo que pase
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        }
    };

    // Se ejecuta si el usuario cancela la acción en el modal
    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // Simplemente cerramos el modal
        setProductToDelete(null);    // Limpiamos el ID temporal
    };

    return (
        <Menu>
            <div className="font-sans min-h-screen">
                <main className="flex-1 p-5">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
                            <p className="text-gray-500 mt-1">Monitorea el progreso de tu tienda para impulsar tus ventas.</p>
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
                            <Link to="/addproducts">
                                <button className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Añadir Producto
                                </button>
                            </Link>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-blue-600 border-b border-blue-600">
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">
                                            Productos
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">
                                            Categoría
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">
                                            Marca
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">
                                            Precio
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">Stock</th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">Fecha de Creación</th>
                                        <th className="p-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product, index) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center justify-center gap-4">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img 
                                                            className="h-10 w-10 rounded-lg object-cover border border-gray-200" 
                                                            src={product.imagen || "https://via.placeholder.com/150"} 
                                                            alt={product.nombre} 
                                                        />
                                                    </div>
                                                    <div className="font-medium text-gray-900">{product.nombre}</div>
                                                </div>
                                            </td>
                                            {/* Accedemos al nombre de la categoría a través de la relación */}
                                            <td className="p-5 text-gray-600 text-center">
                                                {product.Categorias?.nombre || "Sin Categoría"}
                                            </td>
                                            <td className="p-5 text-gray-600 text-center">{product.marca}</td>
                                            <td className="p-5 font-medium text-gray-900 text-center">
                                                ${product.precio_monto}
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    Number(product.stock) > Number(product.stock_minimo) 
                                                    ? "bg-green-100 text-green-700" 
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                    {Number(product.stock) > Number(product.stock_minimo) ? "En Stock" : "Agotado"} ({product.stock})
                                                </span>
                                            </td>
                                            <td className="p-5 text-gray-600 text-center">
                                                {new Date(product.fecha_creacion).toLocaleDateString()}
                                            </td>
                                            <td className={`p-5 text-right relative ${openActionMenuId === product.id ? "z-20" : "z-0"}`}>
                                                <button
                                                    onClick={(e) => toggleActionMenu(product.id, e)}
                                                    className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="2" />
                                                        <circle cx="19" cy="12" r="2" />
                                                        <circle cx="5" cy="12" r="2" />
                                                    </svg>
                                                </button>

                                                {/* Action Menu - Rendered only if this row is selected */}
                                                {openActionMenuId === product.id && (
                                                    <div
                                                        ref={menuRef}
                                                        className={`absolute right-8 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 animation-fade-in ${index >= products.length - 2 ? "bottom-8 origin-bottom-right" : "top-8 origin-top-right"
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
                                                            onClick={(e) => handleDeleteClick(product.id, e)}
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
                                Mostrando <span className="font-bold text-gray-900">15</span> a <span className="font-bold text-gray-900">20</span> de <span className="font-bold text-gray-900">20</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                    1
                                </button>
                                <button className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                    2
                                </button>
                                <button className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold text-white bg-blue-600 shadow-sm">
                                    3
                                </button>
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* Modal de confirmación: siempre está presente pero solo se "dibuja" si isOpen es true */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
            />

            {/* Mensaje de notificación (Toast): aparece arriba a la derecha al eliminar un producto */}
            <Message
                message={toastConfig.message}
                isVisible={toastConfig.show}
                onClose={() => setToastConfig({ ...toastConfig, show: false })}
            />
        </Menu>
    );
}