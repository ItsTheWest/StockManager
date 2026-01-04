import { Menu } from "../components/menu";
import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { Message } from "../components/message";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function EditProviders() {
    // ============================================================================
    // 1. ESTADOS E INICIALIZACIÓN (STATES & INIT)
    // ============================================================================
    const navigate = useNavigate();
    const location = useLocation();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ 
        show: false, 
        message: '', 
        type: 'success' 
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Estado para el RIF dividido (Letra + Número)
    const [rifLetter, setRifLetter] = useState("J");
    const [rifNumber, setRifNumber] = useState("");
    const [areaCode, setAreaCode] = useState("0414");
    const [phoneNum, setPhoneNum] = useState("");

    const [newProvider, setNewProvider] = useState({
        nombre: "",
        ubicacion: "",
        correo: "",
        nombre_contacto: "",
    });

    // ============================================================================
    // 2. CARGA DE DATOS (DATA FETCHING & PRE-FILLING)
    // ============================================================================
    useEffect(() => {
        if (location.state?.provider) {
            const p = location.state.provider;
            setEditingId(p.id);
            
            // Procesar RIF (Ejemplo: J-12345678)
            if (p.rif && p.rif.includes('-')) {
                const [letter, number] = p.rif.split('-');
                setRifLetter(letter);
                setRifNumber(number);
            } else {
                setRifNumber(p.rif || "");
            }

            // Procesar Teléfono (Ejemplo: 0414-1234567)
            if (p.telefono && p.telefono.includes('-')) {
                const [code, num] = p.telefono.split('-');
                setAreaCode(code);
                setPhoneNum(num);
            } else {
                setPhoneNum(p.telefono || "");
            }

            setNewProvider({
                nombre: p.nombre || "",
                ubicacion: p.ubicacion || "",
                correo: p.correo || "",
                nombre_contacto: p.nombre_contacto || "",
            });
        }
    }, [location]);

    // ============================================================================
    // 3. REGLAS DE NEGOCIO Y VALIDACIÓN (BUSINESS LOGIC)
    // ============================================================================
    const validationRules: { [key: string]: (value: string) => string } = {
        nombre: (value) => {
            if (!value.trim()) return "El nombre es obligatorio";
            return "";
        },
        rif_number: (value) => {
            if (!value.trim()) return "El RIF es obligatorio";
            if (!/^\d+$/.test(value)) return "Solo números";
            if (value.length < 7 || value.length > 10) return "El RIF debe tener entre 7 y 10 dígitos";
            return "";
        },
        phone_number: (value) => {
            if (!value.trim()) return "El teléfono es obligatorio";
            if (!/^\d+$/.test(value)) return "Solo números";
            if (value.length < 7) return "Mínimo 7 dígitos";
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
            if (!/^[a-zA-Z ]+$/.test(value)) return "Solo letras";
            return "";
        }
    };

    // ============================================================================
    // 4. MANEJADORES DE EVENTOS (HANDLERS)
    // ============================================================================
    const validateField = (fieldName: string, value: string): string => {
        if (validationRules[fieldName]) return validationRules[fieldName](value);
        return "";
    };

    const handleInputChange = (fieldName: string, value: string) => {
        setNewProvider({ ...newProvider, [fieldName]: value });
        if (errors[fieldName]) setErrors({ ...errors, [fieldName]: "" });
    };

    // ============================================================================
    // 5. LÓGICA DE ACTUALIZACIÓN (CORE UPDATE LOGIC)
    // ============================================================================
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const newErrors: { [key: string]: string } = {};
        
        // Validar RIF
        const rErr = validateField('rif_number', rifNumber);
        if (rErr) newErrors['rif'] = rErr;

        // Validar teléfono
        const pErr = validateField('phone_number', phoneNum);
        if (pErr) newErrors['telefono'] = pErr;

        // Validar campos de newProvider
        Object.keys(newProvider).forEach(key => {
            const err = validateField(key, (newProvider as any)[key]);
            if (err) newErrors[key] = err;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            window.scrollTo(0, 0);
            setToastConfig({ 
                show: true, 
                message: "Algunos campos son incorrectos",
                type: 'error'
            });
            return;
        }

        try {
            const fullRif = `${rifLetter}-${rifNumber}`;
            const fullPhone = `${areaCode}-${phoneNum}`;
            
            if (editingId) {
                const { error } = await supabase
                    .from('Proveedores')
                    .update({
                        ...newProvider,
                        rif: fullRif,
                        telefono: fullPhone
                    })
                    .eq('id', editingId);

                if (error) throw error;
                
                navigate('/providers', { state: { successMessage: 'Proveedor actualizado con éxito' } });
            }
        } catch (error: any) {
            console.error('Error:', error);
            
            if (error.code === '23505') {
                const combinedInfo = `${error.message || ''} ${error.details || ''} ${error.detail || ''}`.toLowerCase();
                let fieldError = { ...errors };
                let msg = "Ya existe un registro con estos datos.";

                if (combinedInfo.includes('rif')) {
                    fieldError.rif = "Este RIF ya está registrado por otro proveedor.";
                    msg = "El RIF ya existe en el sistema.";
                } else if (combinedInfo.includes('telefono')) {
                    fieldError.telefono = "Este teléfono ya está registrado por otro proveedor.";
                    msg = "El número de teléfono ya existe.";
                } else if (combinedInfo.includes('correo') || combinedInfo.includes('email')) {
                    fieldError.correo = "Este correo ya está registrado por otro proveedor.";
                    msg = "El correo electrónico ya existe.";
                }

                setErrors(fieldError);
                setToastConfig({ show: true, message: msg, type: 'error' });
            } else {
                setToastConfig({ 
                    show: true, 
                    message: 'Hubo un error al intentar actualizar el proveedor.',
                    type: 'error'
                });
            }
        } finally {
            setIsLoading(false);
            window.scrollTo(0, 0);
        }
    };

    return (
        <Menu>
            <div className="min-h-screen bg-gray-50 p-5">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Editar Proveedor</h1>
                    <p className="text-gray-500 mt-1">Modifica la información del proveedor seleccionado.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Form Container: Información de la Empresa */}
                    <div className="bg-white border rounded-xl shadow-sm border-gray-200">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Información de la Empresa</h2>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="rif" className="block text-base font-medium text-gray-700 mb-2">RIF</label>
                                    <div className="flex">
                                        <select
                                            value={rifLetter}
                                            onChange={(e) => setRifLetter(e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-l-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all border-r-0"
                                        >
                                            <option value="J">J</option>
                                            <option value="V">V</option>
                                            <option value="G">G</option>
                                            <option value="E">E</option>
                                            <option value="P">P</option>
                                            <option value="C">C</option>
                                        </select>
                                        <input
                                            value={rifNumber}
                                            onChange={(e) => {
                                                setRifNumber(e.target.value);
                                                if (errors.rif) setErrors({...errors, rif: ""});
                                            }}
                                            type="text"
                                            id="rif"
                                            placeholder={errors.rif || "Números del RIF"}
                                            className={`w-full px-4 py-2.5 border rounded-r-lg focus:ring-2 outline-none transition-all ${
                                                errors.rif ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        />
                                    </div>
                                    {errors.rif && <p className="text-red-500 text-xs mt-1">{errors.rif}</p>}
                                </div>

                                <div>
                                    <label htmlFor="nombre" className="block text-base font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
                                    <input
                                        value={newProvider.nombre}
                                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                                        type="text"
                                        id="nombre"
                                        placeholder={errors.nombre || "Nombre de la empresa"}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                                            errors.nombre ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div>
                                    <label htmlFor="ubicacion" className="block text-base font-medium text-gray-700 mb-2">Ubicación</label>
                                    <input
                                        value={newProvider.ubicacion}
                                        onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                                        type="text"
                                        id="ubicacion"
                                        placeholder={errors.ubicacion || "Ubicación de la empresa"}
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
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Información de Contacto</h2>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="nombre_contacto" className="block text-base font-medium text-gray-700 mb-2">Nombre del Contacto</label>
                                    <input
                                        value={newProvider.nombre_contacto}
                                        onChange={(e) => handleInputChange('nombre_contacto', e.target.value)}
                                        type="text"
                                        id="nombre_contacto"
                                        placeholder={errors.nombre_contacto || "Persona de contacto"}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                                            errors.nombre_contacto ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.nombre_contacto && <p className="text-red-500 text-xs mt-1">{errors.nombre_contacto}</p>}
                                </div>

                                <div>
                                    <label htmlFor="telefono" className="block text-base font-medium text-gray-700 mb-2">Teléfono</label>
                                    <div className="flex">
                                        <select
                                            value={areaCode}
                                            onChange={(e) => setAreaCode(e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-l-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all border-r-0"
                                        >
                                            <option value="0414">0414</option>
                                            <option value="0424">0424</option>
                                            <option value="0412">0412</option>
                                            <option value="0416">0416</option>
                                            <option value="0426">0426</option>
                                            <option value="0212">0212</option>
                                            <option value="0241">0241</option>
                                            <option value="0243">0243</option>
                                            <option value="0251">0251</option>
                                            <option value="0261">0261</option>
                                            <option value="0281">0281</option>
                                        </select>
                                        <input
                                            value={phoneNum}
                                            onChange={(e) => {
                                                setPhoneNum(e.target.value);
                                                if (errors.telefono) setErrors({...errors, telefono: ""});
                                            }}
                                            type="tel"
                                            id="telefono"
                                            placeholder={errors.telefono || "Número de teléfono"}
                                            className={`w-full px-4 py-2.5 border rounded-r-lg focus:ring-2 outline-none transition-all ${
                                                errors.telefono ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        />
                                    </div>
                                    {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div>
                                    <label htmlFor="correo" className="block text-base font-medium text-gray-700 mb-2">Correo Electrónico</label>
                                    <input
                                        value={newProvider.correo}
                                        onChange={(e) => handleInputChange('correo', e.target.value)}
                                        type="text"
                                        id="correo"
                                        placeholder={errors.correo || "Correo electrónico"}
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
                            {isLoading ? 'Guardando...' : 'Actualizar Proveedor'}
                        </button>
                    </div>
                </form>
            </div>
            
            <Message
                message={toastConfig.message}
                isVisible={toastConfig.show}
                type={toastConfig.type}
                onClose={() => setToastConfig({...toastConfig, show: false})}
            />
        </Menu>
    );
}