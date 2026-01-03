
import { Menu } from "../components/menu";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { Message } from "../components/message";
import { CategoryModal } from "../components/categoryModal";
import { Link, useNavigate } from "react-router-dom";

export function Products() {
    // --- 1. CONSTANTES Y ESTADOS ---
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [toastConfig, setToastConfig] = useState({ show: false, message: '' });

    // Listas de datos remotos (Categorías y Proveedores)
    const [categories, setCategories] = useState<any[]>([]);
    const [providers, setProviders] = useState<any[]>([]);

    // Estados para previsualización de imagen
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Estado del nuevo producto
    const [newProduct, setNewProduct] = useState({
        codigo_barras: "",
        nombre: "",
        descripcion: "",
        tipo_producto: "",
        id_categoria: "",
        marca: "",
        ubicacion: "",
        costo_monto: "",
        precio_monto: "",
        margen_ganancia: "",
        stock: "",
        stock_minimo: "",
        id_costo_moneda: "2",
        id_precio_moneda: "2",
        id_proveedor: "",
    });

    // --- 2. REGLAS DE VALIDACIÓN CENTRALIZADAS ---
    const validationRules: { [key: string]: (value: string) => string } = {
        nombre: (value) => {
            if (!value.trim()) return "El nombre es obligatorio";
            if (/\d/.test(value)) return "El nombre no puede contener números";
            if (value.length > 50) return "El nombre no puede exceder 50 caracteres";
            return "";
        },
        codigo_barras: (value) => {
            if (!value.trim()) return "El código de barras es obligatorio";
            if (value.length < 8) return "El código debe tener al menos 8 caracteres";
            if (value.length > 20) return "El código no puede exceder 20 caracteres";
            return "";
        },
        marca: (value) => {
            if (value && /\d/.test(value)) return "La marca no puede contener números";
            if (value.length > 30) return "La marca no puede exceder 30 caracteres";
            return "";
        },
        ubicacion: (value) => {
            if (value.length > 50) return "La ubicación no puede exceder 50 caracteres";
            return "";
        },
        costo_monto: (value) => {
            if (!value.trim()) return "El costo es obligatorio";
            if (parseFloat(value) <= 0) return "El costo debe ser mayor a 0";
            return "";
        },
        precio_monto: (value) => {
            if (!value.trim()) return "El precio es obligatorio";
            if (parseFloat(value) <= 0) return "El precio debe ser mayor a 0";
            return "";
        },
        stock: (value) => {
            if (!String(value).trim()) return "El stock es obligatorio";
            if (Number(value) < 0) return "El stock no puede ser negativo";
            if (Number(value) < Number(newProduct.stock_minimo)) return "El stock no puede ser menor al stock mínimo";
            return "";
        },
        stock_minimo: (value) => {
            if (!String(value).trim()) return "El stock mínimo es obligatorio";
            if (Number(value) < 0) return "El stock mínimo no puede ser negativo";
            return "";
        },
        descripcion: (value) => {
            if (value.length > 500) return "La descripción no puede exceder 500 caracteres";
            return "";
        },
        tipo_producto: (value) => {
            if (!value) return "Debe seleccionar un tipo de producto";
            return "";
        },
        id_categoria: (value) => {
            if (!value) return "Debe seleccionar una categoría";
            return "";
        },
        id_proveedor: (value) => {
            if (!value) return "Debe seleccionar un proveedor";
            return "";
        },
        margen_ganancia: (value) => {
            if (value && (Number(value) <= 0 || Number(value) > 100)) return "El margen debe ser mayor a 0 y máx 100";
            return "";
        }
    };

    // --- 3. FUNCIONES DE MANEJO DE DATOS Y FORMULARIO ---
    const getCategories = async () => {
        const { error, data } = await supabase
            .from('Categorias')
            .select('*')
            .eq('estado', true)
            .order('nombre', { ascending: true });
        if (!error && data) setCategories(data);
    };

    const getProviders = async () => {
        const { error, data } = await supabase
            .from('Proveedores')
            .select('*')
            .eq('estado', true)
            .order('nombre', { ascending: true });
        if (!error && data) setProviders(data);
    };

    useEffect(() => {
        getCategories();
        getProviders();
    }, []);

    const validateField = (fieldName: string, value: string): string => {
        if (validationRules[fieldName]) return validationRules[fieldName](value);
        return "";
    };

    const handleInputChange = (fieldName: string, value: string) => {
        setNewProduct({ ...newProduct, [fieldName]: value });
        if (errors[fieldName]) setErrors({ ...errors, [fieldName]: "" });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            if (errors.imagen) setErrors({ ...errors, imagen: "" });
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFile(null);
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const newErrors: { [key: string]: string } = {};
        Object.keys(newProduct).forEach((fieldName) => {
            const value = (newProduct as any)[fieldName];
            const error = validateField(fieldName, String(value));
            if (error) newErrors[fieldName] = error;
        });
        
        if (!imageFile) newErrors['imagen'] = "La imagen del producto es obligatoria";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            alert("Por favor corrige los errores antes de continuar");
            return;
        }

        try {
            let imageUrl = null;
            if (imageFile) {
                const fileName = `${Date.now()}.${imageFile.name.split('.').pop()}`;
                const { error: uploadError } = await supabase.storage.from('imagenesproductos').upload(fileName, imageFile);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('imagenesproductos').getPublicUrl(fileName);
                imageUrl = data.publicUrl;
            }

            const { id_proveedor, ...pData } = newProduct;
            const { data: pCreated, error: pError } = await supabase.from('Productos').insert({...pData, imagen: imageUrl, estado: true}).select().single();

            if (pError) throw pError;

            if (pCreated) {
                await supabase.from('Detalle_Productos').insert({ id_producto: pCreated.id, id_proveedor: newProduct.id_proveedor || null });
                setToastConfig({ show: true, message: 'Producto guardado exitosamente' });
                setTimeout(() => navigate('/inventory'), 1500);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error al guardar en la base de datos");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Menu>
            <div className="min-h-screen bg-gray-50 p-5">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Añadir Producto</h1>
                    <p className="text-gray-500 mt-1">Completa la información del producto para agregarlo a tu inventario.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form Container: Descripción del Producto */}
                    <div className="bg-white border rounded-xl shadow-sm border-gray-200">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Descripción del Producto</h2>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="barcode" className="block text-base font-medium text-gray-700 mb-2">Codigo de Barras</label>
                                    <input
                                        value={newProduct.codigo_barras}
                                        onChange={(e) => handleInputChange('codigo_barras', e.target.value)}
                                        type="text"
                                        id="barcode"
                                        placeholder={errors.codigo_barras || "Ingrese el codigo de barras"}
                                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${
                                            errors.codigo_barras ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.codigo_barras && <p className="mt-1 text-sm text-red-600">{errors.codigo_barras}</p>}
                                </div>

                                <div>
                                    <label htmlFor="product_name" className="block text-base font-medium text-gray-700 mb-2">Nombre del Producto</label>
                                    <input
                                        value={newProduct.nombre}
                                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                                        type="text"
                                        id="product_name"
                                        placeholder={errors.nombre || "Ingrese el nombre del producto"}
                                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${
                                            errors.nombre ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="tipo" className="block text-base font-medium text-gray-700 mb-2">Tipo de Producto</label>
                                    <div className="relative">
                                        <select
                                            id="tipo"
                                            value={newProduct.tipo_producto}
                                            onChange={(e) => handleInputChange('tipo_producto', e.target.value)}
                                            className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all appearance-none bg-white ${
                                                errors.tipo_producto ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        >
                                            <option value="">Seleccione</option>
                                            <option value="simple">Simple</option>
                                            <option value="combo">Kit / Combo</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                        </div>
                                    </div>
                                    {errors.tipo_producto && <p className="mt-1 text-sm text-red-600">{errors.tipo_producto}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-1">
                                <div className="flex flex-col">
                                    <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-2">Descripción</label>
                                    <textarea
                                        id="description"
                                        value={newProduct.descripcion}
                                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                        placeholder={errors.descripcion || "Ingrese la descripción del producto (opcional)"}
                                        rows={6}
                                        className={`w-full flex-1 px-4 py-2.5 border rounded-lg outline-none transition-all resize-none ${
                                            errors.descripcion ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="fileInput" className="block text-base font-medium text-gray-700 mb-2">Imagen del Producto</label>
                                    <div
                                        onClick={() => document.getElementById('fileInput')?.click()}
                                        className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer w-full h-64 flex flex-col items-center justify-center relative ${
                                            errors.imagen ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        {!imagePreview ? (
                                            <>
                                                <div className="mb-4 text-gray-400">
                                                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-semibold text-blue-600">Subir imagen</span> o arrastra y suelta
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG o GIF (MAX. 800x400px)</p>
                                            </>
                                        ) : (
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                <img src={imagePreview} alt="Preview" className="max-w-full h-48 object-contain rounded-lg" />
                                                <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg">✕</button>
                                            </div>
                                        )}
                                        <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </div>
                                    {errors.imagen && <p className="mt-1 text-sm text-red-600 text-center">{errors.imagen}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Container: Categorización */}
                    <div className="bg-white border rounded-xl shadow-sm border-gray-200">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Categorización</h2>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="category" className="block text-base font-medium text-gray-700 mb-2">Categoría</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <select
                                                id="category"
                                                value={newProduct.id_categoria}
                                                onChange={(e) => handleInputChange('id_categoria', e.target.value)}
                                                className={`w-full px-4 py-2.5 border rounded-lg outline-none appearance-none bg-white ${
                                                    errors.id_categoria ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                }`}
                                            >
                                                <option value="">Seleccione Categoría</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setIsAddCategoryModalOpen(true)} className="px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">＋</button>
                                    </div>
                                    {errors.id_categoria && <p className="mt-1 text-sm text-red-600">{errors.id_categoria}</p>}
                                </div>

                                <div>
                                    <label htmlFor="brand" className="block text-base font-medium text-gray-700 mb-2">Marca</label>
                                    <input
                                        value={newProduct.marca}
                                        onChange={(e) => handleInputChange('marca', e.target.value)}
                                        type="text"
                                        id="brand"
                                        placeholder={errors.marca || "Ingrese la marca (opcional)"}
                                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${
                                            errors.marca ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.marca && <p className="mt-1 text-sm text-red-600">{errors.marca}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="supplier" className="block text-base font-medium text-gray-700 mb-2">Proveedor Principal</label>
                                    <div className="relative">
                                        <select
                                            id="supplier"
                                            value={newProduct.id_proveedor}
                                            onChange={(e) => handleInputChange('id_proveedor', e.target.value)}
                                            className={`w-full px-4 py-2.5 border rounded-lg outline-none appearance-none bg-white ${
                                                errors.id_proveedor ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        >
                                            <option value="">Seleccione Proveedor</option>
                                            {providers.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                        </div>
                                    </div>
                                    {errors.id_proveedor && <p className="mt-1 text-sm text-red-600">{errors.id_proveedor}</p>}
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-base font-medium text-gray-700 mb-2">Ubicación del Producto</label>
                                    <input
                                        value={newProduct.ubicacion}
                                        onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                                        type="text"
                                        id="location"
                                        placeholder={errors.ubicacion || "Ej: Pasillo 3, Estante B"}
                                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${
                                            errors.ubicacion ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.ubicacion && <p className="mt-1 text-sm text-red-600">{errors.ubicacion}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Container: Precio y Control */}
                    <div className="bg-white border rounded-xl shadow-sm border-gray-200">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Precio y Control</h2>
                        </div>

                        <div className="p-6">
                            {/* Fila 1: Costo y Precio (2 columnas) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="acquisitionCost" className="block text-base font-medium text-gray-700 mb-2">Costo de Adquisición</label>
                                    <div className="flex rounded-lg shadow-sm">
                                        <input
                                            value={newProduct.costo_monto}
                                            onChange={(e) => handleInputChange('costo_monto', e.target.value)}
                                            type="number"
                                            id="acquisitionCost"
                                            placeholder={errors.costo_monto || "0.00"}
                                            className={`flex-1 px-4 py-2.5 border rounded-l-lg border-r-0 outline-none transition-all ${
                                                errors.costo_monto ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        />
                                        <select
                                            value={newProduct.id_costo_moneda}
                                            onChange={(e) => handleInputChange('id_costo_moneda', e.target.value)}
                                            className="px-3 border border-gray-300 bg-white text-gray-600 font-medium rounded-r-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                                        >
                                            <option value="2">Bs</option>
                                            <option value="1">$</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="salePrice" className="block text-base font-medium text-gray-700 mb-2">Precio de Venta</label>
                                    <div className="flex rounded-lg shadow-sm">
                                        <input
                                            value={newProduct.precio_monto}
                                            onChange={(e) => handleInputChange('precio_monto', e.target.value)}
                                            type="number"
                                            id="salePrice"
                                            placeholder={errors.precio_monto || "0.00"}
                                            className={`flex-1 px-4 py-2.5 border rounded-l-lg border-r-0 outline-none transition-all ${
                                                errors.precio_monto ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        />
                                        <select
                                            value={newProduct.id_precio_moneda}
                                            onChange={(e) => handleInputChange('id_precio_moneda', e.target.value)}
                                            className="px-3 border border-gray-300 bg-white text-gray-600 font-medium rounded-r-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                                        >
                                            <option value="2">Bs</option>
                                            <option value="1">$</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Fila 2: Margen, Stock y Min Stock (3 columnas) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="profitMargin" className="block text-base font-medium text-gray-700 mb-2">Margen de Ganancia</label>
                                    <div className="relative">
                                        <input
                                            value={newProduct.margen_ganancia}
                                            onChange={(e) => handleInputChange('margen_ganancia', e.target.value)}
                                            type="number"
                                            id="profitMargin"
                                            placeholder={errors.margen_ganancia || "(Campo opcional)"}
                                            className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all pr-10 ${
                                                errors.margen_ganancia ? 'border-red-500 placeholder-red-500 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 font-medium">
                                            <span>%</span>
                                        </div>
                                    </div>
                                    {errors.margen_ganancia && <p className="mt-1 text-sm text-red-600">{errors.margen_ganancia}</p>}
                                </div>

                                <div>
                                    <label htmlFor="stock" className="block text-base font-medium text-gray-700 mb-2">Stock Actual</label>
                                    <div className={`flex items-center border rounded-lg w-full overflow-hidden ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('stock', String(Math.max(0, (Number(newProduct.stock) || 0) - 1)))}
                                            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors border-r border-gray-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                        </button>
                                        <input
                                            type="number"
                                            id="stock"
                                            value={newProduct.stock}
                                            onChange={(e) => handleInputChange('stock', e.target.value)}
                                            className="w-full text-center border-none py-2.5 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('stock', String((Number(newProduct.stock) || 0) + 1))}
                                            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors border-l border-gray-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                        </button>
                                    </div>
                                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                                </div>

                                <div>
                                    <label htmlFor="min_stock" className="block text-base font-medium text-gray-700 mb-2">Stock Mínimo</label>
                                    <div className={`flex items-center border rounded-lg w-full overflow-hidden ${errors.stock_minimo ? 'border-red-500' : 'border-gray-300'}`}>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('stock_minimo', String(Math.max(0, (Number(newProduct.stock_minimo) || 0) - 1)))}
                                            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors border-r border-gray-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                        </button>
                                        <input
                                            type="number"
                                            id="min_stock"
                                            value={newProduct.stock_minimo}
                                            onChange={(e) => handleInputChange('stock_minimo', e.target.value)}
                                            className="w-full text-center border-none py-2.5 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('stock_minimo', String((Number(newProduct.stock_minimo) || 0) + 1))}
                                            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors border-l border-gray-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                        </button>
                                    </div>
                                    {errors.stock_minimo && <p className="mt-1 text-sm text-red-600">{errors.stock_minimo}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button Container */}
                    <div className="flex items-center justify-end pt-4 pb-15">
                        <Link to="/inventory">
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
                            {isLoading ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>

                <CategoryModal
                    isOpen={isAddCategoryModalOpen}
                    onClose={() => setIsAddCategoryModalOpen(false)}
                    onSuccess={() => { getCategories(); setToastConfig({ show: true, message: 'Categoría añadida' }); }}
                />

                <Message
                    message={toastConfig.message}
                    isVisible={toastConfig.show}
                    onClose={() => setToastConfig({ ...toastConfig, show: false })}
                />
            </div>
        </Menu>
    );
}