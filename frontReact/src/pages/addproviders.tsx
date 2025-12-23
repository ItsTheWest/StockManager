import { Menu } from "../components/menu";
import { useState } from "react";
import { supabase } from "../supabase-client";

export function AddProviders() {
    const [newProvider, setNewProvider] = useState({
        rif: "",
        nombre: "",
        telefono: "",
        ubicacion: "",
        correo: "",
        nombre_contacto: "",
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('Proveedores').insert(newProvider).single();
            // Inserta el nuevo producto y espera la respuesta
            if (error) {
                console.error('Error al agregar el proveedor:', error); //es posible que el async lanze una excepcion lo cual se captura en el catch para que no se rompa la apliacion
            } else {
                setNewProvider({ rif: "", nombre: "", telefono: "", ubicacion: "", correo: "", nombre_contacto: "" });
                e.target.reset();
                console.log('Proveedor agregado exitosamente:', newProvider.nombre); //uso nweproduct ya que es el estado que se esta utilizando para guardar los datos del nuevo producto
            }
        } catch (error) { // Captura y muestra cualquier error que pueda ocurrir posiblemente un error de internet o de base de datos
            console.error('Error en la peticion:', error) // sirve para asegurar que se muestra el error en la consola
        }

    };

    return (
        <Menu>
            <div className="min-h-screen bg-gray-50 p-5">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Añadir Proveedor</h1>
                    <p className="text-gray-500 mt-1">Completa la información del proveedor para registrarlo en el sistema.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form Container: Información de la Empresa */}
                    <div className="bg-white border rounded-xl shadow-sm border-gray-200">
                        {/* Section Title */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Información de la Empresa</h2>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="rif" className="block text-base font-medium text-gray-700 mb-2">
                                        RIF
                                    </label>
                                    <input
                                        value={newProvider.rif}
                                        onChange={(e) => setNewProvider({ ...newProvider, rif: e.target.value })}
                                        type="text"
                                        id="rif"
                                        name="rif"
                                        placeholder="Ingrese el RIF"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="nombre" className="block text-base font-medium text-gray-700 mb-2">
                                        Nombre de la Empresa
                                    </label>
                                    <input
                                        value={newProvider.nombre}
                                        onChange={(e) => setNewProvider({ ...newProvider, nombre: e.target.value })}
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        placeholder="Ingrese el nombre de la empresa"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div>
                                    <label htmlFor="ubicacion" className="block text-base font-medium text-gray-700 mb-2">
                                        Ubicación
                                    </label>
                                    <input
                                        value={newProvider.ubicacion}
                                        onChange={(e) => setNewProvider({ ...newProvider, ubicacion: e.target.value })}
                                        type="text"
                                        id="ubicacion"
                                        name="ubicacion"
                                        placeholder="Ingrese la ubicación de la empresa"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Container: Información de Contacto */}
                    <div className="bg-white border rounded-xl shadow-sm border-gray-200">
                        {/* Section Title */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Información de Contacto</h2>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="nombre_contacto" className="block text-base font-medium text-gray-700 mb-2">
                                        Nombre del Contacto
                                    </label>
                                    <input
                                        value={newProvider.nombre_contacto}
                                        onChange={(e) => setNewProvider({ ...newProvider, nombre_contacto: e.target.value })}
                                        type="text"
                                        id="nombre_contacto"
                                        name="nombre_contacto"
                                        placeholder="Ingrese el nombre de la persona de contacto"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="telefono" className="block text-base font-medium text-gray-700 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        value={newProvider.telefono}
                                        onChange={(e) => setNewProvider({ ...newProvider, telefono: e.target.value })}
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        placeholder="Ingrese el número de teléfono"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div>
                                    <label htmlFor="correo" className="block text-base font-medium text-gray-700 mb-2">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        value={newProvider.correo}
                                        onChange={(e) => setNewProvider({ ...newProvider, correo: e.target.value })}
                                        type="email"
                                        id="correo"
                                        name="correo"
                                        placeholder="Ingrese el correo electrónico"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button Container */}
                    <div className="flex items-center justify-end pt-4 pb-15">
                        <button
                            type="button"
                            className="px-6 py-2.5 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors"
                        >
                            Guardar Proveedor
                        </button>
                    </div>
                </form>
            </div>
        </Menu>
    );
}