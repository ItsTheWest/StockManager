import { Menu } from '../components/menu';
import { useEffect, useState } from 'react';

export function Dashboard() {
    // Estado para la tasa del BCV
    // 'tasaBCV': almacena el valor numérico de la tasa. Inicia en 'null' mientras carga.
    const [tasaBCV, setTasaBCV] = useState<number | null>(null);

    // 'loading': estado para mostrar indicadores de "Cargando..."
    const [loading, setLoading] = useState<boolean>(true);

    // 'error': almacena mensajes de error si la petición falla
    const [error, setError] = useState<string | null>(null);
    const ventas = 12384.00;
    const ganancias = 4500.00;

    /*
      useEffect: Este hook se ejecuta automáticamente cuando el componente se carga.
      El array vacío [] al final indica que solo se ejecute UNA vez (al montar).
    */
    useEffect(() => {
        // Definimos la función asíncrona para buscar los datos
        const fetchTasa = async () => {
            try {
                // 1. PETICIÓN: Usamos 'fetch' para llamar a nuestra API local
                const response = await fetch('http://localhost:5000/api/bcv');

                // 2. VERIFICACIÓN: Comprobamos si el servidor respondió correctamente
                if (!response.ok) {
                    throw new Error('Error al conectar con la API');
                }

                // 3. CONVERSIÓN: Transformamos la respuesta en formato JSON a un objeto
                const data = await response.json();

                // 4. LÓGICA: Verificamos nuestra bandera de 'exito'
                if (data.exito) {
                    // Guardamos la tasa numérica en el estado
                    setTasaBCV(data.tasa_numerica);
                    setError(null);
                } else {
                    setError('No se pudo obtener la tasa');
                }
            } catch (err) {
                // 5. ERRORES: Capturamos cualquier falla de red o servidor
                console.error("Error fetching BCV rate:", err);
                setError('Error de conexión');
            } finally {
                // 6. FINALIZACIÓN: Quitamos el estado de carga
                setLoading(false);
            }
        };

        // Ejecutamos la función
        fetchTasa();
    }, []);

    // Definimos la función 'formatCurrency' que recibe el monto y el tipo de moneda ('USD' o 'VES')
    const formatCurrency = (amount: number, currency: 'USD' | 'VES') => {
        // Retornamos una nueva instancia del formateador de números internacional para Venezuela ('es-VE')
        return new Intl.NumberFormat('es-VE', {
            // Indicamos que el estilo del formato debe ser tipo moneda
            style: 'currency',
            // Asignamos la moneda que recibimos por parámetro (ej. 'USD')
            currency: currency,
            // Definimos que queremos ver siempre un mínimo de 2 decimales
            minimumFractionDigits: 2
        }).format(amount); // Finalmente aplicamos el formato al número (amount) y lo devolvemos como texto
    };

    return (
        <Menu>
            <div className="py-4 bg-gray-50 min-h-screen">
                <div className="w-full">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Ventas Card */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-emerald-50 rounded-xl flex-shrink-0">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex flex-col flex-grow">
                                {/* Llamamos a formatCurrency pasando el monto de ventas y "USD" para mostrarlo formateado */}
                                <span className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(ventas, 'USD')}</span>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-gray-500 text-sm font-medium">Ventas Totales</h3>
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        +20%
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 mt-1">
                                    {/* 
                                     Aquí realizamos la conversión:
                                     1. Multiplicamos ventas * tasaBCV
                                     2. Usamos formatCurrency con 'VES' para mostrar bolívares
                                    */}
                                    ≈ {loading ? 'Cargando...' : tasaBCV ? formatCurrency(ventas * tasaBCV, 'VES') : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Ganancias Card */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl flex-shrink-0">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <span className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(ganancias, 'USD')}</span>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-gray-500 text-sm font-medium">Ganancias Netas</h3>
                                    <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                        +12%
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 mt-1">
                                    ≈ {loading ? 'Cargando...' : tasaBCV ? formatCurrency(ganancias * tasaBCV, 'VES') : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* BCV Rate Card */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-amber-50 rounded-xl flex-shrink-0">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <span className="text-2xl font-bold text-gray-900 mb-1">
                                    {loading ? '...' : error ? 'Error' : tasaBCV ? formatCurrency(tasaBCV, 'VES') : 'N/A'}
                                </span>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-gray-500 text-sm font-medium">Tasa del BCV</h3>
                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                        Hoy
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 mt-1">
                                    Tasa oficial del día
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Menu>
    );
}