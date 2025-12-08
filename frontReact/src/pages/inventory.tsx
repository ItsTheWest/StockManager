import { Menu } from "../components/menu";
import { useState } from "react";

export function Inventory() {
    // Estado para almacenar la URL de la imagen en base64 y mostrar la vista previa
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Funcion que se ejecuta cuando el usuario selecciona un archivo mediante el input
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Accedemos al primer archivo seleccionado por el usuario
        const file = e.target.files?.[0];
        if (file) {
            // Creamos una instancia de FileReader para leer el contenido del archivo
            const reader = new FileReader();
            // Definimos que hacer cuando la lectura del archivo termine exitosamente
            reader.onloadend = () => {
                // Actualizamos el estado con el resultado de la lectura (cadena base64) para mostrar la imagen
                setImagePreview(reader.result as string);
            };
            // Iniciamos la lectura del archivo como una URL de datos (base64)
            reader.readAsDataURL(file);
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
            const reader = new FileReader();
            reader.onloadend = () => {
                // Actualizamos la vista previa con la imagen leida
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Funcion para eliminar la imagen seleccionada y limpiar el estado
    const handleRemoveImage = () => {
        setImagePreview(null);
        // Reseteamos el valor del input file para permitir seleccionar la misma imagen nuevamente si el usuario lo desea
        // Esto es necesario porque si el valor onchange no cambia, el evento no se dispara
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
                </div>

                {/* Form Container */}
                <div className="bg-white border-1 rounded-lg border-gray-200">
                    {/* Section Title */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">Descripción del Producto</h2>
                    </div>

                    {/* Form */}
                    <form className="p-6">
                        {/* Row 1: Product Name and Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="productName" className="block text-base font-medium text-gray-700 mb-2">
                                    Codigo de Barras
                                </label>
                                <input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    placeholder="Ingrese el codigo de barras"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="productName" className="block text-base font-medium text-gray-700 mb-2">
                                    Nombre del Producto
                                </label>
                                <input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    placeholder="Ingrese el nombre del producto"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Row 2: Brand and Color */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="brand" className="block text-base font-medium text-gray-700 mb-2">
                                    Tipo de Producto
                                </label>
                                <div className="relative">
                                    <select
                                        id="brand"
                                        name="brand"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="apple">Simple</option>
                                        <option value="samsung">Kit / Combo</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="color" className="block text-base   font-medium text-gray-700 mb-2">
                                    Estado
                                </label>
                                <div className="relative">
                                    <select
                                        id="color"
                                        name="color"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="apple">Activo</option>
                                        <option value="samsung">Inactivo</option>
                                        <option value="samsung">Descontinuado</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Row 5: Description and Image Upload */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                            {/* Description */}
                            <div className="flex flex-col">
                                <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Ingrese la descripción del producto (opcional)"
                                    rows={6}
                                    className="w-full flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="flex flex-col">
                                <label className="block text-base font-medium text-gray-700 mb-2">
                                    Imagen del Producto
                                </label>
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer w-full h-64 flex flex-col items-center justify-center relative"
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
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </Menu>
    );
}