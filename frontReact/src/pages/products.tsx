import { Menu } from "../components/menu";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

export function Products() {
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

    // Estado para manejar los errores de validación de TODOS los campos
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // ============================================
    // REGLAS DE VALIDACIÓN CENTRALIZADAS
    // ============================================
    // Aquí defines las reglas para cada campo que quieras validar
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

    // ============================================
    // FUNCIÓN GENÉRICA DE VALIDACIÓN
    // ============================================
    // Esta función valida cualquier campo usando las reglas definidas arriba
    const validateField = (fieldName: string, value: string): string => {
        // Si existe una regla para este campo, la ejecuta
        if (validationRules[fieldName]) {
            return validationRules[fieldName](value);
        }
        // Si no hay regla, no hay error
        return "";
    };

    // ============================================
    // HANDLER UNIVERSAL PARA INPUTS
    // ============================================
    // Esta función maneja CUALQUIER input del formulario
    const handleInputChange = (fieldName: string, value: string) => {
        // Solo actualiza el valor, NO valida en tiempo real
        setNewProduct({ ...newProduct, [fieldName]: value });
        
        // Si había un error previo para este campo, lo limpia
        if (errors[fieldName]) {
            setErrors({ ...errors, [fieldName]: "" });
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault(); // Previene el recargo de la página al enviar el formulario

        // ============================================
        // VALIDAR TODOS LOS CAMPOS ANTES DE ENVIAR
        // ============================================
        const newErrors: { [key: string]: string } = {};
        
        // Recorre todos los campos del producto y los valida
        Object.keys(newProduct).forEach((fieldName) => {
            const value = newProduct[fieldName as keyof typeof newProduct];
            const error = validateField(fieldName, String(value));
            if (error) {
                newErrors[fieldName] = error;
            }
        });
        
        // Validar imagen
        if (!imageFile) {
            newErrors['imagen'] = "La imagen del producto es obligatoria";
        }

        // Si hay errores, actualiza el estado y detiene el envío
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert("Por favor corrige los errores en el formulario antes de enviar");
            return; // Detiene el envío del formulario
        }

        try {
            let imageUrl = null;

            // Paso 1: Subir la imagen a Supabase Storage si el usuario seleccionó una
            if (imageFile) {
                // Generamos un nombre de archivo único usando la fecha actual para evitar duplicados
                const fileExt = imageFile.name.split('.').pop(); // Obtiene la extensión del archivo el pop toma el utlimo elemento cortado por split 
                const fileName = `${Date.now()}.${fileExt}`; // Genera un nombre de archivo único
                const filePath = `${fileName}`; // Ruta dentro del bucket

                // Subimos el archivo al bucket 
                const { error: uploadError } = await supabase.storage.from('imagenesproductos').upload(filePath, imageFile);

                if (uploadError) {
                    throw new Error(`Error al subir imagen: ${uploadError.message}`);
                }

                // Obtenemos la URL pública para guardarla en la base de datos
                const { data } = supabase.storage.from('imagenesproductos').getPublicUrl(filePath);

                imageUrl = data.publicUrl;
            }

            // Paso 2: Preparar el objeto del producto incluyendo la URL de la imagen
            // Convertimos los valores string a números o null para evitar errores de tipo bigint
            // Extraemos id_proveedor para no enviarlo a la tabla Productos ya que pertenece a Detalle_Productos
            const { id_proveedor, ...productDataForInsert } = newProduct;
            const productToSave = {
                ...productDataForInsert,
                imagen: imageUrl // Asignamos la URL al campo 'imagen' que espera la tabla
            };

            // Paso 3: Insertar el producto en la tabla 'Productos'
            // Usamos .select().single() para obtener los datos del registro insertado, incluyendo el ID generado
            const { data: productData, error: productError } = await supabase
                .from('Productos')
                .insert(productToSave)
                .select()
                .single();

            if (productError) {
                console.error('Error al guardar en base de datos:', productError);
                throw productError;
            }

            // Paso 4: Insertar en la tabla de detalles (Detalle_Productos)
            if (productData) {
                // Preparamos el objeto de detalle con el ID del producto recién creado
                // Aseguramos que sea un número válido o null para evitar errores de tipo
                const detailToSave = {
                    id_producto: productData.id,
                    id_proveedor: newProduct.id_proveedor || null,
                };

                const { error: detailError } = await supabase
                    .from('Detalle_Productos')
                    .insert(detailToSave);

                if (detailError) {
                    console.error('Error al guardar el detalle del producto:', detailError);
                    // No lanzamos error aquí para no interrumpir el flujo de éxito del producto, pero podrías manejarlo según necesidad
                }

                // Si todo sale bien, reseteamos el formulario y los estados
                setNewProduct({
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
                setImagePreview(null);
                setImageFile(null); // Limpiamos el archivo seleccionado
                

                // Reseteamos el formulario HTML
                e.target.reset(); // Esto limpia los inputs que no están controlados por React si los hubiera

                console.log('Producto agregado exitosamente:', productData.nombre);
            }
        } catch (error) {
            console.error('Error general:', error);
            alert("Ocurrió un error al procesar la solicitud");
        }
    };

    const [categories, setCategories] = useState<any[]>([]);
    const getCategories = async () => {
        const { error, data } = await supabase.from('Categorias').select('*').order('nombre', { ascending: true });
        if (error) {
            console.error('Error al obtener las categorías:', error);
            return
        }
        setCategories(data);
    };

    useEffect(() => {
        getCategories();
    }, []);

    const [providers, setProviders] = useState<any[]>([]);
    const getProviders = async () => {
        const { error, data } = await supabase.from('Proveedores').select('*').order('nombre', { ascending: true });
        if (error) {
            console.error('Error al obtener los proveedores:', error);
            return
        }
        setProviders(data);
    };

    useEffect(() => {
        getProviders();
    }, []);

    // Estado para almacenar la URL de la imagen en base64 y mostrar la vista previa
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    // Estado para almacenar el archivo de imagen real que se subirá a Supabase Storage
    const [imageFile, setImageFile] = useState<File | null>(null);

   

    // Funcion que se ejecuta cuando el usuario selecciona un archivo mediante el input
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Accedemos al primer archivo seleccionado por el usuario
        const file = e.target.files?.[0];
        if (file) {
            // Guardamos el archivo en el estado para usarlo posteriormente en la subida
            setImageFile(file);

            // Creamos una instancia de FileReader para leer el contenido del archivo
            const reader = new FileReader();
            // Definimos que hacer cuando la lectura del archivo termine exitosamente
            reader.onloadend = () => {
                // Actualizamos el estado con el resultado de la lectura (cadena base64) para mostrar la imagen
                setImagePreview(reader.result as string);
            };
            // Iniciamos la lectura del archivo como una URL de datos (base64)
            // Iniciamos la lectura del archivo como una URL de datos (base64)
            reader.readAsDataURL(file);

            // Limpiamos el error de imagen si existe
            if (errors.imagen) {
                setErrors({ ...errors, imagen: "" });
            }
        }
    };

    // Funcion para manejar el evento cuando se arrastra un archivo sobre la zona de carga
    // Es necesario prevenir el comportamiento por defecto para permitir que se pueda soltar el archivo
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        // Previene que el navegador abra el archivo directamente
        e.preventDefault();
        // Detiene la propagacion del evento a elementos padre
        e.stopPropagation();
    };

    // Funcion que maneja el evento cuando se suelta el archivo en la zona de carga
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        // Prevenimos el comportamiento por defecto y la propagacion
        e.preventDefault();
        e.stopPropagation();

        // Accedemos al archivo arrastrado desde la propiedad dataTransfer
        const file = e.dataTransfer.files?.[0];
        // Verificamos que exista el archivo y que sea de tipo imagen
        if (file && file.type.startsWith('image/')) {
            // Guardamos el archivo en el estado
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                // Actualizamos la vista previa con la imagen leida
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Limpiamos el error de imagen si existe
            if (errors.imagen) {
                setErrors({ ...errors, imagen: "" });
            }
        }
    };

    // Funcion para eliminar la imagen seleccionada y limpiar el estado
    // Funcion para eliminar la imagen seleccionada y limpiar el estado
    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFile(null); // Limpiamos también el estado del archivo

        // Reseteamos el valor del input file para permitir seleccionar la misma imagen nuevamente si el usuario lo desea
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
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
                        {/* Section Title */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Descripción del Producto</h2>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="barcode" className="block text-base font-medium text-gray-700 mb-2">
                                        Codigo de Barras
                                    </label>
                                    <input
                                        value={newProduct.codigo_barras}
                                        onChange={(e) => handleInputChange('codigo_barras', e.target.value)}
                                        type="text"
                                        id="barcode"
                                        name="barcode"
                                        placeholder={errors.codigo_barras || "Ingrese el codigo de barras"}
                                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${
                                            errors.codigo_barras 
                                                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-red-500' 
                                                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.codigo_barras && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.codigo_barras}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="product_name" className="block text-base font-medium text-gray-700 mb-2">
                                        Nombre del Producto
                                    </label>
                                    <input
                                        value={newProduct.nombre}
                                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                                        type="text"
                                        id="product_name"
                                        name="product_name"
                                        placeholder={errors.nombre || "Ingrese el nombre del producto"}
                                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${
                                            errors.nombre 
                                                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-red-500' 
                                                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.nombre && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="tipo" className="block text-base font-medium text-gray-700 mb-2">
                                        Tipo de Producto
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="tipo"
                                            name="tipo"
                                            value={newProduct.tipo_producto}
                                            onChange={(e) => handleInputChange('tipo_producto', e.target.value)}
                                            className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all appearance-none bg-white ${
                                                errors.tipo_producto 
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        >
                                            <option value="">Seleccione</option>
                                            <option value="simple">Simple</option>
                                            <option value="combo">Kit / Combo</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.tipo_producto && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.tipo_producto}
                                        </p>
                                    )}
                                </div>

                                <div>

                                </div>
                            </div>
                            {/* Row 5: Description and Image Upload */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-1">
                                {/* Description */}
                                <div className="flex flex-col">
                                    <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={newProduct.descripcion}
                                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                        placeholder={errors.descripcion || "Ingrese la descripción del producto (opcional)"}
                                        rows={6}
                                        className={`w-full flex-1 px-4 py-2.5 border rounded-lg outline-none transition-all resize-none ${
                                            errors.descripcion 
                                                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-red-500' 
                                                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.descripcion && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.descripcion}
                                        </p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="flex flex-col">
                                    <label htmlFor="fileInput" className="block text-base font-medium text-gray-700 mb-2">
                                        Imagen del Producto
                                    </label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer w-full h-64 flex flex-col items-center justify-center relative ${
                                            errors.imagen ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                        // Eventos de arrastrar y soltar asignados al contenedor
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        // Al hacer click en el contenedor, simulamos un click en el input file oculto
                                        onClick={() => document.getElementById('fileInput')?.click()}
                                    >
                                        {!imagePreview ? (
                                            <>
                                                {/* Upload Icon */}
                                                <div className="mb-4">
                                                    <svg
                                                        className="w-12 h-12 mx-auto text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        />
                                                    </svg>
                                                </div>

                                                {/* Upload Text */}
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-semibold text-blue-600 hover:text-blue-700">
                                                        Subir imagen
                                                    </span>
                                                    <span> o arrastra y suelta SVG, PNG, JPG o GIF</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    (MAX. 800x400px)
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                {/* Image Preview */}
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="max-w-full h-32 object-contain rounded-lg"
                                                    />
                                                    {/* Remove Button */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveImage();
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Click para cambiar la imagen
                                                </p>
                                            </>
                                        )}

                                        {/* Hidden File Input */}
                                        <input
                                            id="fileInput"
                                            type="file"
                                            className="hidden"
                                            accept="image/svg+xml,image/png,image/jpeg,image/gif"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    {errors.imagen && (
                                        <p className="mt-1 text-sm text-red-600 text-center">
                                            {errors.imagen}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categorization Form Container */}
                    <div className="bg-white border rounded-xl shadow-sm border-gray-200">
                        {/* Section Title */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Categorización</h2>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Row 1: Category and Brand */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="category" className="block text-base font-medium text-gray-700 mb-2">
                                        Categoría
                                    </label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <select
                                                    id="category"
                                                    name="category"
                                                    value={newProduct.id_categoria}
                                                    onChange={(e) => handleInputChange('id_categoria', e.target.value)}
                                                    className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all appearance-none bg-white ${
                                                        errors.id_categoria
                                                            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                                            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                    }`}
                                                >
                                                    <option value="">Seleccione una categoría</option>
                                                    {categories.map((category, key) => (
                                                        <option key={key} value={category.id}>
                                                            {category.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm"
                                                onClick={() => console.log('Añadir nueva categoría')}
                                                title="Añadir nueva categoría"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    {errors.id_categoria && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.id_categoria}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="brandName" className="block text-base font-medium text-gray-700 mb-2">
                                        Marca
                                    </label>
                                    <input
                                        type="text"
                                        id="brandName"
                                        name="brandName"
                                        value={newProduct.marca}
                                        onChange={(e) => handleInputChange('marca', e.target.value)}
                                        placeholder={errors.marca || "Ingrese la marca (opcional)"}
                                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${
                                            errors.marca
                                                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-red-500' 
                                                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.marca && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.marca}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Supplier and Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="supplier" className="block text-base font-medium text-gray-700 mb-2">
                                        Proveedor Principal
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="supplier"
                                            name="supplier"
                                            value={newProduct.id_proveedor}
                                            onChange={(e) => handleInputChange('id_proveedor', e.target.value)}
                                            className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all appearance-none bg-white ${
                                                errors.id_proveedor
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                                                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        >
                                            <option value="">Seleccione un proveedor</option>
                                            {providers.map((provider, key) => ( // map funciona para recorrer un array
                                                <option key={key} value={provider.id}>
                                                    {provider.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.id_proveedor && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.id_proveedor}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-base font-medium text-gray-700 mb-2">
                                        Ubicación del producto
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={newProduct.ubicacion}
                                        onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                                        placeholder={errors.ubicacion || "Ingrese la ubicación (Ej: Pasillo 3, Estante B)"}
                                        className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${
                                            errors.ubicacion
                                                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-red-500' 
                                                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    {errors.ubicacion && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.ubicacion}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Precio y Control Form Container */}
                    <div className="bg-white border rounded-xl shadow-sm border-gray-200">
                        {/* Section Title */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Precio y Control</h2>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Row 1: Costo Adquisicion & Precio Venta */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Costo de Adquisicion */}
                                <div>
                                    <label htmlFor="acquisitionCost" className="block text-base font-medium text-gray-700 mb-2">
                                        Costo de Adquisición
                                    </label>
                                    <div className="flex rounded-lg shadow-sm">
                                        <input
                                            type="number"
                                            id="acquisitionCost"
                                            name="acquisitionCost"
                                            value={newProduct.costo_monto}
                                            onChange={(e) => handleInputChange('costo_monto', e.target.value)}
                                            placeholder={errors.costo_monto || "0.00"}
                                            className={`flex-1 px-4 py-2.5 border rounded-l-lg border-r-0 outline-none transition-all ${
                                                errors.costo_monto
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-red-500' 
                                                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        />
                                        <select
                                            id="costCurrency"
                                            name="costCurrency"
                                            value={newProduct.id_costo_moneda}
                                            onChange={(e) => setNewProduct({ ...newProduct, id_costo_moneda: e.target.value })}
                                            aria-label="Moneda de Costo"
                                            className="px-3 py-2.5 border border-gray-300 bg-gray-50 text-gray-600 font-medium rounded-r-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                                        >
                                            <option value="2">Bs</option>
                                            <option value="1">$</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Precio de Venta */}
                                <div>
                                    <label htmlFor="salePrice" className="block text-base font-medium text-gray-700 mb-2">
                                        Precio de Venta
                                    </label>
                                    <div className="flex rounded-lg shadow-sm">
                                        <input
                                            type="number"
                                            id="salePrice"
                                            name="salePrice"
                                            value={newProduct.precio_monto}
                                            onChange={(e) => handleInputChange('precio_monto', e.target.value)}
                                            placeholder={errors.precio_monto || "0.00"}
                                            className={`flex-1 px-4 py-2.5 border rounded-l-lg border-r-0 outline-none transition-all ${
                                            errors.precio_monto
                                                ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-red-500' 
                                                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                        />
                                        <select
                                            id="priceCurrency"
                                            name="priceCurrency"
                                            value={newProduct.id_precio_moneda}
                                            onChange={(e) => setNewProduct({ ...newProduct, id_precio_moneda: e.target.value })}
                                            aria-label="Moneda de Venta"
                                            className="px-3 py-2.5 border border-gray-300 bg-gray-50 text-gray-600 font-medium rounded-r-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                                        >
                                            <option value="2">Bs</option>
                                            <option value="1">$</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Profit Margin and Stock Control */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Margen de Ganancia */}
                                <div>
                                    <label htmlFor="profitMargin" className="block text-base font-medium text-gray-700 mb-2">
                                        Margen de Ganancia
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="profitMargin"
                                            name="profitMargin"
                                            value={newProduct.margen_ganancia}
                                            onChange={(e) => handleInputChange('margen_ganancia', e.target.value)}
                                            max="100"
                                            min="0"
                                            placeholder={errors.margen_ganancia || "(Campo opcional)"}
                                            className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all pr-10 ${
                                                errors.margen_ganancia
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-red-500' 
                                                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <span>%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stock Actual */}
                                <div>
                                    <label htmlFor="stock" className="block text-base font-medium text-gray-700 mb-2">
                                        Stock Actual
                                    </label>
                                    <div className={`flex items-center border rounded-lg w-full ${
                                        errors.stock ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('stock', String(Math.max(0, (Number(newProduct.stock) || 0) - 1)))}
                                            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors border-r border-gray-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <input
                                            type="number"
                                            id="stock"
                                            value={newProduct.stock}
                                            onChange={(e) => handleInputChange('stock', e.target.value)}
                                            className="w-full text-center border-none py-2.5 focus:ring-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('stock', String((Number(newProduct.stock) || 0) + 1))}
                                            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors border-l border-gray-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    {errors.stock && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.stock}
                                        </p>
                                    )}
                                </div>

                                {/* Stock Minimo */}
                                <div>
                                    <label htmlFor="minStock" className="block text-base font-medium text-gray-700 mb-2">
                                        Stock Mínimo
                                    </label>
                                    <div className={`flex items-center border rounded-lg w-full ${
                                        errors.stock_minimo ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('stock_minimo', String(Math.max(0, (Number(newProduct.stock_minimo) || 0) - 1)))}
                                            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors border-r border-gray-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <input
                                            type="number"
                                            id="minStock"
                                            value={newProduct.stock_minimo}
                                            onChange={(e) => handleInputChange('stock_minimo', e.target.value)}
                                            className="w-full text-center border-none py-2.5 focus:ring-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('stock_minimo', String((Number(newProduct.stock_minimo) || 0) + 1))}
                                            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors border-l border-gray-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    {errors.stock_minimo && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.stock_minimo}
                                        </p>
                                    )}
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
                            Guardar Producto
                        </button>
                    </div>
                </form>
            </div>
        </Menu>
    );
}