import { useState, useEffect, useRef } from 'react';
import { Brain, CheckCircle, XCircle, Camera, Clock, TrendingUp, AlertCircle, Zap, Eye, BarChart3, Users, GraduationCap, Briefcase, MapPin, DollarSign, Shield, User, Calendar, Cpu, X, Sparkles, Bot, Target, Network, Activity } from 'lucide-react';

// Interfaces para los datos completos
interface DataRenap {
    CUI: string;
    PRIMER_NOMBRE: string;
    SEGUNDO_NOMBRE: string;
    PRIMER_APELLIDO: string;
    SEGUNDO_APELLIDO: string;
    FECHA_NACIMIENTO: string;
    GENERO: string;
    ESTADO_CIVIL: string;
    NACIONALIDAD: string;
    PAIS_NACIMIENTO: string;
    DEPTO_NACIMIENTO: string;
    MUNI_NACIMIENTO: string;
    VECINDAD: string;
    FECHA_VENCIMIENTO: string;
    OCUPACION: string;
    FOTO: string;
}

interface DemographicScores {
    estabilidad_economica: number;
    riesgo_ocupacional: number;
    carga_familiar: number;
    madurez_edad: number;
    nivel_educativo: number;
    historial_crediticio: number;
    ubicacion_geografica: number;
    score_demografico_total: number;
}

interface FeatureContributions {
    edad: number;
    ingresos: number;
    ocupacion: number;
    historial_crediticio: number;
    ubicacion: number;
    [key: string]: number;
}

interface ModelMetadata {
    model_type: string;
    threshold: number;
    features_count: number;
    features_head: string[];
    loaded_from: string;
}

interface DatosAnalisis {
    data_renap: DataRenap;
    prediction: string;
    probability_mora: number;
    confidence_level: string;
    risk_category: string;
    demographic_scores: DemographicScores;
    feature_contributions: FeatureContributions;
    model_metadata: ModelMetadata;
    processing_timestamp: string;
    success: boolean;
    message: string;
}

interface ResultadosResponse {
    cui_recibido: string;
    resultados: DatosAnalisis;
}

interface AIInsight {
    id: number;
    type: string;
    message: string;
    confidence: number;
    category: string;
    icon: React.ReactNode;
    priority: 'high' | 'medium' | 'low';
    processing_step?: string;
}

const BioRiskAI = () => {
    const [cui, setCui] = useState('');
    const [resultados, setResultados] = useState<ResultadosResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [processingStep, setProcessingStep] = useState('');
    const [smartInsights, setSmartInsights] = useState<AIInsight[]>([]);
    const [aiProcessingSteps, setAiProcessingSteps] = useState<string[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [bgColor, setBgColor] = useState('bg-gray-100');

    const [bgCode, setBgCode] = useState<string>("");
    const [useCustomBg, setUseCustomBg] = useState<boolean>(false);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const openCamera = async () => {

        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                // Fallback (móviles): usa la cámara del dispositivo vía input capture
                fileInputRef.current?.click();
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setIsCameraOpen(true);
        } catch (error) {
            console.error(error);
            fileInputRef.current?.click();
        }

    }

    const closeCamera = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        const w = video.videoWidth || 720;
        const h = video.videoHeight || 960;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setPhotoDataUrl(dataUrl);
        closeCamera();
    };

    const onFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoDataUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    // Limpieza por si el componente se desmonta con la cámara abierta
    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    // Steps de procesamiento de IA
    const processingSteps = [
        'Conectando con base de datos RENAP...',
        'Validando documentos con IA de reconocimiento...',
        'Analizando patrones demográficos...',
        'Ejecutando modelos de machine learning...',
        'Calculando probabilidades de riesgo...',
        'Generando insights personalizados...',
        'Aplicando algoritmos avanzados...',
        'Finalizando análisis predictivo...'
    ];

    // Generación de insights inteligentes con IA
    const generateAIInsights = (data: DatosAnalisis) => {
        const insights: AIInsight[] = [];

        // Análisis de edad y perfil con IA
        const edad = calcularEdad(data.data_renap.FECHA_NACIMIENTO);
        if (edad < 25) {
            insights.push({
                id: 1,
                type: 'info',
                category: 'IA Demográfica',
                icon: <Brain className="w-4 h-4 text-blue-600" />,
                priority: 'medium',
                message: `Nuestro modelo de IA detectó perfil joven (${edad} años). Algoritmo sugiere verificar historial crediticio emergente.`,
                confidence: 87,
                processing_step: 'Análisis de cohorte generacional'
            });
        }

        // Análisis ocupacional con IA
        if (data.data_renap.OCUPACION === 'ESTUDIANTE') {
            insights.push({
                id: 2,
                type: 'warning',
                category: 'IA Ocupacional',
                icon: <GraduationCap className="w-4 h-4 text-amber-600" />,
                priority: 'high',
                message: 'Red neuronal identifica patrón estudiantil. Ingresos variables detectados por algoritmo predictivo.',
                confidence: 93,
                processing_step: 'Clasificación ocupacional automática'
            });
        }

        // Análisis de estabilidad económica con IA
        if (data.demographic_scores.estabilidad_economica < 0.3) {
            insights.push({
                id: 3,
                type: 'alert',
                category: 'IA Económica',
                icon: <DollarSign className="w-4 h-4 text-red-600" />,
                priority: 'high',
                message: 'Sistema experto detecta vulnerabilidad económica. Recomendación automática: evaluación manual.',
                confidence: 91,
                processing_step: 'Análisis de estabilidad financiera'
            });
        }

        // Análisis de riesgo ocupacional con IA
        if (data.demographic_scores.riesgo_ocupacional > 0.7) {
            insights.push({
                id: 4,
                type: 'alert',
                category: 'IA de Riesgo',
                icon: <AlertCircle className="w-4 h-4 text-red-600" />,
                priority: 'high',
                message: 'Algoritmo de riesgo sectorial identifica alta volatilidad laboral en este segmento.',
                confidence: 95,
                processing_step: 'Evaluación de riesgo sectorial'
            });
        }

        // Análisis de confianza del modelo con IA
        if (data.confidence_level === 'Bajo') {
            insights.push({
                id: 5,
                type: 'warning',
                category: 'IA Meta-Análisis',
                icon: <Eye className="w-4 h-4 text-amber-600" />,
                priority: 'medium',
                message: 'Meta-algoritmo detecta baja confianza. IA recomienda activar validación humana adicional.',
                confidence: 88,
                processing_step: 'Análisis de confianza del modelo'
            });
        }

        // Análisis del factor más influyente con IA
        const topFeature = Object.entries(data.feature_contributions)
            .sort(([, a], [, b]) => b - a)[0];

        if (topFeature && topFeature[1] > 0.06) {
            insights.push({
                id: 6,
                type: 'insight',
                category: 'IA Predictiva',
                icon: <Target className="w-4 h-4 text-purple-600" />,
                priority: 'high',
                message: `Motor de IA identifica "${topFeature[0]}" como factor crítico con ${(topFeature[1] * 100).toFixed(1)}% de influencia predictiva.`,
                confidence: 92,
                processing_step: 'Análisis de importancia de características'
            });
        }

        // Análisis biométrico
        insights.push({
            id: 7,
            type: 'success',
            category: 'IA Biométrica',
            icon: <Shield className="w-4 h-4 text-emerald-600" />,
            priority: 'medium',
            message: 'Sistema biométrico procesó exitosamente todos los vectores de datos disponibles.',
            confidence: 98,
            processing_step: 'Análisis biométrico completo'
        });

        // Insight de validación biométrica simulada
        insights.push({
            id: 8,
            type: 'info',
            category: 'IA Biométrica',
            icon: <User className="w-4 h-4 text-blue-600" />,
            priority: 'low',
            message: 'Algoritmo de reconocimiento facial validó coherencia fotográfica con parámetros estándar.',
            confidence: 85,
            processing_step: 'Validación biométrica'
        });

        return insights.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    };

    const calcularEdad = (fechaNacimiento: string): number => {
        const [dia, mes, año] = fechaNacimiento.split('/').map(Number);
        const nacimiento = new Date(año, mes - 1, dia);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mesActual = hoy.getMonth();
        const diaActual = hoy.getDate();

        if (mesActual < (mes - 1) || (mesActual === (mes - 1) && diaActual < dia)) {
            edad--;
        }

        return edad;
    };

    // Efecto para simular pasos de procesamiento
    useEffect(() => {
        if (loading && currentStepIndex < processingSteps.length) {
            const timer = setTimeout(() => {
                setProcessingStep(processingSteps[currentStepIndex]);
                setAiProcessingSteps(prev => [...prev, processingSteps[currentStepIndex]]);
                setCurrentStepIndex(prev => prev + 1);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [loading, currentStepIndex]);

    const handleBuscar = async () => {
        if (!cui.trim()) return;

        setLoading(true);
        setProcessingStep('');
        setSmartInsights([]);
        setAiProcessingSteps([]);
        setCurrentStepIndex(0);

        // Simular procesamiento completo
        setTimeout(() => {
            const datosDemo: ResultadosResponse = {
                "cui_recibido": cui,
                "resultados": {
                    "data_renap": {
                        "CUI": cui,
                        "PRIMER_NOMBRE": "JUAN",
                        "SEGUNDO_NOMBRE": "ANTONIO",
                        "PRIMER_APELLIDO": "SOLARES",
                        "SEGUNDO_APELLIDO": "SAMAYOA",
                        "FECHA_NACIMIENTO": "16/12/1998",
                        "GENERO": "M",
                        "ESTADO_CIVIL": "S",
                        "NACIONALIDAD": "GUATEMALA",
                        "PAIS_NACIMIENTO": "GUATEMALA",
                        "DEPTO_NACIMIENTO": "GUATEMALA",
                        "MUNI_NACIMIENTO": "GUATEMALA",
                        "VECINDAD": "GUATEMALA,VILLA NUEVA",
                        "FECHA_VENCIMIENTO": "21/05/2027",
                        "OCUPACION": "ESTUDIANTE",
                        "FOTO": "https://renap-dpi.s3.amazonaws.com/2996110000101_20250709.png"
                    },
                    "prediction": "NO_MORA",
                    "probability_mora": 0.5891,
                    "confidence_level": "Medio",
                    "risk_category": "Medio",
                    "demographic_scores": {
                        "estabilidad_economica": 0.168,
                        "riesgo_ocupacional": 0.571,
                        "carga_familiar": 0.667,
                        "madurez_edad": 0.3,
                        "nivel_educativo": 0.5,
                        "historial_crediticio": 0.5,
                        "ubicacion_geografica": 0.5,
                        "score_demografico_total": 0.458
                    },
                    "feature_contributions": {
                        "edad": 0.045,
                        "ingresos": 0.076,
                        "ocupacion": 0.069,
                        "historial_crediticio": 0.07,
                        "ubicacion": 0.04
                    },
                    "model_metadata": {
                        "model_type": "GradientBoostingClassifier",
                        "threshold": 0.6,
                        "features_count": 33,
                        "features_head": [
                            "Edad_Real",
                            "Es_Masculino",
                            "Es_Soltero",
                            "Es_Casado",
                            "Score_Educacion",
                            "Log_Ingresos",
                            "Vivienda_Propia",
                            "Numero_Dependientes",
                            "Score_Riesgo_Ocupacion",
                            "Riesgo_Regional"
                        ],
                        "loaded_from": "modelo_mora_mejorado_20250813_221934.joblib"
                    },
                    "processing_timestamp": new Date().toISOString(),
                    "success": true,
                    "message": "Análisis de IA completado exitosamente"
                }
            };

            setResultados(datosDemo);
            const insights = generateAIInsights(datosDemo.resultados);

            // Mostrar insights progresivamente con efecto de IA
            insights.forEach((insight, index) => {
                setTimeout(() => {
                    setSmartInsights(prev => [...prev, insight]);
                }, (index + 1) * 600);
            });

            setLoading(false);
            setProcessingStep('');
        }, 7000);
    };

    const data = resultados?.resultados;

    const getDecisionColor = (decision: string) => {
        return decision === "NO_MORA" ? "text-emerald-600" : "text-red-600";
    };

    const getDecisionBg = (decision: string) => {
        return decision === "NO_MORA" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200";
    };

    const getConfidenceColor = (level: string) => {
        switch (level) {
            case 'Alto': return 'text-green-600 bg-green-50';
            case 'Medio': return 'text-yellow-600 bg-yellow-50';
            case 'Bajo': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getInsightBg = (type: string) => {
        switch (type) {
            case 'warning': return "bg-amber-50 border-amber-200 text-amber-800";
            case 'success': return "bg-emerald-50 border-emerald-200 text-emerald-800";
            case 'info': return "bg-blue-50 border-blue-200 text-blue-800";
            case 'insight': return "bg-purple-50 border-purple-200 text-purple-800";
            case 'alert': return "bg-red-50 border-red-200 text-red-800";
            default: return "bg-gray-50 border-gray-200 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23f8fafc" stroke="%23e2e8f0" stroke-width="2"/><text x="150" y="200" text-anchor="middle" fill="%236b7280" font-size="16">Imagen no disponible</text></svg>';
    };

    const formatEstadoCivil = (estado: string) => {
        switch (estado) {
            case 'S': return 'Soltero';
            case 'C': return 'Casado';
            case 'D': return 'Divorciado';
            case 'V': return 'Viudo';
            default: return estado;
        }
    };

    return (
        // min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900
        <div
            className={`${bgColor} min-h-screen transition-colors duration-500`}
            style={useCustomBg ? { background: bgCode } : undefined}
        >

            {/* === Switcher flotante de color === */}
            {/* === Switcher flotante de color === */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 p-3 bg-white/90 shadow-lg rounded-2xl border border-gray-200">

                {/* Presets existentes */}
                <div className="flex gap-2">
                    <button
                        onClick={() => { setBgColor("bg-gray-100"); setUseCustomBg(false); }}
                        className={`w-8 h-8 rounded-full border-2 ${!useCustomBg && bgColor === "bg-gray-100" ? "border-blue-600" : "border-transparent"} bg-gray-100`}
                        title="Gris claro"
                    />
                    <button
                        onClick={() => { setBgColor("bg-gradient-to-r from-blue-50 to-purple-50"); setUseCustomBg(false); }}
                        className={`w-8 h-8 rounded-full border-2 ${!useCustomBg && bgColor.includes("blue-50") ? "border-blue-600" : "border-transparent"} bg-gradient-to-r from-blue-50 to-purple-50`}
                        title="Azul/Púrpura"
                    />
                    <button
                        onClick={() => { setBgColor("bg-gradient-to-r from-emerald-50 to-teal-50"); setUseCustomBg(false); }}
                        className={`w-8 h-8 rounded-full border-2 ${!useCustomBg && bgColor.includes("emerald-50") ? "border-blue-600" : "border-transparent"} bg-gradient-to-r from-emerald-50 to-teal-50`}
                        title="Verde/Teal"
                    />
                </div>

                {/* Custom color / gradient */}
                <div className="flex flex-col gap-2 mt-1">
                    {/* Picker rápido (hex) */}
                    <input
                        type="color"
                        value={/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(bgCode) ? bgCode : "#f3f4f6"}
                        onChange={(e) => { setBgCode(e.target.value); setUseCustomBg(true); }}
                        className="w-full h-8 rounded cursor-pointer"
                        title="Selector de color (hex)"
                    />

                    {/* Campo libre: hex, rgba, nombre o gradient */}
                    <input
                        type="text"
                        value={bgCode}
                        onChange={(e) => setBgCode(e.target.value)}
                        placeholder={`#0ea5e9 | rgba(0,0,0,.5) | linear-gradient(135deg,#1e3a8a,#9333ea)`}
                        className="w-56 px-2 py-1 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setUseCustomBg(true)}
                            className="px-2 py-1 text-xs rounded-lg border bg-gray-50 hover:bg-white"
                            title="Aplicar código"
                        >
                            Aplicar
                        </button>
                        <button
                            type="button"
                            onClick={() => { setUseCustomBg(false); }}
                            className="px-2 py-1 text-xs rounded-lg border bg-gray-50 hover:bg-white"
                            title="Volver a presets"
                        >
                            Usar presets
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header con emphasis en IA */}
                <div className="text-center py-8 relative">
                    {/* agregar /20 para opacidad */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl"></div>
                    <div className="relative">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-600 rounded-2xl">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
                                <Cpu className="w-8 h-8 text-white" />
                            </div>
                            <div className="p-3 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl">
                                <Network className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            BioRisk
                        </h1>
                        <p className="text-xl text-blue-200 mb-2">Análisis Predictivo + Biométrico</p>
                        <div className="flex items-center justify-center gap-4 text-xs text-blue-300">
                            {/* <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>IA Generativa</span>
                            </div> */}
                            {/* <div className="flex items-center gap-2">
                                <Target className="w-3 h-3" />
                                <span>Predicción Automática</span>
                            </div> */}
                            <div className="flex items-center gap-2">
                                <Shield className="w-3 h-3" />
                                <span>Análisis Demógrafico y Biométrico</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Búsqueda con IA Enhancement */}
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8">
                    <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <Bot className="w-5 h-5 text-blue-600" />
                            </div>
                            <input
                                type="text"
                                value={cui}
                                onChange={(e) => setCui(e.target.value)}
                                placeholder="Ingresa el CUI para análisis..."
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900"
                                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                            />
                        </div>

                        {/* === NUEVO: botón para tomar foto (opcional) === */}
                        <button
                            type="button"
                            onClick={openCamera}
                            className="px-4 py-4 bg-white border border-gray-300 hover:border-blue-400 text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow md:min-w-44"
                            title="Tomar foto (opcional)"
                        >
                            <Camera className="w-5 h-5" />
                            Tomar foto
                        </button>

                        {/* Botón original: NO TOCADO */}
                        <button
                            onClick={handleBuscar}
                            disabled={loading || !cui.trim()}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                    </div>

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
                    {/* === NUEVO: Preview de foto capturada (opcional) === */}
                    {photoDataUrl && (
                        <div className="max-w-3xl mx-auto mt-4 flex items-center justify-between gap-4 p-3 border rounded-xl bg-slate-50">
                            <div className="flex items-center gap-3">
                                <img
                                    src={photoDataUrl}
                                    alt="Selfie capturada"
                                    className="w-16 h-16 rounded-lg object-cover border"
                                />
                                <div className="text-sm text-gray-700">
                                    <p className="font-semibold">Selfie lista para enviar</p>
                                    <p className="text-gray-500">Se adjuntará junto al CUI (opcional)</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPhotoDataUrl(null)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-white"
                                title="Quitar foto"
                            >
                                <X className="w-4 h-4" />
                                Quitar
                            </button>
                        </div>
                    )}

                    {/* === NUEVO: Panel de cámara inline === */}
                    {isCameraOpen && (
                        <div className="max-w-3xl mx-auto mt-4 p-4 border rounded-2xl bg-black/90 text-white">
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

                    {/* Canvas oculto para snapshot */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Fallback móvil: abre cámara nativa (no permite elegir de galería si el SO respeta 'capture') */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={onFileCapture}
                    />
                </div>

                {/* SKELETON AQUÍ */}
                <div>

                    {loading && (
                        <div className="space-y-6 animate-pulse">
                            {/* Header Skeleton */}
                            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
                                    <div className="h-8 w-2/3 bg-white/30 rounded mb-3"></div>
                                    <div className="h-4 w-1/3 bg-white/30 rounded mb-1"></div>
                                    <div className="h-4 w-1/4 bg-white/30 rounded"></div>
                                </div>
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    {/* Foto skeleton */}
                                    <div className="lg:col-span-1">
                                        <div className="w-full h-80 bg-gray-200 rounded-xl"></div>
                                        <div className="grid grid-cols-3 gap-2 mt-4">
                                            <div className="h-14 bg-gray-200 rounded"></div>
                                            <div className="h-14 bg-gray-200 rounded"></div>
                                            <div className="h-14 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>

                                    {/* Panel principal skeleton */}
                                    <div className="lg:col-span-3 space-y-4">
                                        <div className="h-24 bg-gray-200 rounded"></div>
                                        <div className="h-36 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Bloques secundarios skeleton */}
                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
                                <div className="h-64 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    )}
                    {data && !loading && (
                        <div className="space-y-6">
                            {/* Panel Principal con Foto */}
                            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                                {/* <Sparkles className="w-8 h-8" /> */}
                                                Análisis Completo de IA
                                            </h2>
                                            <p className="opacity-90 text-lg">CUI: {data.data_renap.CUI}</p>
                                            <p className="opacity-75 text-sm flex items-center gap-2 mt-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(data.processing_timestamp).toLocaleString('es-GT')}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <Bot className="w-3 h-3" />
                                                    Powered by AI
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Brain className="w-12 h-12 opacity-80" />
                                            <Cpu className="w-10 h-10 opacity-60" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/95">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                        {/* Foto y contexto */}
                                        <div className="lg:col-span-1">
                                            <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-gray-200">
                                                <img
                                                    src={data.data_renap.FOTO}
                                                    alt="Foto de perfil"
                                                    className="w-full object-cover aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-80" // 👈 responsive fix
                                                    onError={handleImageError}
                                                />
                                                <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <Zap className="w-3 h-3" />
                                                    Con Flash
                                                </div>
                                                {/* <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <Brain className="w-3 h-3" />
                                                IA Verificado
                                            </div> */}
                                            </div>

                                            {/* Contexto de imagen con IA */}
                                            <div className="grid grid-cols-3 gap-2 mt-4">
                                                <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                                                    <Bot className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                                    <p className="text-xs font-medium text-blue-700 mb-1">IA Selfie</p>
                                                    <p className="text-xs text-blue-600 font-semibold">Detectado</p>
                                                </div>
                                                <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
                                                    <Eye className="w-5 h-5 mx-auto mb-1 text-green-600" />
                                                    <p className="text-xs font-medium text-green-700 mb-1">IA Luz</p>
                                                    <p className="text-xs text-green-600 font-semibold">Óptima</p>
                                                </div>
                                                <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-200">
                                                    <Zap className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                                                    <p className="text-xs font-medium text-orange-700 mb-1">IA Flash</p>
                                                    <p className="text-xs text-orange-600 font-semibold">Activo</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Panel principal de resultado */}
                                        <div className="lg:col-span-3">
                                            {/* Decisión Principal */}
                                            <div className={`p-6 rounded-xl border-2 ${getDecisionBg(data.prediction)} mb-6 bg-white`}>
                                                <div className={`flex items-center gap-4 ${getDecisionColor(data.prediction)} mb-4`}>
                                                    {data.prediction === "NO_MORA" ?
                                                        <CheckCircle className="w-8 h-8" /> :
                                                        <XCircle className="w-8 h-8" />
                                                    }
                                                    <span className="text-3xl font-bold">
                                                        {data.prediction === "NO_MORA" ? "NO MORA" : "RIESGO DE MORA"}
                                                    </span>
                                                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold flex items-center gap-1">
                                                        <Bot className="w-3 h-3" />
                                                        IA Decidió
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                                    <div>
                                                        <p className="text-sm opacity-80 mb-1 flex items-center justify-center gap-1">
                                                            <Target className="w-4 h-4" />
                                                            Probabilidad IA
                                                        </p>
                                                        <p className="text-lg font-bold text-blue-600">
                                                            {(data.probability_mora * 100).toFixed(2)}%
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm opacity-80 mb-1 flex items-center justify-center gap-1">
                                                            <Brain className="w-4 h-4" />
                                                            Confianza IA
                                                        </p>
                                                        <div className={`inline-block px-3 py-1 rounded-full font-bold ${getConfidenceColor(data.confidence_level)}`}>
                                                            {data.confidence_level}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm opacity-80 mb-1 flex items-center justify-center gap-1">
                                                            <BarChart3 className="w-4 h-4" />
                                                            Umbral ML
                                                        </p>
                                                        <p className="text-lg font-bold text-gray-700">
                                                            {(data.model_metadata.threshold * 100).toFixed(1)}%
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm opacity-80 mb-1 flex items-center justify-center gap-1">
                                                            <TrendingUp className="w-4 h-4" />
                                                            Score IA
                                                        </p>
                                                        <p className="text-lg font-bold text-purple-600">
                                                            {(data.demographic_scores.score_demografico_total * 100).toFixed(1)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Información Personal */}
                                            <div className="bg-slate-50 rounded-lg p-6">
                                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                    Información Personal
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            Nombre Completo:
                                                        </span>
                                                        <span className="font-medium">
                                                            {data.data_renap.PRIMER_NOMBRE} {data.data_renap.SEGUNDO_NOMBRE}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            Apellidos:
                                                        </span>
                                                        <span className="font-medium">
                                                            {data.data_renap.PRIMER_APELLIDO} {data.data_renap.SEGUNDO_APELLIDO}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            Edad:
                                                        </span>
                                                        <span className="font-medium">
                                                            {calcularEdad(data.data_renap.FECHA_NACIMIENTO)} años
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            Estado Civil:
                                                        </span>
                                                        <span className="font-medium">
                                                            {formatEstadoCivil(data.data_renap.ESTADO_CIVIL)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                                            <Briefcase className="w-3 h-3" />
                                                            Ocupación:
                                                        </span>
                                                        <span className="font-medium">{data.data_renap.OCUPACION}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            Vecindad:
                                                        </span>
                                                        <span className="font-medium">{data.data_renap.VECINDAD}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Insights Inteligentes de IA */}
                                <div className="lg:col-span-2 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                                            <Brain className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Insights de Inteligencia Artificial</h3>
                                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            IA Activa
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {smartInsights.map((insight, index) => (
                                            <div
                                                key={insight.id}
                                                className={`p-5 rounded-xl border transition-all duration-500 ${getInsightBg(insight.type)}`}
                                                style={{
                                                    animationDelay: `${index * 200}ms`,
                                                    animation: 'slideIn 0.5s ease-out forwards'
                                                }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        {insight.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <span className="text-xs bg-white px-2 py-1 rounded-full font-bold border">
                                                                {insight.category}
                                                            </span>
                                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${getPriorityColor(insight.priority)} flex items-center gap-1`}>
                                                                {insight.priority === 'high' ? (
                                                                    <AlertCircle className="w-3 h-3" />
                                                                ) : insight.priority === 'medium' ? (
                                                                    <Clock className="w-3 h-3" />
                                                                ) : (
                                                                    <Eye className="w-3 h-3" />
                                                                )}
                                                                {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Media' : 'Baja'} Prioridad
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-semibold mb-3">{insight.message}</p>

                                                        {insight.processing_step && (
                                                            <p className="text-xs opacity-70 mb-3 flex items-center gap-1">
                                                                <Cpu className="w-3 h-3" />
                                                                Proceso IA: {insight.processing_step}
                                                            </p>
                                                        )}

                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs opacity-80 flex items-center gap-1">
                                                                <Target className="w-3 h-3" />
                                                                Confianza de IA:
                                                            </span>
                                                            <div className="flex-1 bg-white/50 rounded-full h-2">
                                                                <div
                                                                    // className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                                                                    className=" bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                                                    style={{ width: `${insight.confidence}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-bold">{insight.confidence}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {smartInsights.length === 0 && (
                                            <div className="text-center py-8 text-gray-600">
                                                <div className="animate-pulse flex flex-col items-center gap-3">
                                                    <Brain className="w-12 h-12 text-blue-600" />
                                                    <p className="text-lg">Generando insights personalizados con IA...</p>
                                                    <div className="flex items-center gap-2 text-blue-600">
                                                        <Sparkles className="w-4 h-4 animate-spin" />
                                                        <span className="text-sm">Algoritmos procesando datos</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Factores de Influencia con IA */}
                                    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-6">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-purple-600" />
                                            Factores Clave de IA
                                        </h3>
                                        <div className="space-y-3">
                                            {Object.entries(data.feature_contributions)
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 6)
                                                .map(([key, value], index) => (
                                                    <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                                {index + 1}
                                                            </span>
                                                            <span className="text-sm capitalize text-gray-900 font-medium">
                                                                {key.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-bold text-emerald-600">
                                                            {(value * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Información del Modelo de IA */}
                                    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-6">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Cpu className="w-5 h-5 text-blue-600" />
                                            Modelo de IA
                                        </h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between text-gray-900">
                                                <span className="text-gray-600 flex items-center gap-1">
                                                    <Bot className="w-3 h-3" />
                                                    Algoritmo:
                                                </span>
                                                <span className="font-medium">GBClassifier</span>
                                            </div>
                                            <div className="flex justify-between text-gray-900">
                                                <span className="text-gray-600 flex items-center gap-1">
                                                    <BarChart3 className="w-3 h-3" />
                                                    Umbral IA:
                                                </span>
                                                <span className="font-medium">{(data.model_metadata.threshold * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="flex justify-between text-gray-900">
                                                <span className="text-gray-600 flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Variables:
                                                </span>
                                                <span className="font-medium">{data.model_metadata.features_count}</span>
                                            </div>
                                            <div className="pt-3 border-t border-gray-200">
                                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                                    <Brain className="w-3 h-3" />
                                                    Variables de IA: Edad, Estado Civil, Educación, Ingresos, Vivienda
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estado del Sistema de IA */}
                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Zap className="w-6 h-6 text-emerald-600" />
                                            <h3 className="font-bold text-emerald-900">Estado del Sistema IA</h3>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                <span className="text-emerald-800 flex items-center gap-1">
                                                    <Bot className="w-3 h-3" />
                                                    Datos RENAP validados por IA
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                <span className="text-emerald-800 flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Análisis demográfico completado
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                <span className="text-emerald-800 flex items-center gap-1">
                                                    <Target className="w-3 h-3" />
                                                    Predicción IA generada
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                <span className="text-emerald-800 flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" />
                                                    Análisis biométrico activo
                                                </span>
                                            </div>
                                            <p className="text-emerald-700 font-semibold mt-4 p-3 bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-2">
                                                <Bot className="w-4 h-4" />
                                                {data.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Análisis Detallados */}
                            <div className="grid md:grid-cols-1 gap-6">
                                {/* Puntuaciones Demográficas con IA */}
                                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                            <Users className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Perfil Demográfico</h3>
                                        {/* <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-200 flex items-center gap-1">
                                        <Bot className="w-4 h-4" />
                                        Machine Learning
                                    </div> */}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {Object.entries(data.demographic_scores)
                                            .filter(([key]) => key !== 'score_demografico_total')
                                            .map(([key, value]) => {
                                                const icons = {
                                                    'estabilidad_economica': <DollarSign className="w-5 h-5 text-green-600" />,
                                                    'riesgo_ocupacional': <Briefcase className="w-5 h-5 text-blue-600" />,
                                                    'carga_familiar': <Users className="w-5 h-5 text-purple-600" />,
                                                    'madurez_edad': <Calendar className="w-5 h-5 text-pink-600" />,
                                                    'nivel_educativo': <GraduationCap className="w-5 h-5 text-indigo-600" />,
                                                    'historial_crediticio': <BarChart3 className="w-5 h-5 text-orange-600" />,
                                                    'ubicacion_geografica': <MapPin className="w-5 h-5 text-red-600" />
                                                };

                                                const labels = {
                                                    'estabilidad_economica': 'Estabilidad Económica',
                                                    'riesgo_ocupacional': 'Riesgo Ocupacional',
                                                    'carga_familiar': 'Carga Familiar',
                                                    'madurez_edad': 'Madurez por Edad',
                                                    'nivel_educativo': 'Nivel Educativo',
                                                    'historial_crediticio': 'Historial Crediticio',
                                                    'ubicacion_geografica': 'Ubicación Geográfica'
                                                };

                                                return (
                                                    <div key={key} className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            {icons[key as keyof typeof icons]}
                                                            <span className="font-semibold text-gray-900">
                                                                {labels[key as keyof typeof labels]}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                                                                <div
                                                                    // className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 relative overflow-hidden"
                                                                    className="bg-blue-500 h-4 rounded-full transition-all duration-1000 relative overflow-hidden"
                                                                    style={{ width: `${value * 100}%` }}
                                                                >
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                                                </div>
                                                            </div>
                                                            <span className="text-lg font-bold text-gray-900 w-16">
                                                                {(value * 100).toFixed(0)}%
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                                                            <Brain className="w-3 h-3" />
                                                            Calculado por algoritmo de IA
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer con branding de IA */}
                    {data && !loading && (
                        <div className="text-center py-6">
                            <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-lg px-6 py-3 rounded-full shadow-lg border border-white/30 text-gray-900">
                                <Brain className="w-5 h-5 text-blue-600" />
                                <span className="text-sm">Procesado por Sistema de IA: {new Date(data.processing_timestamp).toLocaleString('es-GT')}</span>
                                <Sparkles className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-blue-200 text-sm mt-3 flex items-center justify-center gap-2">
                                <Zap className="w-4 h-4" />
                                Powered by Advanced AI • Machine Learning • Análisis Biométrico
                            </p>
                        </div>
                    )}
                </div>

            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default BioRiskAI;