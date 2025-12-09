
import { Menu } from "../components/menu";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// Mock data to match the image
const initialProducts = [
    {
        id: 1,
        name: "Canon EOS R5 Camera",
        category: "Cámara",
        brand: "Canon",
        price: "$3,899",
        stock: "En Stock",
        stockStatus: "in-stock",
        createdAt: "28 Sep, 2027",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    },
    {
        id: 2,
        name: "Sony WH-1000XM5 Headphones",
        category: "Audio",
        brand: "Sony",
        price: "$399",
        stock: "En Stock",
        stockStatus: "in-stock",
        createdAt: "28 Sep, 2027",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    },
    {
        id: 3,
        name: "Bose QuietComfort Earbuds",
        category: "Audio",
        brand: "Bose",
        price: "$279",
        stock: "En Stock",
        stockStatus: "in-stock",
        createdAt: "18 Nov, 2027",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    },
    {
        id: 4,
        name: "Airpods Pro 2nd Gen",
        category: "Accesorios",
        brand: "Apple",
        price: "$839",
        stock: "En Stock",
        stockStatus: "in-stock",
        createdAt: "29 Jun, 2027",
        image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07afe?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    },
    {
        id: 5,
        name: "Razer DeathAdder V3 Mouse",
        category: "Accesorios",
        brand: "Razer",
        price: "$89",
        stock: "En Stock",
        stockStatus: "in-stock",
        createdAt: "23 Oct, 2027",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    },
    {
        id: 6,
        name: "Logitech MX Master 3S",
        category: "Accesorios",
        brand: "Logitech",
        price: "$119",
        stock: "En Stock",
        stockStatus: "in-stock",
        createdAt: "14 Dec, 2027",
        image: "https://images.unsplash.com/photo-1615663245857-acda6b025e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    }
];

export function Inventory() {
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
                                    <tr className="bg-white border-b border-gray-100">
                                        <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                                Productos
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                                            </div>
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                                Categoría
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                                            </div>
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                                Marca
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                                            </div>
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                                Precio
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                                            </div>
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha de Creación</th>
                                        <th className="p-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {initialProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-lg object-cover border border-gray-200" src={product.image} alt="" />
                                                    </div>
                                                    <div className="font-medium text-gray-900">{product.name}</div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-gray-600">{product.category}</td>
                                            <td className="p-5 text-gray-600">{product.brand}</td>
                                            <td className="p-5 font-medium text-gray-900">{product.price}</td>
                                            <td className="p-5">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="p-5 text-gray-600">{product.createdAt}</td>
                                            <td className="p-5 text-right relative">
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
                                                        className="absolute right-8 top-8 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 animation-fade-in"
                                                        style={{ animation: "fadeIn 0.2s ease-out" }}
                                                    >
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                            onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                                                        >
                                                            Ver detalles
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                            onClick={(e) => { e.stopPropagation(); setOpenActionMenuId(null); }}
                                                        >
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
        </Menu>
    );
}