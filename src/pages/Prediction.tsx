import { useState } from 'react';
import { Search, Brain, CheckCircle, XCircle, Clock, TrendingUp, AlertCircle, Zap, Eye, BarChart3, Users, GraduationCap, Briefcase, MapPin, DollarSign, Shield, User, Calendar } from 'lucide-react';

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

const CompleteSurfaceIntelligence = () => {
    const [cui, setCui] = useState('');
    const [resultados, setResultados] = useState<ResultadosResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [smartInsights, setSmartInsights] = useState<Array<{ id: number, type: string, message: string, confidence: number, category: string }>>([]);

    // Generación de insights inteligentes completos
    const generateCompleteInsights = (data: DatosAnalisis) => {
        const insights = [];

        // Análisis de edad y perfil
        const edad = calcularEdad(data.data_renap.FECHA_NACIMIENTO);
        if (edad < 25) {
            insights.push({
                id: 1,
                type: 'info',
                category: 'Demográfico',
                message: `Cliente joven (${edad} años). Considerar falta de historial crediticio establecido.`,
                confidence: 85
            });
        }

        // Análisis de ocupación
        if (data.data_renap.OCUPACION === 'ESTUDIANTE') {
            insights.push({
                id: 2,
                type: 'warning',
                category: 'Ocupacional',
                message: 'Cliente estudiante. Ingresos probablemente variables o limitados.',
                confidence: 90
            });
        }

        // Análisis de estabilidad económica
        if (data.demographic_scores.estabilidad_economica < 0.3) {
            insights.push({
                id: 3,
                type: 'alert',
                category: 'Económico',
                message: 'Baja estabilidad económica detectada. Revisar fuentes de ingresos.',
                confidence: 88
            });
        }

        // Análisis de calidad de imagen
        if (data.demographic_scores.estabilidad_economica < 0.2) {
            insights.push({
                id: 4,
                type: 'warning',
                category: 'Técnico',
                message: 'Muy baja estabilidad económica. Considerar rechazo automático.',
                confidence: 92
            });
        }

        // Análisis de riesgo ocupacional
        if (data.demographic_scores.riesgo_ocupacional > 0.7) {
            insights.push({
                id: 5,
                type: 'alert',
                category: 'Riesgo',
                message: 'Alto riesgo ocupacional. Evaluar estabilidad laboral del sector.',
                confidence: 92
            });
        }

        // Análisis de confianza del modelo
        if (data.confidence_level === 'Bajo') {
            insights.push({
                id: 6,
                type: 'warning',
                category: 'Modelo',
                message: 'Confianza del modelo baja. Recomendamos evaluación manual adicional.',
                confidence: 90
            });
        }

        // Análisis del factor más influyente
        const topFeature = Object.entries(data.feature_contributions)
            .sort(([, a], [, b]) => b - a)[0];

        if (topFeature && topFeature[1] > 0.06) {
            insights.push({
                id: 7,
                type: 'insight',
                category: 'Predictivo',
                message: `Factor principal: ${topFeature[0]} influye ${(topFeature[1] * 100).toFixed(1)}% en la decisión.`,
                confidence: 87
            });
        }

        return insights;
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

    const handleBuscar = async () => {
        if (!cui.trim()) return;

        setLoading(true);
        setSmartInsights([]);

        // Simulación de datos completos
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
                    "message": "Predicción realizada exitosamente"
                }
            };

            setResultados(datosDemo);
            const insights = generateCompleteInsights(datosDemo.resultados);

            // Mostrar insights progresivamente
            insights.forEach((insight, index) => {
                setTimeout(() => {
                    setSmartInsights(prev => [...prev, insight]);
                }, (index + 1) * 800);
            });

            setLoading(false);
        }, 1000);
    };

    const data = resultados?.resultados;

    const getDecisionColor = (decision: string) => {
        return decision === "NO_MORA" ? "text-emerald-600" : "text-red-600";
    };

    const getDecisionBg = (decision: string) => {
        return decision === "NO_MORA" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200";
    };

    // const getRiskCategoryColor = (category: string) => {
    //     switch (category) {
    //         case 'Bajo': return 'text-green-600 bg-green-50';
    //         case 'Medio': return 'text-yellow-600 bg-yellow-50';
    //         case 'Alto': return 'text-red-600 bg-red-50';
    //         default: return 'text-gray-600 bg-gray-50';
    //     }
    // };

    const getConfidenceColor = (level: string) => {
        switch (level) {
            case 'Alto': return 'text-green-600 bg-green-50';
            case 'Medio': return 'text-yellow-600 bg-yellow-50';
            case 'Bajo': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertCircle className="w-4 h-4 text-amber-600" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
            case 'info': return <Eye className="w-4 h-4 text-blue-600" />;
            case 'insight': return <Brain className="w-4 h-4 text-purple-600" />;
            case 'alert': return <Shield className="w-4 h-4 text-red-600" />;
            default: return <TrendingUp className="w-4 h-4 text-gray-600" />;
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="text-center py-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Sistema Integral de Predicción
                    </h1>
                    <p className="text-slate-600">Análisis completo con datos RENAP y predicción de mora</p>
                </div>

                {/* Búsqueda */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex gap-4 max-w-2xl mx-auto">
                        <input
                            type="text"
                            value={cui}
                            onChange={(e) => setCui(e.target.value)}
                            placeholder="Ingresa el CUI"
                            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                        />
                        <button
                            onClick={handleBuscar}
                            disabled={loading || !cui.trim()}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Analizando...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Analizar
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {data && (
                    <div className="space-y-6">
                        {/* Panel Principal con Foto */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Análisis Completo</h2>
                                        <p className="opacity-90">CUI: {data.data_renap.CUI}</p>
                                        <p className="opacity-75 text-sm flex items-center gap-2 mt-1">
                                            <Clock className="w-4 h-4" />
                                            {new Date(data.processing_timestamp).toLocaleString('es-GT')}
                                        </p>
                                    </div>
                                    <Brain className="w-12 h-12 opacity-80" />
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid lg:grid-cols-4 gap-6">
                                    {/* Foto y contexto - columna más pequeña */}
                                    <div className="lg:col-span-1">
                                        <div className="relative">
                                            <img
                                                src={data.data_renap.FOTO}
                                                alt="Foto de perfil"
                                                className="w-full max-w-64 h-80 rounded-xl shadow-lg border border-slate-200 object-cover"
                                                onError={handleImageError}
                                            />
                                            {/* Badge de Flash como en la imagen */}
                                            <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <Zap className="w-3 h-3" />
                                                Con Flash
                                            </div>
                                        </div>

                                        {/* Contexto de imagen estilo cards */}
                                        <div className="grid grid-cols-3 gap-2 mt-4">
                                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                                                <div className="text-lg mb-1">📱</div>
                                                <p className="text-xs font-medium text-blue-700 mb-1">Selfie</p>
                                                <p className="text-xs text-blue-600 font-semibold">Sí</p>
                                            </div>
                                            <div className="text-center p-2 bg-green-50 rounded-lg">
                                                <div className="text-lg mb-1">🌙</div>
                                                <p className="text-xs font-medium text-green-700 mb-1">Poca Luz</p>
                                                <p className="text-xs text-green-600 font-semibold">No</p>
                                            </div>
                                            <div className="text-center p-2 bg-orange-50 rounded-lg">
                                                <div className="text-lg mb-1">⚡</div>
                                                <p className="text-xs font-medium text-orange-700 mb-1">Flash</p>
                                                <p className="text-xs text-orange-600 font-semibold">Sí</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Panel principal de resultado - ocupa 3 columnas */}
                                    <div className="lg:col-span-3">
                                        {/* Decisión Principal */}
                                        <div className={`p-6 rounded-xl border-2 ${getDecisionBg(data.prediction)} mb-6`}>
                                            <div className={`flex items-center gap-4 ${getDecisionColor(data.prediction)} mb-4`}>
                                                {data.prediction === "NO_MORA" ?
                                                    <CheckCircle className="w-8 h-8" /> :
                                                    <XCircle className="w-8 h-8" />
                                                }
                                                <span className="text-3xl font-bold">
                                                    {data.prediction === "NO_MORA" ? "NO MORA" : "RIESGO DE MORA"}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                <div>
                                                    <p className="text-sm opacity-80 mb-1">Probabilidad</p>
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {(data.probability_mora * 100).toFixed(2)}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm opacity-80 mb-1">Confianza</p>
                                                    <div className={`inline-block px-3 py-1 rounded-full font-bold ${getConfidenceColor(data.confidence_level)}`}>
                                                        {data.confidence_level}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm opacity-80 mb-1">Umbral</p>
                                                    <p className="text-lg font-bold text-gray-700">
                                                        {(data.model_metadata.threshold * 100).toFixed(1)}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm opacity-80 mb-1">Score</p>
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
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-slate-600 block mb-1">Nombre Completo:</span>
                                                    <span className="font-medium">
                                                        {data.data_renap.PRIMER_NOMBRE} {data.data_renap.SEGUNDO_NOMBRE}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 block mb-1">Apellidos:</span>
                                                    <span className="font-medium">
                                                        {data.data_renap.PRIMER_APELLIDO} {data.data_renap.SEGUNDO_APELLIDO}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 block mb-1">Edad:</span>
                                                    <span className="font-medium">
                                                        {calcularEdad(data.data_renap.FECHA_NACIMIENTO)} años
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 block mb-1">Estado Civil:</span>
                                                    <span className="font-medium">
                                                        {formatEstadoCivil(data.data_renap.ESTADO_CIVIL)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 block mb-1">Ocupación:</span>
                                                    <span className="font-medium">{data.data_renap.OCUPACION}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 block mb-1">Vecindad:</span>
                                                    <span className="font-medium">{data.data_renap.VECINDAD}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Insights Inteligentes */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Brain className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">Insights Inteligentes</h3>
                                </div>

                                <div className="space-y-3">
                                    {smartInsights.map((insight, index) => (
                                        <div
                                            key={insight.id}
                                            className={`p-4 rounded-lg border transition-all duration-500 ${getInsightBg(insight.type)}`}
                                            style={{
                                                animationDelay: `${index * 200}ms`,
                                                animation: 'slideIn 0.5s ease-out forwards'
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                {getInsightIcon(insight.type)}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs bg-white/60 px-2 py-1 rounded-full font-medium">
                                                            {insight.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium">{insight.message}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs opacity-80">Confianza:</span>
                                                        <div className="flex-1 bg-white/50 rounded-full h-1.5">
                                                            <div
                                                                className="bg-current h-1.5 rounded-full transition-all duration-1000"
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
                                        <div className="text-center py-6 text-slate-500">
                                            <div className="animate-pulse">Generando insights personalizados...</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Factores de Influencia */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="font-semibold text-slate-900 mb-4">Factores Clave</h3>
                                    <div className="space-y-2">
                                        {Object.entries(data.feature_contributions)
                                            .sort(([, a], [, b]) => b - a)
                                            .slice(0, 6)
                                            .map(([key, value], index) => (
                                                <div key={key} className="flex items-center justify-between p-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-sm capitalize">
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

                                {/* Información del Modelo */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="font-semibold text-slate-900 mb-4">Información del Modelo</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Tipo:</span>
                                            <span className="font-medium">GBClassifier</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Umbral:</span>
                                            <span className="font-medium">{(data.model_metadata.threshold * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Variables:</span>
                                            <span className="font-medium">{data.model_metadata.features_count}</span>
                                        </div>
                                        <div className="pt-2 border-t border-slate-200">
                                            <p className="text-xs text-slate-500">
                                                Variables principales: Edad, Estado Civil, Educación, Ingresos, Vivienda
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Estado del Sistema */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Zap className="w-5 h-5 text-emerald-600" />
                                        <h3 className="font-semibold text-emerald-900">Estado del Sistema</h3>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            <span className="text-emerald-800">Datos RENAP validados</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            <span className="text-emerald-800">Análisis demográfico completado</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            <span className="text-emerald-800">Predicción generada</span>
                                        </div>
                                        <p className="text-emerald-700 font-medium mt-3">
                                            {data.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Análisis Detallados */}
                        <div className="grid md:grid-cols-1 gap-6">
                            {/* Puntuaciones Demográficas */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Users className="w-6 h-6 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-slate-900">Perfil Demográfico Detallado</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {Object.entries(data.demographic_scores)
                                        .filter(([key]) => key !== 'score_demografico_total')
                                        .map(([key, value]) => {
                                            const icons = {
                                                'estabilidad_economica': <DollarSign className="w-4 h-4 text-green-600" />,
                                                'riesgo_ocupacional': <Briefcase className="w-4 h-4 text-blue-600" />,
                                                'carga_familiar': <Users className="w-4 h-4 text-purple-600" />,
                                                'madurez_edad': <Calendar className="w-4 h-4 text-pink-600" />,
                                                'nivel_educativo': <GraduationCap className="w-4 h-4 text-indigo-600" />,
                                                'historial_crediticio': <BarChart3 className="w-4 h-4 text-orange-600" />,
                                                'ubicacion_geografica': <MapPin className="w-4 h-4 text-red-600" />
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
                                                <div key={key} className="p-4 bg-slate-50 rounded-lg">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        {icons[key as keyof typeof icons]}
                                                        <span className="font-medium text-slate-900">
                                                            {labels[key as keyof typeof labels]}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-slate-200 rounded-full h-3">
                                                            <div
                                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                                                                style={{ width: `${value * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-700 w-12">
                                                            {(value * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                {data && (
                    <div className="text-center py-4">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>Procesado: {new Date(data.processing_timestamp).toLocaleString('es-GT')}</span>
                        </div>
                    </div>
                )}
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
            `}</style>
        </div>
    );
};

export default CompleteSurfaceIntelligence;