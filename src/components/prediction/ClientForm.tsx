import React, { useState, useRef, useEffect } from 'react';
import {
    Activity,
    Bot,
    Brain,
    Briefcase,
    Calendar,
    Camera,
    CheckCircle,
    Cpu,
    Heart,
    MapPin,
    User,
    Users,
    X,
    ChevronDown
} from "lucide-react";

// Definir las interfaces para los props
interface ClientFormProps {
    // Estados del formulario
    cui: string;
    setCui: (value: string) => void;

    // Nuevos estados para el formulario extendido
    region: string;
    setRegion: (value: string) => void;
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

    // Estados de procesamiento IA
    aiProcessingSteps: string[];
    processingStep: string;
    currentStepIndex: number;
    processingSteps: string[];

    // Estado para controlar si se han procesado resultados
    hasResults: boolean;

    // Funciones de manejo
    handleBuscar: () => void;
    handleNuevaConsulta: () => void;
    openCamera: () => Promise<void>;
    closeCamera: () => void;
    capturePhoto: () => void;
    onFileCapture: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // Refs
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ClientForm: React.FC<ClientFormProps> = ({
    // Estados del formulario
    cui,
    setCui,
    region,
    setRegion,
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

    // Estados de procesamiento IA
    aiProcessingSteps,
    processingStep,
    currentStepIndex,
    processingSteps,
    hasResults,

    // Funciones de manejo
    handleBuscar,
    handleNuevaConsulta,
    openCamera,
    closeCamera,
    capturePhoto,
    onFileCapture,

    // Refs
    videoRef,
    canvasRef,
    fileInputRef,
}) => {

    // Estados para el autocompletado del sector económico
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const sectorInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Lista de sectores económicos sugeridos
    const sectorSuggestions = [
        "Agricultura",
        "Ganadería", 
        "Pesca",
        "Comercio",
        "Ventas",
        "Servicios",
        "Salud",
        "Educación",
        "Industria",
        "Manufactura",
        "Construcción",
        "Transporte"
    ];

    // Función para filtrar sugerencias
    const filterSuggestions = (value: string) => {
        if (!value.trim()) {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const filtered = sectorSuggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(value.toLowerCase())
        );
        
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
    };

    // Manejar cambios en el input del sector económico
    const handleSectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSectorEconomico(value);
        filterSuggestions(value);
    };

    // Manejar selección de sugerencia
    const handleSuggestionSelect = (suggestion: string) => {
        setSectorEconomico(suggestion);
        setShowSuggestions(false);
        sectorInputRef.current?.focus();
    };

    // Manejar teclas en el input del sector
    const handleSectorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sectorInputRef.current &&
                !sectorInputRef.current.contains(event.target as Node) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
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
            region.trim() &&
            edad > 0 &&
            sectorEconomico.trim() &&
            profesion.trim() &&
            estadoCivil &&
            dependientes >= 0;
    };

    return (
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8">
            {!loading && (
                <div className="space-y-6">
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
                                        onChange={(e) => setCui(e.target.value)}
                                        placeholder="Ingresa el CUI para análisis..."
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        onKeyPress={(e) => e.key === 'Enter' && isFormValid() && handleBuscar()}
                                        autoComplete="off"
                                        data-1p-ignore="true"
                                        data-lpignore="true"
                                        data-form-type="other"
                                    />
                                </div>
                            </div>

                            {/* Región */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Región *
                                </label>
                                <input
                                    type="text"
                                    name="region"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    placeholder="Ej: Guatemala, Quetzaltenango..."
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                            </div>

                            {/* Edad */}
                            <div>
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
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Información Laboral y Personal */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Información Laboral y Personal</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Sector Económico con Autocompletado */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sector Económico *
                                </label>
                                <div className="relative">
                                    <input
                                        ref={sectorInputRef}
                                        type="text"
                                        name="sector_economico"
                                        value={sectorEconomico}
                                        onChange={handleSectorChange}
                                        onKeyDown={handleSectorKeyDown}
                                        onFocus={() => filterSuggestions(sectorEconomico)}
                                        placeholder="Ej: Comercio, Agricultura, Servicios..."
                                        className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                                        autoComplete="off"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {/* Dropdown de sugerencias */}
                                {showSuggestions && (
                                    <div 
                                        ref={suggestionsRef}
                                        className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                                    >
                                        {filteredSuggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSuggestionSelect(suggestion)}
                                                className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 text-gray-900"
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                        {filteredSuggestions.length === 0 && (
                                            <div className="px-4 py-3 text-gray-500 text-sm">
                                                No se encontraron sugerencias
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Profesión */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profesión *
                                </label>
                                <input
                                    type="text"
                                    name="profesion"
                                    value={profesion}
                                    onChange={(e) => setProfesion(e.target.value)}
                                    placeholder="Ej: Comerciante, Agricultor, Contador..."
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                                />
                            </div>

                            {/* Estado Civil */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Heart className="w-4 h-4 inline mr-1" />
                                    Estado Civil *
                                </label>
                                <select
                                    name="estado_civil"
                                    value={estadoCivil}
                                    onChange={(e) => setEstadoCivil(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                                >
                                    <option value="">Selecciona estado civil</option>
                                    <option value="Soltero">Soltero/a</option>
                                    <option value="Casado">Casado/a</option>
                                    <option value="Divorciado">Divorciado/a</option>
                                    <option value="Viudo">Viudo/a</option>
                                    <option value="Union Libre">Unión Libre</option>
                                </select>
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

                    {/* Sección 3: Fotografía (opcional) */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 border border-purple-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Camera className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Fotografía (Opcional)</h3>
                        </div>

                        {/* Botón para tomar foto */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <button
                                type="button"
                                onClick={openCamera}
                                className="flex-1 px-4 py-3 bg-white border border-gray-300 hover:border-purple-400 text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow"
                            >
                                <Camera className="w-5 h-5" />
                                Tomar foto
                            </button>
                        </div>

                        {/* Preview de foto */}
                        {photoDataUrl && (
                            <div className="flex items-center justify-between gap-4 p-3 border rounded-xl bg-white">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={photoDataUrl}
                                        alt="Foto capturada"
                                        className="w-16 h-16 rounded-lg object-cover border"
                                    />
                                    <div className="text-sm text-gray-700">
                                        <p className="font-semibold">Foto lista para enviar</p>
                                        <p className="text-gray-500">Se adjuntará junto con los datos</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPhotoDataUrl(null)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                                >
                                    <X className="w-4 h-4" />
                                    Quitar
                                </button>
                            </div>
                        )}

                        {/* Panel de cámara */}
                        {isCameraOpen && (
                            <div className="mt-4 p-4 border rounded-2xl bg-black/90 text-white">
                                <div className="relative rounded-xl overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        className="w-full max-h-[60vh] rounded-xl bg-black"
                                        autoPlay
                                        playsInline
                                        muted
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold"
                                    >
                                        Capturar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeCamera}
                                        className="px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                </div>
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