import { Menu } from '../components/menu';

export function Dashboard() {
    // -----------------------------------------------------------------------
    // 1. DATOS DE LA GRÁFICA
    // Datos de ventas diarias para una tienda física (en unidades vendidas)
    // -----------------------------------------------------------------------
    const chartData = [
        { day: 'Lun', value: 150 },
        { day: 'Mar', value: 400 },
        { day: 'Mié', value: 180 },
        { day: 'Jue', value: 320 },
        { day: 'Vie', value: 220 },
        { day: 'Sáb', value: 260 },
        { day: 'Dom', value: 180 }
    ];

    // -----------------------------------------------------------------------
    // 2. CÁLCULO DEL VALOR MÁXIMO
    // Necesitamos saber cuál es el valor más alto para usarlo como el "100%" 
    // de altura en nuestra gráfica. Si el valor máximo es 400, una barra de 
    // 200 ocupará el 50% de la altura disponible.
    // -----------------------------------------------------------------------
    const maxValue = Math.max(...chartData.map(item => item.value));

    return (
        <Menu>
            <div className="py-4 bg-gray-50 min-h-screen">
                <div className="w-full">

                    {/* Grid de Tarjetas Superiores (Ventas, Ganancias, Tasa BCV) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Ventas Card */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-emerald-50 rounded-xl flex-shrink-0">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <span className="text-2xl font-bold text-gray-900 mb-1">252.320</span>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-gray-500 text-sm font-medium">Ventas Totales</h3>
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+20%</span>
                                </div>
                            </div>
                        </div>

                        {/* Ganancias Card */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl flex-shrink-0">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <span className="text-2xl font-bold text-gray-900 mb-1">$ 4,500.00</span>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-gray-500 text-sm font-medium">Ganancias Netas</h3>
                                    <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">+12%</span>
                                </div>
                            </div>
                        </div>

                        {/* BCV Rate Card */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-amber-50 rounded-xl flex-shrink-0">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <span className="text-2xl font-bold text-gray-900 mb-1">55.25 Bs</span>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-gray-500 text-sm font-medium">Tasa del BCV</h3>
                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Hoy</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Performance Component (Alineado a la derecha como pediste) */}
                    <div className="ml-auto max-w-[38%]">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            {/* Header: Título y Menú */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Rendimiento de Productos</h2>
                                <button className="text-gray-500 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Resumen de Productos (Tienda vs Almacén) */}
                            <div className="grid grid-cols-2 gap-4 mb-4 mt-4 border-b border-t border-gray-200 pt-6 pb-6">
                                <div className="text-center border-r border-gray-100">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Productos en Tienda</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-xl font-bold text-gray-800">790</span>
                                        <span className="text-xs font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">+5%</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Productos en Almacén</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-xl font-bold text-gray-800">572</span>
                                        <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">-2%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Promedio de Ventas Diarias */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-500">Promedio de Ventas Diarias</p>
                                    <span className="text-sm font-bold text-red-500 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                        0.52%
                                    </span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">$2,950</p>
                            </div>

                            {/* ----------------------------------------------------------------------- */}
                            {/* 3. GRÁFICO DE BARRAS */}
                            {/* Aquí comienza la lógica visual de la gráfica */}
                            {/* ----------------------------------------------------------------------- */}
                            <div className="relative h-52 w-full">

                                {/* Eje Y (Etiquetas de fondo 400, 300, etc) */}
                                <div className="absolute left-0 top-0 bottom-6 w-full flex flex-col justify-between text-xs text-gray-400 font-medium pointer-events-none">
                                    {/* Creamos líneas guía visuales más visibles */}
                                    <div className="border-b border-gray-200 w-full h-0 flex items-center"><span className="absolute -left-0">400</span></div>
                                    <div className="border-b border-gray-200 w-full h-0 flex items-center"><span className="absolute -left-0">300</span></div>
                                    <div className="border-b border-gray-200 w-full h-0 flex items-center"><span className="absolute -left-0">200</span></div>
                                    <div className="border-b border-gray-200 w-full h-0 flex items-center"><span className="absolute -left-0">100</span></div>
                                    <div className="border-b border-gray-200 w-full h-0 flex items-center"><span className="absolute -left-0">0</span></div>
                                </div>

                                {/* Contenedor de las barras */}
                                {/* pl-8 deja espacio para los números del eje Y */}
                                <div className="pl-8 h-full flex items-end justify-between gap-2">

                                    {chartData.map((item, index) => {
                                        // Calculamos la altura en porcentaje. 
                                        // Usamos 80% como máximo para dejar espacio arriba para el Tooltip.
                                        const heightPercentage = (item.value / maxValue) * 80;

                                        return (
                                            <div
                                                key={index}
                                                // 'group' permite controlar estilos de los hijos cuando hacemos hover en el padre
                                                className="group relative flex flex-col items-center justify-end flex-1 h-full cursor-pointer"
                                            >

                                                {/* ---------------------------------------------------------------- */}
                                                {/* TOOLTIP (El globo flotante con el dato) */}
                                                {/* Diseño: fondo azul con punto decorativo como en la imagen */}
                                                {/* ---------------------------------------------------------------- */}
                                                <div className="mb-2 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 absolute bottom-[percentage]"
                                                    style={{ bottom: `${heightPercentage + 5}%` }} // Posicionamos el tooltip justo encima de la barra
                                                >
                                                    <div className="relative bg-white text-gray-800 text-xs font-semibold py-1.5 px-3 rounded-md shadow-md border border-gray-300 whitespace-nowrap z-10 flex items-center gap-2">
                                                        {/* Punto decorativo azul */}
                                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                        <span>Ventas: {item.value}</span>
                                                    </div>
                                                </div>

                                                {/* ---------------------------------------------------------------- */}
                                                {/* BARRA */}
                                                {/* Ancho fijo (w-3) para que sea fina. Color azul índigo. */}
                                                {/* ---------------------------------------------------------------- */}
                                                <div
                                                    className="w-3 bg-blue-500 rounded-t-full transition-all duration-300 ease-in-out group-hover:bg-blue-800 group-hover:w-4" // Efecto: se ensancha un poco al pasar el mouse
                                                    style={{ height: `${heightPercentage}%` }}
                                                ></div>

                                                {/* ETIQUETA DEL DÍA (Eje X) */}
                                                <span className="text-[12px] font-medium text-gray-500 mt-1.5 group-hover:text-blue-700 transition-colors">
                                                    {item.day}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Fin de la gráfica */}

                        </div>
                    </div>

                </div>
            </div>
        </Menu>
    );
}