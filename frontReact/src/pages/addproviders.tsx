
import { Menu } from "../components/menu";
import { useState } from "react";
import { supabase } from "../supabase-client";
import { Message } from "../components/message";
import { Link, useNavigate } from "react-router-dom";

export function AddProviders() {
    // --- 1. CONSTANTES Y ESTADOS ---
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [toastConfig, setToastConfig] = useState({ show: false, message: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Estado para el RIF dividido (Letra + Número)
    const [rifLetter, setRifLetter] = useState("J");
    const [rifNumber, setRifNumber] = useState("");

    const [newProvider, setNewProvider] = useState({
        nombre: "",
        telefono: "",
        ubicacion: "",
        correo: "",
        nombre_contacto: "",
    });

    // --- 2. REGLAS DE VALIDACIÓN CENTRALIZADAS ---
    const validationRules: { [key: string]: (value: string) => string } = {
        nombre: (value) => {
            if (!value.trim()) return "El nombre es obligatorio";
            return "";
        },
        rif_number: (value) => {
            if (!value.trim()) return "El RIF es obligatorio";
            if (!/^\d+$/.test(value)) return "Solo números";
            return "";
        },
        telefono: (value) => {
            if (!value.trim()) return "El teléfono es obligatorio";
            return "";
        },
        correo: (value) => {
            if (!value.trim()) return "El correo es obligatorio";
            if (!/\S+@\S+\.\S+/.test(value)) return "Email inválido";
            return "";
        },
        ubicacion: (value) => {
            if (!value.trim()) return "La ubicación es obligatoria";
            return "";
        },
        nombre_contacto: (value) => {
            if (!value.trim()) return "El contacto es obligatorio";
            return "";
        }
    };

    // --- 3. FUNCIONES DE MANEJO DE FORMULARIO ---
    const validateField = (fieldName: string, value: string): string => {
        if (validationRules[fieldName]) return validationRules[fieldName](value);
        return "";
    };

    const handleInputChange = (fieldName: string, value: string) => {
        setNewProvider({ ...newProvider, [fieldName]: value });
        if (errors[fieldName]) setErrors({ ...errors, [fieldName]: "" });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const newErrors: { [key: string]: string } = {};
        
        // Validar RIF
        const rErr = validateField('rif_number', rifNumber);
        if (rErr) newErrors['rif'] = rErr;

        // Validar otros
        Object.keys(newProvider).forEach(key => {
            const err = validateField(key, (newProvider as any)[key]);
            if (err) newErrors[key] = err;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const fullRif = `${rifLetter}-${rifNumber}`;
            const { error } = await supabase.from('Proveedores').insert({
                ...newProvider,
                rif: fullRif,
                estado: true
            });

            if (error) throw error;

            setToastConfig({ show: true, message: 'Proveedor registrado con éxito' });
            setTimeout(() => navigate('/providers'), 1500);
        } catch (error) {
            console.error('Error:', error);
            alert("Error al guardar el proveedor");
        } finally {
            setIsLoading(false);
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
                                    <div className="flex">
                                        <select
                                            value={rifLetter}
                                            onChange={(e) => setRifLetter(e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-l-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all border-r-0"
                                        >
                                            <option value="J">J</option>
                                            <option value="V">V</option>
                                            <option value="G">G</option>
                                        </select>
                                        <input
                                            value={rifNumber}
                                            onChange={(e) => {
                                                setRifNumber(e.target.value);
                                                if (errors.rif) setErrors({...errors, rif: ""});
                                            }}
                                            type="text"
                                            id="rif"
                                            placeholder={errors.rif || "Ingrese los números del RIF"}
                                            className={`w-full px-4 py-2.5 border rounded-r-lg focus:ring-2 outline-none transition-all ${
                                                errors.rif ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        />
                                    </div>
                                    {errors.rif && <p className="text-red-500 text-xs mt-1">{errors.rif}</p>}
                                </div>

                                <div>
                                    <label htmlFor="nombre" className="block text-base font-medium text-gray-700 mb-2">
                                        Nombre de la Empresa
                                    </label>
                                    <input
                                        value={newProvider.nombre}
                                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                                        type="text"
                                        id="nombre"
                                        placeholder={errors.nombre || "Ingrese el nombre de la empresa"}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                                            errors.nombre ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div>
                                    <label htmlFor="ubicacion" className="block text-base font-medium text-gray-700 mb-2">
                                        Ubicación
                                    </label>
                                    <input
                                        value={newProvider.ubicacion}
                                        onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                                        type="text"
                                        id="ubicacion"
                                        placeholder={errors.ubicacion || "Ingrese la ubicación de la empresa"}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                                            errors.ubicacion ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.ubicacion && <p className="text-red-500 text-xs mt-1">{errors.ubicacion}</p>}
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
                                        onChange={(e) => handleInputChange('nombre_contacto', e.target.value)}
                                        type="text"
                                        id="nombre_contacto"
                                        placeholder={errors.nombre_contacto || "Ingrese el nombre de la persona de contacto"}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                                            errors.nombre_contacto ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.nombre_contacto && <p className="text-red-500 text-xs mt-1">{errors.nombre_contacto}</p>}
                                </div>

                                <div>
                                    <label htmlFor="telefono" className="block text-base font-medium text-gray-700 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        value={newProvider.telefono}
                                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                                        type="tel"
                                        id="telefono"
                                        placeholder={errors.telefono || "Ingrese el número de teléfono"}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                                            errors.telefono ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div>
                                    <label htmlFor="correo" className="block text-base font-medium text-gray-700 mb-2">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        value={newProvider.correo}
                                        onChange={(e) => handleInputChange('correo', e.target.value)}
                                        type="email"
                                        id="correo"
                                        placeholder={errors.correo || "Ingrese el correo electrónico"}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                                            errors.correo ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button Container */}
                    <div className="flex items-center justify-end pt-4 pb-15">
                        <Link to="/providers">
                            <button
                                type="button"
                                className="px-6 py-2.5 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors ${isLoading ? 'opacity-50' : ''}`}
                        >
                            {isLoading ? 'Guardando...' : 'Guardar Proveedor'}
                        </button>
                    </div>
                </form>
            </div>
            
            <Message
                message={toastConfig.message}
                isVisible={toastConfig.show}
                onClose={() => setToastConfig({...toastConfig, show: false})}
            />
        </Menu>
    );
}