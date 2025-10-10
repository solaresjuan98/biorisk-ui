import React, { useState, useRef, useEffect } from 'react';
import {
    Activity,
    Bot,
    Brain,
    Briefcase,
    Calendar,
    Camera,
    CheckCircle,
    ChevronDown,
    Cpu,
    Heart,
    MapPin,
    User,
    Users,
    X,
    RefreshCw,
    Upload,
    Image as ImageIcon,
    FileImage
} from "lucide-react";
import { SECTORES_ECONOMICOS, getProfesionesBySector } from '@/config';

// Importar catálogos geográficos
import { DEPARTAMENTOS, getMunicipiosByDepartamento } from '@/config';

// Definir las interfaces para los props (SIN isTogglingCamera)
interface ClientFormProps {
    cui: string;
    setCui: (value: string) => void;
    departamento: string;
    setDepartamento: (value: string) => void;
    municipio: string;
    setMunicipio: (value: string) => void;
    edad: number;
    setEdad: (value: number) => void;
    sectorEconomico: string;
    setSectorEconomico: (value: string) => void;
    profesion: string;
    setProfesion: (value: string) => void;
    estadoCivil: string;
    setEstadoCivil: (value: string) => void;
    dependientes: number;
    setDependientes: (value: number) => void;
    photoDataUrl: string | null;
    setPhotoDataUrl: (value: string | null) => void;
    isCameraOpen: boolean;
    loading: boolean;
    aiProcessingSteps: string[];
    processingStep: string;
    currentStepIndex: number;
    processingSteps: string[];
    hasResults: boolean;
    handleBuscar: () => void;
    handleNuevaConsulta: () => void;
    openCamera: () => Promise<void>;
    closeCamera: () => void;
    capturePhoto: () => void;
    onFileCapture: (e: React.ChangeEvent<HTMLInputElement>) => void;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    facingMode: 'user' | 'environment';
    toggleCamera: () => void;
    hasMultipleCameras: boolean;
    processingRef: React.RefObject<HTMLDivElement | null>;
    photoMode: 'camera' | 'upload';
    setPhotoMode: (mode: 'camera' | 'upload') => void;
}

// Componente de Select Personalizado
interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
    icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl flex items-center justify-between cursor-pointer transition-all ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'hover:border-blue-400'
                    } ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
            >
                <div className="flex items-center gap-2 flex-1">
                    {icon && <span className="text-gray-600">{icon}</span>}
                    <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
                    <div className="p-2 border-b border-gray-200">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="overflow-y-auto max-h-48">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-4 py-3 cursor-pointer transition-colors ${option.value === value
                                        ? 'bg-green-50 text-gray-900 font-medium'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                                No se encontraron resultados
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const ClientForm: React.FC<ClientFormProps> = ({
    cui,
    setCui,
    departamento,
    setDepartamento,
    municipio,
    setMunicipio,
    edad,
    setEdad,
    sectorEconomico,
    setSectorEconomico,
    profesion,
    setProfesion,
    estadoCivil,
    setEstadoCivil,
    dependientes,
    setDependientes,
    photoDataUrl,
    setPhotoDataUrl,
    isCameraOpen,
    loading,
    aiProcessingSteps,
    processingStep,
    currentStepIndex,
    processingSteps,
    hasResults,
    handleBuscar,
    handleNuevaConsulta,
    openCamera,
    closeCamera,
    capturePhoto,
    onFileCapture,
    videoRef,
    canvasRef,
    fileInputRef,
    facingMode,
    hasMultipleCameras,
    toggleCamera,
    processingRef,
    photoMode,
    setPhotoMode
}) => {

    const [cuiError, setCuiError] = useState('');
    const [edadError, setEdadError] = useState('');
    
    // Estados para el sistema de pestañas de fotografía
    // const [photoMode, setPhotoMode] = useState<'camera' | 'upload'>('camera');
    const [isDragOver, setIsDragOver] = useState(false);

    const profesionInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    // Opciones para los selects personalizados
    const sectoresOptions = SECTORES_ECONOMICOS.map(sector => ({
        value: sector,
        label: sector
    }));

    const profesionesOptions = getProfesionesBySector(sectorEconomico).map(prof => ({
        value: prof,
        label: prof
    }));

    // Opciones para departamentos
    const departamentosOptions = DEPARTAMENTOS.map(dept => ({
        value: dept,
        label: dept
    }));

    // Opciones para municipios basados en el departamento seleccionado
    const municipiosOptions = getMunicipiosByDepartamento(departamento).map(mun => ({
        value: mun,
        label: mun
    }));

    // Manejar cambios en el select del sector económico
    const handleSectorChange = (value: string) => {
        setSectorEconomico(value);
        setProfesion('');
    };

    // Manejar cambios en el select del departamento
    const handleDepartamentoChange = (value: string) => {
        setDepartamento(value);
        setMunicipio('');
    };

    // Manejar el cambio de modo de fotografía
    const handlePhotoModeChange = (mode: 'camera' | 'upload') => {
        setPhotoMode(mode);
        // Si se cambia a upload y la cámara está abierta, cerrarla
        if (mode === 'upload' && isCameraOpen) {
            closeCamera();
        }
    };

    // Manejar la subida de archivos por drag & drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                processImageFile(file);
            }
        }
    };

    // Procesar archivo de imagen
    const processImageFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setPhotoDataUrl(result);
        };
        reader.readAsDataURL(file);
    };

    // Manejar la selección de archivo desde el input
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                processImageFile(file);
            }
        }
        // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
        e.target.value = '';
    };

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profesionInputRef.current &&
                !profesionInputRef.current.contains(event.target as Node) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                // setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Función para validar si el formulario está completo
    const isFormValid = () => {
        return cui.trim() &&
            departamento.trim() &&
            municipio.trim() &&
            edad > 0 &&
            sectorEconomico.trim() &&
            profesion.trim() &&
            estadoCivil &&
            dependientes >= 0;
    };

    return (
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8">
            {!loading && (
                <div className="space-y-6" ref={processingRef}>
                    {/* Sección 1: Identificación */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-100">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Identificación</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* CUI */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CUI (Código Único de Identificación) *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <Bot className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <input
                                        type="text"
                                        name="cui"
                                        value={cui}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                                            setCui(value);
                                            if (cuiError) setCuiError(''); // Limpiar error al escribir
                                        }}
                                        onBlur={(e) => {
                                            const value = e.target.value.trim();
                                            if (value.length > 0 && value.length !== 13) {
                                                setCuiError('El CUI debe tener exactamente 13 dígitos');
                                            } else {
                                                setCuiError('');
                                            }
                                        }}
                                        placeholder="Ingresa el CUI para análisis..."
                                        className={`w-full pl-12 pr-4 py-3 bg-white border ${cuiError ? 'border-red-500' : 'border-gray-300'
                                            } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
                                        onKeyPress={(e) => e.key === 'Enter' && isFormValid() && !cuiError && handleBuscar()}
                                        autoComplete="off"
                                        data-1p-ignore="true"
                                        data-lpignore="true"
                                        data-form-type="other"
                                        maxLength={13}
                                    />
                                    {cuiError && (
                                        <p className="mt-1 text-sm text-red-600">{cuiError}</p>
                                    )}
                                </div>
                            </div>

                            {/* Departamento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Departamento *
                                </label>
                                <CustomSelect
                                    value={departamento}
                                    onChange={handleDepartamentoChange}
                                    options={departamentosOptions}
                                    placeholder="Selecciona un departamento"
                                    icon={<MapPin className="w-4 h-4" />}
                                />
                            </div>

                            {/* Municipio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Municipio *
                                </label>
                                <CustomSelect
                                    value={municipio}
                                    onChange={setMunicipio}
                                    options={municipiosOptions}
                                    placeholder={departamento ? "Selecciona un municipio" : "Selecciona primero un departamento"}
                                    disabled={!departamento}
                                    icon={<MapPin className="w-4 h-4" />}
                                />
                            </div>

                            {/* Edad */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Edad *
                                </label>
                                <input
                                    type="number"
                                    name="edad"
                                    value={edad || ''}
                                    onChange={(e) => setEdad(parseInt(e.target.value) || 0)}
                                    placeholder="Edad en años"
                                    min="18"
                                    max="100"
                                    onBlur={
                                        (e) => {
                                            const value = parseInt(e.target.value);
                                            if (value < 18 || value > 100) {
                                                setEdadError('La edad debe estar entre 18 y 100 años');
                                                setEdad(18);
                                            } else {
                                                setEdadError('');
                                            }
                                        }
                                    }
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                            </div>
                            {
                                edadError && (
                                    <p className="mt-1 text-sm text-red-600 lg:col-span-2">{edadError}</p>
                                )
                            }
                        </div>
                    </div>

                    {/* Sección 2: Información Laboral y Personal */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Información Laboral y Personal</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Sector Económico - SELECT con diseño mejorado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sector Económico *
                                </label>
                                <CustomSelect
                                    value={sectorEconomico}
                                    onChange={handleSectorChange}
                                    options={sectoresOptions}
                                    placeholder="Selecciona un sector"
                                />
                            </div>

                            {/* Profesión - SELECT con diseño mejorado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profesión *
                                </label>
                                <CustomSelect
                                    value={profesion}
                                    onChange={setProfesion}
                                    options={profesionesOptions}
                                    placeholder={sectorEconomico ? "Selecciona una profesión" : "Selecciona primero un sector"}
                                    disabled={!sectorEconomico}
                                />
                            </div>

                            {/* Estado Civil - SELECT con diseño mejorado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Heart className="w-4 h-4 inline mr-1" />
                                    Estado Civil *
                                </label>
                                <div className="relative">
                                    <select
                                        name="estado_civil"
                                        value={estadoCivil}
                                        onChange={(e) => setEstadoCivil(e.target.value)}
                                        className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Selecciona estado civil</option>
                                        <option value="Soltero">Soltero/a</option>
                                        <option value="Casado">Casado/a</option>
                                        <option value="Divorciado">Divorciado/a</option>
                                        <option value="Viudo">Viudo/a</option>
                                        <option value="Union Libre">Unión Libre</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Personas Dependientes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Personas que dependen del cliente *
                                </label>
                                <input
                                    type="number"
                                    name="dependientes"
                                    value={dependientes ?? ''}
                                    onChange={(e) => setDependientes(parseInt(e.target.value) || 0)}
                                    placeholder="Número de dependientes"
                                    min="0"
                                    max="20"
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección 3: Fotografía (opcional) - MEJORADA */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 border border-purple-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Camera className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Fotografía</h3>
                        </div>

                        {/* Pestañas para seleccionar modo de fotografía */}
                        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                            <button
                                type="button"
                                onClick={() => handlePhotoModeChange('camera')}
                                className={`cursor-pointer flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                                    photoMode === 'camera'
                                        ? 'bg-white text-purple-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <Camera className="w-4 h-4" />
                                Tomar Foto
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePhotoModeChange('upload')}
                                className={`cursor-pointer flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                                    photoMode === 'upload'
                                        ? 'bg-white text-purple-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <Upload className="w-4 h-4" />
                                Subir Archivo
                            </button>
                        </div>

                        {/* Contenido según el modo seleccionado */}
                        {photoMode === 'camera' && (
                            <div>
                                {/* Botón para tomar foto */}
                                <div className="mb-4">
                                    <button
                                        type="button"
                                        onClick={openCamera}
                                        className="cursor-pointer w-full px-4 py-3 bg-white border border-gray-300 hover:border-purple-400 text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow"
                                    >
                                        <Camera className="w-5 h-5" />
                                        Abrir Cámara
                                    </button>
                                </div>

                                {/* Panel de cámara */}
                                {isCameraOpen && (
                                    <div className="p-4 border rounded-2xl bg-black/90 text-white">
                                        <div className="relative rounded-xl overflow-hidden">
                                            <video
                                                ref={videoRef}
                                                className="w-full max-h-[60vh] rounded-xl bg-black"
                                                autoPlay
                                                playsInline
                                                muted
                                            />

                                            {/* Botón para cambiar cámara */}
                                            {hasMultipleCameras && (
                                                <button
                                                    type="button"
                                                    onClick={toggleCamera}
                                                    className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full transition-all duration-200"
                                                    title={facingMode === 'user' ? 'Cambiar a cámara trasera' : 'Cambiar a cámara frontal'}
                                                >
                                                    <RefreshCw className="w-5 h-5 text-white" />
                                                </button>
                                            )}

                                            {/* Indicador de cámara activa */}
                                            <div className="absolute top-4 left-4 px-3 py-1 bg-green-600/80 backdrop-blur-md rounded-full">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                                    <span className="text-xs font-medium">
                                                        {facingMode === 'user' ? 'Cámara frontal' : 'Cámara trasera'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-3 mt-4">
                                            <button
                                                type="button"
                                                onClick={capturePhoto}
                                                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition-colors"
                                            >
                                                Capturar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={closeCamera}
                                                className="px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {photoMode === 'upload' && (
                            <div>
                                {/* Zona de drop para archivos */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => uploadInputRef.current?.click()}
                                    className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                                        isDragOver
                                            ? 'border-purple-500 bg-purple-50 scale-105'
                                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                                    }`}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className={`p-4 rounded-full transition-colors duration-300 ${
                                            isDragOver ? 'bg-purple-200' : 'bg-gray-100'
                                        }`}>
                                            <FileImage className={`w-8 h-8 transition-colors duration-300 ${
                                                isDragOver ? 'text-purple-600' : 'text-gray-500'
                                            }`} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {isDragOver ? '¡Suelta la imagen aquí!' : 'Subir imagen'}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Arrastra y suelta una imagen o{' '}
                                                <span className="text-purple-600 font-medium">haz clic para seleccionar</span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Formatos soportados: JPG, PNG, GIF, WebP
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Input de archivo oculto */}
                                <input
                                    ref={uploadInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                        )}

                        {/* Preview de foto (común para ambos modos) */}
                        {photoDataUrl && (
                            <div className="mt-4 flex items-center justify-between gap-4 p-4 border rounded-xl bg-white shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={photoDataUrl}
                                            alt="Foto capturada"
                                            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                                        />
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        <p className="font-semibold flex items-center gap-1">
                                            <ImageIcon className="w-4 h-4 text-green-600" />
                                            Imagen lista para enviar
                                        </p>
                                        <p className="text-gray-500">
                                            {photoMode === 'camera' ? 'Foto capturada con la cámara' : 'Archivo subido correctamente'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPhotoDataUrl(null)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors duration-200"
                                >
                                    <X className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Información de campos obligatorios */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-yellow-800">
                            <Bot className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Todos los campos marcados con (*) son obligatorios para el análisis de IA
                            </span>
                        </div>
                    </div>

                    {/* Botones de Análisis y Nueva Consulta */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                        <button
                            onClick={handleBuscar}
                            disabled={loading || !isFormValid()}
                            className="w-full sm:w-auto cursor-pointer px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="relative">
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        <div className="absolute inset-0 animate-pulse">
                                            <Cpu className="w-5 h-5 text-white/50" />
                                        </div>
                                    </div>
                                    Procesando IA...
                                </>
                            ) : (
                                <>
                                    <Brain className="w-5 h-5" />
                                    Analizar con IA
                                </>
                            )}
                        </button>

                        {/* Botón Nueva Consulta - Solo se muestra si hay resultados */}
                        {hasResults && !loading && (
                            <button
                                onClick={handleNuevaConsulta}
                                className="w-full sm:w-auto cursor-pointer px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <User className="w-5 h-5" />
                                Nueva Consulta
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Estado de procesamiento con IA */}
            {loading && (
                <div className="mt-6 space-y-4">
                    <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 border border-white/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                            </div>
                            <h3 className="text-gray-900 font-semibold">Sistema de IA Procesando</h3>
                        </div>

                        <div className="space-y-3">
                            {aiProcessingSteps.map((step, index) => (
                                <div key={index} className="flex items-center gap-3 text-gray-700">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">{step}</span>
                                </div>
                            ))}

                            {processingStep && (
                                <div className="flex items-center gap-3 text-gray-900">
                                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                    <span className="text-sm font-medium">{processingStep}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 bg-gray-200 rounded-lg h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-lg transition-all duration-300"
                                style={{ width: `${(currentStepIndex / processingSteps.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Canvas oculto para snapshot */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Fallback móvil: abre cámara nativa */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={onFileCapture}
            />
        </div>
    );
};