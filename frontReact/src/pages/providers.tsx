
import { Menu } from "../components/menu";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabase-client";
import { Message } from "../components/message";
import { DeleteModal } from "../components/deleteModal";

export function Providers() {
    // --- 1. ESTADO Y OBTENCIÓN DE DATOS ---
    const [providers, setProviders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Función para obtener proveedores desde Supabase
    const getProviders = async () => {
        setIsLoading(true);
        try {
            const { error, data } = await supabase
                .from('Proveedores')
                .select('*')
                .eq('estado', true) // Solo mostrar proveedores activos
                .order('nombre', { ascending: true });
                
            if (error) {
                console.error('Error al obtener los proveedores:', error);
                return;
            }
            if (data) {
                setProviders(data);
            }
        } catch (err) {
            console.error('Error inesperado:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProviders();
    }, []);

    // --- 2. LÓGICA DEL MENÚ DE ACCIONES (TRES PUNTOS) ---
    const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cerrar el menú al hacer clic fuera de él
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

    // --- 3. LÓGICA DE ELIMINACIÓN (MODAL Y TOAST) ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [providerToDelete, setProviderToDelete] = useState<number | null>(null);
    const [toastConfig, setToastConfig] = useState<{ show: boolean, message: string, type?: 'success' | 'error' }>({ show: false, message: '' });

    const location = useLocation();

    useEffect(() => {
        if (location.state?.successMessage) {
            setToastConfig({ show: true, message: location.state.successMessage, type: 'success' });
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleDeleteClick = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); 
        setProviderToDelete(id);
        setIsDeleteModalOpen(true);
        setOpenActionMenuId(null);
    };

    const confirmDelete = async () => {
        if (!providerToDelete) return;

        try {
            const { error } = await supabase
                .from('Proveedores')
                .update({ estado: false })
                .eq('id', providerToDelete);

            if (error) {
                console.error('Error al eliminar:', error);
            } else {
                setProviders(providers.filter(p => p.id !== providerToDelete));
                setToastConfig({ show: true, message: 'Proveedor eliminado correctamente' });
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setIsDeleteModalOpen(false);
            setProviderToDelete(null);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setProviderToDelete(null);
    };

    // --- 4. LÓGICA DE BÚSQUEDA ---
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProviders = providers.filter((provider) => {
        const query = searchTerm.toLowerCase();
        return (
            provider.nombre.toLowerCase().includes(query) ||
            provider.rif.toLowerCase().includes(query) ||
            (provider.ubicacion || "").toLowerCase().includes(query)
        );
    });

    // --- 5. LÓGICA DE PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const paginatedProviders = filteredProviders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Resetear a la página 1 cuando se realiza una nueva búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // --- 6. CONSTANTES DE DISEÑO (PARA MANTENER ESTRUCTURA) ---
    const ROW_HEIGHT = 81; 
    const MIN_ROWS = 5;
    const TABLE_MIN_HEIGHT = `${ROW_HEIGHT * MIN_ROWS}px`;

    return (
        <Menu>
            <div className="font-sans min-h-screen">
                <main className="flex-1 p-5">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
                            <p className="text-gray-500 mt-1">Gestiona la información de tus proveedores y contactos.</p>
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
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                    Filtrar
                                </button>
                            </div>
                            <Link to="/addproviders">
                                <button className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Añadir Proveedor
                                </button>
                            </Link>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-blue-600 border-b border-blue-600">
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">
                                            RIF
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">
                                            Nombre
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">
                                            Teléfono
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">
                                            Ubicación
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center">
                                            Contacto
                                        </th>
                                        <th className="p-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} style={{ height: TABLE_MIN_HEIGHT }}>
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                                    <p className="text-gray-500 font-medium">Cargando proveedores...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredProviders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ height: TABLE_MIN_HEIGHT }}>
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <p className="text-lg font-medium text-gray-600">No se encontraron resultados</p>
                                                    <p className="text-sm">No pudimos encontrar nada que coincida con "{searchTerm}"</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {paginatedProviders.map((provider, index) => (
                                                <tr key={provider.id} className="hover:bg-gray-50 transition-colors group h-[81px]">
                                                    <td className="p-5 text-gray-600 font-mono text-sm text-center">
                                                        {provider.rif}
                                                    </td>
                                                    <td className="p-5 text-gray-900 font-medium text-center">
                                                        <div className="line-clamp-2">{provider.nombre}</div>
                                                    </td>
                                                    <td className="p-5 text-gray-600 text-center">
                                                        {provider.telefono}
                                                    </td>
                                                    <td className="p-5 text-gray-600 text-center">
                                                        <div className="line-clamp-2">{provider.ubicacion}</div>
                                                    </td>
                                                    <td className="p-5 text-gray-600 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-medium text-gray-800 line-clamp-1">{provider.nombre_contacto}</span>
                                                            <span className="text-xs line-clamp-1" title={provider.correo}>{provider.correo}</span>
                                                        </div>
                                                    </td>
                                                    <td className={`p-5 text-right relative ${openActionMenuId === provider.id ? "z-20" : "z-0"}`}>
                                                        <button
                                                            onClick={(e) => toggleActionMenu(provider.id, e)}
                                                            className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                <circle cx="12" cy="12" r="2" />
                                                                <circle cx="19" cy="12" r="2" />
                                                                <circle cx="5" cy="12" r="2" />
                                                            </svg>
                                                        </button>

                                                        {openActionMenuId === provider.id && (
                                                            <div
                                                                ref={menuRef}
                                                                className={`absolute right-8 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 animation-fade-in ${index >= paginatedProviders.length - 2 ? "bottom-8 origin-bottom-right" : "top-8 origin-top-right"
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
                                                                <Link to={`/editproviders`} state={{ provider }}>
                                                                    <button
                                                                        className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2"
                                                                        onClick={() => setOpenActionMenuId(null)}
                                                                    >
                                                                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                        </svg>
                                                                        Editar
                                                                    </button>
                                                                </Link>
                                                                <button
                                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                                                    onClick={(e) => handleDeleteClick(provider.id, e)}
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
                                            {/* Filas vacías de relleno si hay menos de 5 resultados */}
                                            {Array.from({ length: Math.max(0, MIN_ROWS - paginatedProviders.length) }).map((_, i) => (
                                                <tr key={`empty-${i}`} style={{ height: `${ROW_HEIGHT}px` }}>
                                                    <td colSpan={6}>&nbsp;</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / Pagination */}
                        <div className="p-5 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-sm text-gray-600 font-medium">
                                Mostrando <span className="font-bold text-gray-900">{filteredProviders.length > 0 ? indexOfFirstItem + 1 : 0}</span> a <span className="font-bold text-gray-900">{Math.min(indexOfLastItem, filteredProviders.length)}</span> de <span className="font-bold text-gray-900">{filteredProviders.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        disabled={totalPages === 0}
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                                            currentPage === i + 1 
                                            ? "bg-blue-600 text-white shadow-sm" 
                                            : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200" 
                                        } ${totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button 
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Componentes de Feedback y Acción */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
            />

            <Message
                message={toastConfig.message}
                isVisible={toastConfig.show}
                type={toastConfig.type}
                onClose={() => setToastConfig({ ...toastConfig, show: false })}
            />
        </Menu>
    );
}