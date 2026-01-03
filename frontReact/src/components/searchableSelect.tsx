import { useState, useRef, useEffect } from "react";

interface Option {
    id: string | number;
    nombre: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    label: string;
    error?: string;
    onAddClick?: () => void;
    disabled?: boolean;
}

export function SearchableSelect({ 
    options, 
    value, 
    onChange, 
    placeholder = "Seleccionar", 
    label, 
    error,
    onAddClick,
    disabled = false
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter(option => 
        option.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(o => String(o.id) === String(value));

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-base font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <div 
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        className={`w-full px-4 py-2.5 border rounded-lg bg-white flex items-center justify-between shadow-sm transition-all ${
                            disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'cursor-pointer hover:border-blue-400'
                        } ${
                            error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                        } ${
                            isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''
                        }`}
                    >
                        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
                            {selectedOption ? selectedOption.nombre : placeholder}
                        </span>
                        <div className="flex items-center pointer-events-none text-gray-500">
                             {/* Chevron Icon */}
                            <svg className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top">
                            {/* Search Input */}
                            <div className="p-2 border-b border-gray-100 bg-gray-50">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onClick={(e) => e.stopPropagation()} 
                                    />
                                </div>
                            </div>

                            {/* Options List */}
                            <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                {filteredOptions.length === 0 ? (
                                    <li className="px-4 py-3 text-sm text-gray-500 text-center italic">
                                        No se encontraron resultados para "{searchTerm}"
                                    </li>
                                ) : (
                                    filteredOptions.map((option) => (
                                        <li
                                            key={option.id}
                                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors border-b last:border-0 border-gray-50 ${
                                                String(value) === String(option.id) 
                                                    ? 'bg-blue-50 text-blue-700 font-medium' 
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                            onClick={() => {
                                                onChange(String(option.id));
                                                setIsOpen(false);
                                                setSearchTerm("");
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option.nombre}</span>
                                                {String(value) === String(option.id) && (
                                                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                
                {onAddClick && (
                    <button 
                        type="button" 
                        onClick={onAddClick} 
                        className="px-3.5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0 flex items-center justify-center outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Agregar nuevo"
                    >
                         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
