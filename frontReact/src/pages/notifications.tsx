import { useState } from 'react';
import { Menu } from "../components/menu";

// Mock Data for Notifications - Restricted Categories: Venta, Inventario, Precios, Sistema
const NOTIFICATIONS = [
    {
        id: "101",
        type: 'alert',
        category: 'Inventario',
        message: 'Stock crítico: "Cemento Portland" tiene menos de 10 unidades.',
        date: 'Hace 10 min',
        typeColor: 'bg-red-100 text-red-700',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    },
    {
        id: "102",
        type: 'success',
        category: 'Venta',
        message: 'Meta diaria alcanzada: Se han superado las 50 ventas hoy.',
        date: 'Hace 45 min',
        typeColor: 'bg-green-100 text-green-700',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        )
    },
    {
        id: "103",
        type: 'info',
        category: 'Sistema',
        message: 'Copia de seguridad automática completada exitosamente.',
        date: 'Ayer, 02:00 AM',
        typeColor: 'bg-blue-100 text-blue-700',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        id: "104",
        type: 'warning',
        category: 'Precios',
        message: 'Cambio de precio detectado en "Lote B" por usuario Admin.',
        date: 'Ayer, 04:30 PM',
        typeColor: 'bg-yellow-100 text-yellow-800',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        id: "105",
        type: 'alert',
        category: 'Sistema',
        message: 'Intento de acceso fallido detectado desde IP desconocida.',
        date: 'Hace 2 días',
        typeColor: 'bg-red-100 text-red-700',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        )
    },
     {
        id: "106",
        type: 'info',
        category: 'Inventario',
        message: 'Nuevo producto "Tubería PVC 2pulg" añadido al catálogo.',
        date: 'Hace 3 días',
        typeColor: 'bg-blue-100 text-blue-700',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        )
    },
];

export function Notifications() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNotifications = NOTIFICATIONS.filter(note => 
        note.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
        note.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Menu>
            <div className="font-sans min-h-screen">
                <main className="flex-1 p-5">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Bandeja de Notificaciones</h1>
                            <p className="text-gray-500 mt-1">Historial de alertas y eventos del sistema.</p>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex justify-between items-center mb-4">
                            <div className="relative w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Buscar en notificaciones..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                    </div>

                    {/* Card Container */}
                    <div className="bg-white border rounded-xl shadow-sm border-gray-200 overflow-hidden">

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-blue-600 border-b border-blue-600">
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-center w-24">
                                            Tipo
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-left">
                                            Mensaje
                                        </th>
                                        <th className="p-5 text-xs font-semibold text-white uppercase tracking-wider text-right w-48">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredNotifications.length > 0 ? (
                                        filteredNotifications.map((note) => (
                                            <tr 
                                                key={note.id} 
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="p-5 text-center">
                                                    <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center ${note.typeColor}`}>
                                                        {note.icon}
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-gray-400 uppercase mb-0.5 tracking-wide">{note.category}</span>
                                                        <span className="text-gray-900 font-medium text-base">{note.message}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{note.date}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="p-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <p className="text-lg font-medium text-gray-600">No se encontraron resultados</p>
                                                    <p className="text-sm">Intenta con otro término de búsqueda.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Footer */}
                         <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                            <div>Total: <span className="font-bold text-gray-900">{filteredNotifications.length}</span> notificaciones</div>
                         </div>
                    </div>
                </main>
            </div>
        </Menu>
    );
}
