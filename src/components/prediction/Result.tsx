import type { AIInsight, AnalisisRiesgo, DatosRenap, Explicacion, Prediccion } from '@/interfaces';
import { AlertCircle, BarChart3, Bot, Brain, Briefcase, Calendar, CheckCircle, Clock, Cpu, DollarSign, Eye,  MapPin, Sparkles, Target, TrendingUp, User, Users, XCircle, Zap } from 'lucide-react';
import React from 'react';

// Props del componente
interface ResultProps {
    // Props de PredictionResponse
    cui: string;
    modelo: string;
    version: string;
    threshold: number;
    datos_renap: DatosRenap;
    analisis_riesgo: AnalisisRiesgo;
    prediccion: Prediccion;
    explicacion: Explicacion;

    // Estados para manejo de imagen
    showProcessedImage: boolean;
    cameraBase64Photo: string | null;
    isProcessingImage: boolean;
    hasProcessedOnce: boolean;

    // Funciones para manejo de imagen
    handleImageProcess: () => void;
    handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    handleImageModal?: () => void;

    // Datos adicionales
    smartInsights: AIInsight[];

    // Funciones utilitarias
    calcularEdad: (fechaNacimiento: string) => number;
    formatEstadoCivil: (estadoCivil: string) => string;
    getDecisionBg: (prediction: string) => string;
    getDecisionColor: (prediction: string) => string;
    getConfidenceColor: (confidence: string) => string;
    getInsightBg: (type: string) => string;
    getPriorityColor: (priority: 'high' | 'medium' | 'low') => string;
}

export const Result: React.FC<ResultProps> = ({
    // Props de PredictionResponse
    cui,
    modelo,
    version,
    threshold,
    datos_renap,
    analisis_riesgo,
    prediccion,
    explicacion,

    // Props adicionales
    showProcessedImage,
    cameraBase64Photo,
    isProcessingImage,
    hasProcessedOnce,
    handleImageProcess,
    handleImageError,
    handleImageModal,
    smartInsights,
    // calcularEdad,
    formatEstadoCivil,
    getDecisionBg,
    getDecisionColor,
    getConfidenceColor,
    getInsightBg,
    getPriorityColor,
}) => {
    return (
        <div className="space-y-6">
            {/* Panel Principal con Foto */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                Análisis Completo de IA
                            </h2>
                            <p className="opacity-90 text-lg">CUI: {cui}</p>
                            <p className="opacity-75 text-sm flex items-center gap-2 mt-1">
                                <Clock className="w-4 h-4" />
                                {new Date().toLocaleString('es-GT')}
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
                                <div
                                    className="relative cursor-pointer group"
                                    onClick={handleImageProcess}
                                    title={hasProcessedOnce ? "Ya procesado" : "Click para análisis biométrico"}
                                >
                                    {/* Imagen principal - usando foto base64 o placeholder */}
                                    <img
                                        src={showProcessedImage && cameraBase64Photo ? cameraBase64Photo : `data:image/jpeg;base64,${datos_renap.foto_disponible ? 'placeholder' : 'no-photo'}`}
                                        alt="Foto de perfil"
                                        className={`w-full object-cover aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-80 transition-all duration-1000 ${showProcessedImage ? 'filter-none' : ''
                                            } ${hasProcessedOnce ? 'cursor-default' : 'cursor-pointer hover:brightness-110'}`}
                                        onError={handleImageError}
                                    />

                                    {/* Overlay de procesamiento */}
                                    {isProcessingImage && (
                                        <div className="absolute inset-0 bg-blue-600/80 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <div className="relative mb-3">
                                                    <Brain className="w-12 h-12 mx-auto animate-pulse" />
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                                                </div>
                                                <p className="text-sm font-semibold">Analizando con IA...</p>
                                                <p className="text-xs opacity-90">Detectando puntos biométricos</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Indicador de hover para procesamiento */}
                                    {!hasProcessedOnce && (
                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="bg-white/90 px-3 py-2 rounded-lg text-blue-600 font-semibold text-sm flex items-center gap-2">
                                                <Bot className="w-4 h-4" />
                                                Procesar con IA
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* OPCIÓN 2: Botón para modal */}
                                {handleImageModal && (
                                    <div
                                        className="absolute top-3 left-3 bg-white/90 p-2 rounded-full cursor-pointer hover:bg-white transition-all shadow-lg"
                                        onClick={handleImageModal}
                                        title="Ver imagen ampliada"
                                    >
                                        <Eye className="w-4 h-4 text-blue-600" />
                                    </div>
                                )}

                                {/* Badges existentes */}
                                <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    {showProcessedImage ? "IA Procesado" : "Con Flash"}
                                </div>

                                {showProcessedImage && (
                                    <div className="absolute bottom-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-slideIn">
                                        <Brain className="w-3 h-3" />
                                        Biométrico Activo
                                    </div>
                                )}
                            </div>

                            {/* Contexto de imagen con IA */}
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className={`text-center p-2 rounded-lg border transition-all duration-500 ${showProcessedImage ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'
                                    }`}>
                                    {showProcessedImage ? (
                                        <Brain className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                                    ) : (
                                        <Bot className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                    )}
                                    <p className={`text-xs font-medium mb-1 ${showProcessedImage ? 'text-emerald-700' : 'text-blue-700'
                                        }`}>
                                        {showProcessedImage ? 'IA Biométrico' : 'IA Selfie'}
                                    </p>
                                    <p className={`text-xs font-semibold ${showProcessedImage ? 'text-emerald-600' : 'text-blue-600'
                                        }`}>
                                        {showProcessedImage ? 'Procesado' : 'Detectado'}
                                    </p>
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
                            <div className={`p-6 rounded-xl border-2 ${getDecisionBg(prediccion.clasificacion)} mb-6 bg-white`}>
                                <div className={`flex items-center gap-4 ${getDecisionColor(prediccion.clasificacion)} mb-4`}>
                                    {prediccion.clasificacion === "NO_MORA" ?
                                        <CheckCircle className="w-8 h-8" /> :
                                        <XCircle className="w-8 h-8" />
                                    }
                                    <span className="text-3xl font-bold">
                                        {prediccion.clasificacion === "NO_MORA" ? "NO MORA" : "RIESGO DE MORA"}
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
                                            {(prediccion.probabilidad_mora * 100).toFixed(2)}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80 mb-1 flex items-center justify-center gap-1">
                                            <Brain className="w-4 h-4" />
                                            Confianza IA
                                        </p>
                                        <div className={`inline-block px-3 py-1 rounded-full font-bold ${getConfidenceColor(prediccion.nivel_confianza)}`}>
                                            {prediccion.nivel_confianza}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80 mb-1 flex items-center justify-center gap-1">
                                            <BarChart3 className="w-4 h-4" />
                                            Umbral ML
                                        </p>
                                        <p className="text-lg font-bold text-gray-700">
                                            {(threshold * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80 mb-1 flex items-center justify-center gap-1">
                                            <TrendingUp className="w-4 h-4" />
                                            Categoría Riesgo
                                        </p>
                                        <p className="text-lg font-bold text-purple-600">
                                            {analisis_riesgo.regional.nivel}
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
                                            {datos_renap.primer_nombre} {datos_renap.segundo_nombre}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Apellidos:
                                        </span>
                                        <span className="font-medium">
                                            {datos_renap.primer_apellido} {datos_renap.segundo_apellido}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Edad:
                                        </span>
                                        <span className="font-medium">
                                            {analisis_riesgo.demografico.edad} años
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            Estado Civil:
                                        </span>
                                        <span className="font-medium">
                                            {formatEstadoCivil(datos_renap.estado_civil)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                            <Briefcase className="w-3 h-3" />
                                            Ocupación:
                                        </span>
                                        <span className="font-medium">{datos_renap.ocupacion}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-600 block mb-1 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            Vecindad:
                                        </span>
                                        <span className="font-medium">{datos_renap.vecindad}</span>
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
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
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
                            {explicacion.contribuciones_top
                                .sort((a, b) => Math.abs(b.contribucion) - Math.abs(a.contribucion))
                                .slice(0, 6)
                                .map((contrib, index) => (
                                    <div key={contrib.feature} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm capitalize text-gray-900 font-medium">
                                                {contrib.feature.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <span className={`text-sm font-bold ${contrib.contribucion >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {(Math.abs(contrib.contribucion) * 100).toFixed(1)}%
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
                                <span className="font-medium">{modelo}</span>
                            </div>
                            <div className="flex justify-between text-gray-900">
                                <span className="text-gray-600 flex items-center gap-1">
                                    <BarChart3 className="w-3 h-3" />
                                    Umbral IA:
                                </span>
                                <span className="font-medium">{(threshold * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between text-gray-900">
                                <span className="text-gray-600 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Versión:
                                </span>
                                <span className="font-medium">{version}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                    <Brain className="w-3 h-3" />
                                    Variables de IA: Ocupación, Regional, Demográfico, Imagen
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
                                Análisis completado exitosamente
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Análisis Detallados */}
            <div className="grid md:grid-cols-1 gap-6">
                {/* Análisis de Riesgo Detallado */}
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                            <BarChart3 className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Análisis de Riesgo Detallado</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {/* Análisis Ocupacional */}
                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-gray-900">Análisis Ocupacional</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-600">Ocupación RENAP:</span>
                                    <p className="font-medium">{analisis_riesgo.ocupacion.ocupacion_renap}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Categoría:</span>
                                    <p className="font-medium">{analisis_riesgo.ocupacion.categoria}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Nivel de Riesgo:</span>
                                    <p className={`font-bold ${analisis_riesgo.ocupacion.nivel_riesgo === 'Alto' ? 'text-red-600' : 
                                        analisis_riesgo.ocupacion.nivel_riesgo === 'Medio' ? 'text-yellow-600' : 'text-green-600'}`}>
                                        {analisis_riesgo.ocupacion.nivel_riesgo}
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-gray-600">Score:</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${(analisis_riesgo.ocupacion.score_riesgo / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold">{analisis_riesgo.ocupacion.score_riesgo}/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Análisis Regional */}
                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="w-5 h-5 text-red-600" />
                                <span className="font-semibold text-gray-900">Análisis Regional</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-600">Región:</span>
                                    <p className="font-medium">{analisis_riesgo.regional.region}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Nivel:</span>
                                    <p className={`font-bold ${analisis_riesgo.regional.nivel === 'Muy Alto' ? 'text-red-600' : 
                                        analisis_riesgo.regional.nivel === 'Alto' ? 'text-orange-600' : 
                                        analisis_riesgo.regional.nivel === 'Medio' ? 'text-yellow-600' : 'text-green-600'}`}>
                                        {analisis_riesgo.regional.nivel}
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-gray-600">Score:</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-red-500 h-2 rounded-full"
                                                style={{ width: `${analisis_riesgo.regional.score_riesgo * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold">{(analisis_riesgo.regional.score_riesgo * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Análisis Sector Económico */}
                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                                <span className="font-semibold text-gray-900">Sector Económico</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-600">Sector Declarado:</span>
                                    <p className="font-medium">{analisis_riesgo.sector_economico.sector_declarado}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Categoría:</span>
                                    <p className="font-medium">{analisis_riesgo.sector_economico.categoria}</p>
                                </div>
                                <div className="pt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-gray-600">Score:</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-emerald-500 h-2 rounded-full"
                                                style={{ width: `${(analisis_riesgo.sector_economico.score_riesgo / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold">{analisis_riesgo.sector_economico.score_riesgo}/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Análisis Demográfico */}
                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="w-5 h-5 text-purple-600" />
                                <span className="font-semibold text-gray-900">Análisis Demográfico</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-600">Edad:</span>
                                    <p className="font-medium">{analisis_riesgo.demografico.edad} años</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Estado Civil:</span>
                                    <p className="font-medium">{analisis_riesgo.demografico.estado_civil}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Dependientes:</span>
                                    <p className="font-medium">{analisis_riesgo.demografico.dependientes}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Fuente Edad:</span>
                                    <p className="font-medium text-xs">{analisis_riesgo.demografico.fuente_edad}</p>
                                </div>
                            </div>
                        </div>

                        {/* Análisis de Imagen */}
                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="w-5 h-5 text-green-600" />
                                <span className="font-semibold text-gray-900">Análisis de Imagen</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-600">Disponible:</span>
                                    <p className={`font-medium ${analisis_riesgo.imagen.disponible ? 'text-green-600' : 'text-red-600'}`}>
                                        {analisis_riesgo.imagen.disponible ? 'Sí' : 'No'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Fuente:</span>
                                    <p className="font-medium">{analisis_riesgo.imagen.fuente}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Análisis Facial:</span>
                                    <p className={`font-medium ${analisis_riesgo.imagen.analisis_facial === 'realizado' ? 'text-green-600' : 'text-gray-600'}`}>
                                        {analisis_riesgo.imagen.analisis_facial}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Explicación de Motivos */}
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                            <Brain className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Explicación de la Decisión IA</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Motivos para Mora */}
                        <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                            <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                                <XCircle className="w-5 h-5" />
                                Factores de Riesgo Detectados
                            </h4>
                            <div className="space-y-3">
                                {explicacion.motivos_mora.map((motivo, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-100">
                                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-red-800">{motivo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Motivos contra Mora */}
                        <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                            <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Factores Protectores Identificados
                            </h4>
                            <div className="space-y-3">
                                {explicacion.motivos_no_mora.map((motivo, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-100">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-green-800">{motivo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};