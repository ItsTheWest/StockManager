import { Menu } from '../components/menu';
import { supabase } from '../supabase-client';
import { useState, useEffect } from 'react';
// Datos estáticos para probar el scroll


export function Billing() {
    // Datos estáticos para las tarjetas de productos (basado en el requerimiento)
    // --- 1. ESTADO Y OBTENCIÓN DE DATOS ---
    const [products, setProducts] = useState<any[]>([]);

    // Función para obtener productos desde Supabase
    const getProducts = async () => {
        try {
            const { error, data } = await supabase
                .from('Productos')
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

    const productsMock = [
        {
            id: 1,
            name: "Cámara Slim Fit",
            sku: "VG-STCBU2K/ZA",
            price: 99.99,
            originalPrice: null,
            qty: 1,
            image: "https://images.samsung.com/is/image/samsung/p6pim/mx/vg-stcbu2k-za/gallery/mx-slim-fit-cam-vg-stcbu2k-za-532897669?$684_547_PNG$"
        },
        {
            id: 2,
            name: "JBL Authentics 300",
            sku: "JBLAUTH300BLKAM",
            price: 299.95,
            originalPrice: 449.95,
            qty: 1,
            image: "https://www.jbl.com.mx/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw15545819/JBL_Authentics_300_Black_Right_Angle_Global-1605x1605px.png?sw=537&sfrm=png"
        },
        {
            id: 3,
            name: "Galaxy Buds2 Pro",
            sku: "SM-R510NZAAXAR",
            price: 189.99,
            originalPrice: 229.99,
            qty: 1,
            image: "https://image-us.samsung.com/SamsungUS/home/mobile/audio/headphones/galaxy-buds2-pro/gallery/graphite/Galaxy_Buds2_Pro_Graphite_Case_Front_Open_RGB.jpg?$product-details-jpg$"
        },
        {
            id: 4,
            name: "Cargador Inalámbrico Duo",
            sku: "EP-P5400TBEGUS",
            price: 89.99,
            originalPrice: null,
            qty: 2,
            image: "https://image-us.samsung.com/SamsungUS/home/mobile/accessories/charging/wireless-charger-duo/EP-P5400TBEGUS-1.jpg?$product-details-jpg$"
        },
        {
            id: 5,
            name: "Samsung Galaxy Watch6",
            sku: "SM-R930NZKAXAR",
            price: 299.99,
            originalPrice: 349.99,
            qty: 1,
            image: "https://image-us.samsung.com/SamsungUS/home/mobile/wearables/smartwatches/galaxy-watch6/gallery/graphite/Galaxy_Watch6_40mm_Graphite_Front_RGB.jpg?$product-details-jpg$"
        },
        {
            id: 6,
            name: "SmartTag2",
            sku: "EI-T5600BBEGUS",
            price: 29.99,
            originalPrice: null,
            qty: 4,
            image: "https://image-us.samsung.com/SamsungUS/home/mobile/accessories/smarttag2/EI-T5600BBEGUS-1.jpg?$product-details-jpg$"
        },
        {
            id: 7,
            name: "Portable SSD T7 Shield",
            sku: "MU-PE2T0S/AM",
            price: 159.99,
            originalPrice: 199.99,
            qty: 1,
            image: "https://image-us.samsung.com/SamsungUS/home/computing/memory-and-storage/portable-ssd/t7-shield/gallery/black/T7_Shield_Black_1.jpg?$product-details-jpg$"
        },
    ];
    return (
        <Menu>
            <div className="min-h-screen bg-gray-50/50">
                <main className="flex-1 p-5">
                    {/* Header Section (Igual a Proveedores) */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
                            <p className="text-gray-500 mt-1">Gestiona tus órdenes, pagos y facturas pendientes.</p>
                        </div>
                    </div>

                    {/* Contenedor de Facturación (Existente modificado) */}
                    <div className="bg-white max-h-[90vh] shadow-sm rounded-lg border border-gray-200 font-sans pb-12 mb-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                                {/* Left Column: Product List */}
                                <div className="lg:col-span-2 space-y-6">

                                    {/* Scrollable Container */}
                                    <div className="space-y-6 h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                        {productsMock.map((product) => (
                                            <div key={product.id} className="flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-100 last:border-0">
                                                {/* Product Image */}
                                                <div className="w-full sm:w-40 h-40 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-4">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 w-full">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h3>
                                                            <p className="text-sm text-gray-500 mt-1 uppercase">SKU#{product.sku}</p>
                                                        </div>
                                                        <div className="text-right flex flex-col items-end">
                                                            <span className="text-xl font-bold text-gray-900">${product.price}</span>
                                                            {product.originalPrice && (
                                                                <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Action Row */}
                                                    <div className="flex items-center justify-between mt-6">
                                                        <div className="flex items-center">
                                                            <div className="relative">
                                                                <select
                                                                    className="appearance-none bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2 pr-6 cursor-pointer"
                                                                    defaultValue={product.qty}
                                                                >
                                                                    <option>1</option>
                                                                    <option>2</option>
                                                                    <option>3</option>
                                                                    <option>4</option>
                                                                </select>
                                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>

                                {/* Right Column: Summary */}
                                <div className="lg:col-span-1 flex  items-center">
                                    <div className="sticky top-24 w-full">
                                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Resumen del pedido</h2>

                                        <div className="bg-white rounded-lg">
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">Código promocional</label>
                                            <div className="flex gap-2 mb-8">
                                                <input
                                                    type="text"
                                                    placeholder="Ingresa código"
                                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-sm"
                                                />
                                                <button className="px-6 py-2.5 border border-gray-300 rounded-full font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm">
                                                    Aplicar
                                                </button>
                                            </div>

                                            <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
                                                <div className="flex justify-between items-center text-base">
                                                    <span className="text-gray-700">Subtotal ({products.length} artículos)</span>
                                                    <span className="font-bold text-gray-900">$399.94</span>
                                                </div>
                                                <div className="flex justify-between items-center text-base">
                                                    <span className="text-gray-700">Envío</span>
                                                    <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide">GRATIS</span>
                                                </div>
                                                <div className="flex justify-between items-center text-base">
                                                    <span className="text-gray-700 flex items-center gap-1 cursor-help" title="Los impuestos se calcularán en el siguiente paso">
                                                        Impuestos estimados
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    </span>
                                                    <span className="font-medium text-gray-900 text-sm">Calculado luego</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xl font-bold text-gray-900">Total estimado</span>
                                            </div>

                                            <div className="space-y-3 mt-8">
                                                <button className="w-full cursor-pointer bg-[#0074e0] hover:bg-[#0060ba] text-white font-bold py-3.5 rounded-full transition-shadow shadow-sm hover:shadow-md text-base">
                                                    Pagar
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Tarjetas de Productos (Debajo del contenedor de facturación) */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Productos Recomendados</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
                            {products.map((item) => (
                                <div key={item.id} className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-shadow duration-300 relative flex flex-col h-[320px]">
                                    {/* Imagen: Altura fija para evitar que crezca con la imagen */}
                                    <div className="h-40 w-full bg-white relative flex-shrink-0">
                                        <img
                                            src={item.imagen}
                                            alt={item.nombre}
                                            className="w-full h-full object-contain p-4 mix-blend-multiply"
                                        />
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-4 flex-1 flex flex-col bg-white">
                                        <div className="mb-2">
                                            <span className="text-[10px] font-bold tracking-wider text-blue-500 uppercase">
                                                {item.Categorias?.nombre || "Sin Categoría"}
                                            </span>
                                        </div>
                                        {/* Título truncado a 2 líneas */}
                                        <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug line-clamp-2" title={item.nombre}>
                                            {item.nombre}
                                        </h3>

                                        <div className="mt-auto pt-2 flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">$ {item.precio_monto.toFixed(2)}</span>
                                            <button className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-lg shadow-blue-200">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </Menu>
    );
}