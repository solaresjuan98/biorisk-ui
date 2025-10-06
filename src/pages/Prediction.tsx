import { useState, useEffect, useRef } from 'react';
import { Brain, GraduationCap, DollarSign, Eye, Target, Shield, User, ChevronUp, AlertTriangle } from 'lucide-react';
import type { AIInsight, PredictionResponse } from '@/interfaces';
import { getMediapipePoints } from '@/utils/getMediapipe';
import { Skeleton } from '@/components';
import { Result } from '@/components/prediction/Result';
import { ClientForm } from '@/components/prediction/ClientForm';
import { Header } from '@/components/prediction/Header';
import { Footer } from '@/components/prediction/Footer';
import { useCamera } from '@/hooks/useCamera';
import { useAIProcessing } from '@/hooks/useAIProcessing';
import { calcularEdad, formatEstadoCivil, getConfidenceColor, getDecisionBg, getDecisionColor, getInsightBg, getPriorityColor, handleImageError } from '@/utils';
import { analyzeCui } from '@/utils/getPrediction';
import Swal from 'sweetalert2';

const BioRiskAI = () => {
    const [cui, setCui] = useState('');

    const [departamento, setDepartamento] = useState('');
    const [municipio, setMunicipio] = useState('');

    // *** NUEVOS ESTADOS FALTANTES ***
    // const [region, setRegion] = useState('');
    // console.log(region);

    const [edad, setEdad] = useState(0);
    const [sectorEconomico, setSectorEconomico] = useState('');
    const [profesion, setProfesion] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');
    const [dependientes, setDependientes] = useState(0);
    // *** FIN NUEVOS ESTADOS ***

    const [resultados, setResultados] = useState<PredictionResponse | null>(null);

    const [loading, setLoading] = useState(false);
    const [processingStep, setProcessingStep] = useState('');
    const [smartInsights, setSmartInsights] = useState<AIInsight[]>([]);
    const [aiProcessingSteps, setAiProcessingSteps] = useState<string[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // *** NUEVO ESTADO PARA CONTROLAR EL BOTÓN NUEVA CONSULTA ***
    const [hasResults, setHasResults] = useState(false);

    // *** NUEVO ESTADO PARA EL BOTÓN SCROLL TO TOP ***
    const [showScrollTop, setShowScrollTop] = useState(false);

    // colores
    // const [bgColor, setBgColor] = useState('bg-gray-100');
    const bgColor = 'bg-gray-100';
    const bgCode = '';
    const useCustomBg = false;
    // const [bgCode, setBgCode] = useState<string>("");
    // const [useCustomBg, setUseCustomBg] = useState<boolean>(false);

    // *** REFERENCIAS PARA SCROLL AUTOMÁTICO ***
    const processingRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // hook de camara
    const {
        isCameraOpen,
        photoDataUrl,
        videoRef,
        canvasRef,
        openCamera,
        closeCamera,
        capturePhoto,
        setPhotoDataUrl,
        onFileCapture,
        fileInputRef,
        facingMode,
        toggleCamera,
        hasMultipleCameras,
    } = useCamera();

    const { processingSteps } = useAIProcessing();

    // nuevos estados
    const [showProcessedImage, setShowProcessedImage] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [hasProcessedOnce, setHasProcessedOnce] = useState(false);
    const [cameraBase64Photo, setCameraBase64Photo] = useState("");

    // *** EFECTO MEJORADO PARA DETECTAR SCROLL (FUNCIONA MEJOR EN MÓVILES) ***
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            // Reducir el threshold para móviles
            const threshold = window.innerWidth <= 768 ? 200 : 300;
            setShowScrollTop(scrollTop > threshold);
        };

        // Usar passive listener para mejor performance en móviles
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Llamar inmediatamente para establecer estado inicial
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // *** FUNCIÓN MEJORADA PARA SCROLL TO TOP (OPTIMIZADA PARA MÓVILES) ***
    const scrollToTop = () => {
        // Prevenir comportamiento por defecto en móviles
        if (window.innerWidth <= 768) {
            // Para móviles, usar método más directo
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } else {
            // Para desktop, usar smooth scroll
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const scrollToElement = (elementRef: React.RefObject<HTMLDivElement | null>, offset: number = -20) => {
        if (elementRef.current) {
            const element = elementRef.current;

            // Obtener la posición del elemento de manera más precisa
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Calcular posición absoluta del elemento
            const elementPosition = rect.top + scrollTop;

            // Ajustar offset según el tamaño de pantalla
            const isMobile = window.innerWidth <= 768;
            const adjustedOffset = isMobile ? -80 : offset; // Más espacio en móviles

            const finalPosition = Math.max(0, elementPosition + adjustedOffset);

            window.scrollTo({
                top: finalPosition,
                behavior: 'smooth'
            });
        }
    };

    // *** NUEVA FUNCIÓN PARA REINICIAR EL FORMULARIO ***
    const handleNuevaConsulta = () => {
        // Reiniciar estados del formulario
        setCui('');
        // setRegion('');
        setEdad(0);
        setSectorEconomico('');
        setProfesion('');
        setEstadoCivil('');
        setDependientes(0);
        setPhotoDataUrl(null);
        setMunicipio('');
        setDepartamento('');

        // Reiniciar estados de procesamiento
        setAiProcessingSteps([]);
        setProcessingStep('');
        setCurrentStepIndex(0);
        setResultados(null);
        setSmartInsights([]);

        // Reiniciar estados de imagen
        setShowProcessedImage(false);
        setIsProcessingImage(false);
        setHasProcessedOnce(false);
        setCameraBase64Photo("");

        // Ocultar botón nueva consulta
        setHasResults(false);

        // Cerrar cámara si está abierta
        closeCamera();

        // *** SCROLL HACIA ARRIBA AL HACER NUEVA CONSULTA ***
        scrollToTop();
    };

    // Generación de insights inteligentes con IA - ACTUALIZADA para nueva estructura
    // const generateAIInsights = (data: PredictionResponse) => {
    //     const insights: AIInsight[] = [];

    //     // Análisis de edad y perfil con IA
    //     const edadPersona = data.analisis_riesgo.demografico.edad;
    //     if (edadPersona < 25) {
    //         insights.push({
    //             id: 1,
    //             type: 'demographic',
    //             category: 'IA Demográfica',
    //             icon: <Brain className="w-4 h-4 text-blue-600" />,
    //             priority: 'medium',
    //             message: `Nuestro modelo de IA detectó perfil joven (${edadPersona} años). Algoritmo sugiere verificar historial crediticio emergente.`,
    //             confidence: 87,
    //             processing_step: 'Análisis de cohorte generacional'
    //         });
    //     }

    //     // Análisis ocupacional con IA
    //     if (data.datos_renap.ocupacion === 'ESTUDIANTE') {
    //         insights.push({
    //             id: 2,
    //             type: 'occupation',
    //             category: 'IA Ocupacional',
    //             icon: <GraduationCap className="w-4 h-4 text-amber-600" />,
    //             priority: 'high',
    //             message: 'Red neuronal identifica patrón estudiantil. Ingresos variables detectados por algoritmo predictivo.',
    //             confidence: 93,
    //             processing_step: 'Clasificación ocupacional automática'
    //         });
    //     }

    //     // Análisis de riesgo regional con IA
    //     if (data.analisis_riesgo.regional.nivel === 'Muy Alto') {
    //         insights.push({
    //             id: 3,
    //             type: 'regional',
    //             category: 'IA Regional',
    //             icon: <DollarSign className="w-4 h-4 text-red-600" />,
    //             priority: 'high',
    //             message: 'Sistema experto detecta alto riesgo regional. Recomendación automática: evaluación manual.',
    //             confidence: 91,
    //             processing_step: 'Análisis de riesgo geográfico'
    //         });
    //     }

    //     // Análisis de confianza del modelo con IA
    //     if (data.prediccion.nivel_confianza === 'Bajo') {
    //         insights.push({
    //         id: 4,
    //         type: 'prediction',
    //         category: 'Análisis Predicción',
    //         icon: <Eye className="w-4 h-4 text-amber-600" />,
    //         priority: 'medium',
    //         message: 'El sistema detecta baja confianza en la predicción. Se recomienda revisión manual adicional.',
    //         confidence: 88,
    //         processing_step: 'Análisis de confianza del modelo'
    //         });
    //     }

    //     // Análisis del factor más influyente con IA
    //     const topFeature = data.explicacion.contribuciones_top
    //         .sort((a, b) => Math.abs(b.contribucion) - Math.abs(a.contribucion))[0];

    //     if (topFeature && Math.abs(topFeature.contribucion) > 0.06) {
    //         insights.push({
    //             id: 5,
    //             type: 'prediction',
    //             category: 'IA Predictiva',
    //             icon: <Target className="w-4 h-4 text-purple-600" />,
    //             priority: 'high',
    //             message: `Motor de IA identifica "${topFeature.feature}" como factor crítico con ${(Math.abs(topFeature.contribucion) * 100).toFixed(1)}% de influencia predictiva.`,
    //             confidence: 92,
    //             processing_step: 'Análisis de importancia de características'
    //         });
    //     }

    //     // Análisis biométrico
    //     if (data.analisis_riesgo.imagen.disponible) {
    //         insights.push({
    //             id: 6,
    //             type: 'image',
    //             category: 'IA Biométrica',
    //             icon: <Shield className="w-4 h-4 text-emerald-600" />,
    //             priority: 'medium',
    //             message: 'Sistema biométrico procesó exitosamente todos los vectores de datos disponibles.',
    //             confidence: 98,
    //             processing_step: 'Análisis biométrico completo'
    //         });
    //     }

    //     // Insight de validación biométrica simulada
    //     insights.push({
    //         id: 8,
    //         type: 'image',
    //         category: 'IA Biométrica',
    //         icon: <User className="w-4 h-4 text-blue-600" />,
    //         priority: 'low',
    //         message: 'Algoritmo de reconocimiento facial validó coherencia fotográfica con parámetros estándar.',
    //         confidence: 85,
    //         processing_step: 'Validación biométrica'
    //     });

    //     return insights.sort((a, b) => {
    //         const priorityOrder = { high: 3, medium: 2, low: 1 };
    //         return priorityOrder[b.priority] - priorityOrder[a.priority];
    //     });
    // };
    const generateAIInsights = (data: PredictionResponse) => {
    const insights: AIInsight[] = [];

    // Análisis de features faciales con IA
    const facialFeatures = data.analisis_features.filter(f => f.categoria_feature === 'Facial');
    const topFacialFeature = facialFeatures[0]; // Ya viene ordenado por ranking

    if (topFacialFeature && topFacialFeature.importance > 30) {
        insights.push({
            id: 1,
            type: 'image',
            category: 'IA Biométrica',
            icon: <Brain className="w-4 h-4 text-blue-600" />,
            priority: 'high',
            message: `Motor de visión computacional identifica "${topFacialFeature.feature}" como factor crítico con ${topFacialFeature.importance.toFixed(1)}% de importancia global.`,
            confidence: 94,
            processing_step: 'Análisis facial avanzado'
        });
    }

    // Análisis de calidad de imagen
    const imageQualityFeatures = ['brightness', 'contrast', 'sharpness', 'resolution_quality'];
    const qualityIssues = facialFeatures.filter(f => 
        imageQualityFeatures.includes(f.feature) && f.importance > 5
    );

    if (qualityIssues.length > 0) {
        const totalQualityImportance = qualityIssues.reduce((sum, f) => sum + f.importance, 0);
        insights.push({
            id: 2,
            type: 'image',
            category: 'IA de Calidad',
            icon: <Eye className="w-4 h-4 text-purple-600" />,
            priority: 'medium',
            message: `Algoritmo de calidad de imagen detectó ${qualityIssues.length} parámetros relevantes (${totalQualityImportance.toFixed(1)}% impacto combinado).`,
            confidence: 89,
            processing_step: 'Evaluación de calidad fotográfica'
        });
    }

    // Análisis de simetría facial
    const symmetryFeature = facialFeatures.find(f => f.feature === 'face_symmetry');
    if (symmetryFeature && symmetryFeature.importance > 2) {
        insights.push({
            id: 3,
            type: 'image',
            category: 'IA Biométrica',
            icon: <Shield className="w-4 h-4 text-emerald-600" />,
            priority: 'low',
            message: `Red neuronal procesó simetría facial con ${symmetryFeature.importance.toFixed(2)}% de peso en modelo predictivo.`,
            confidence: 91,
            processing_step: 'Análisis de simetría biométrica'
        });
    }

    // Análisis demográfico con IA
    const demographicFeatures = data.analisis_features.filter(f => f.categoria_feature === 'Demográfico');
    const riesgoRegional = demographicFeatures.find(f => f.feature === 'Riesgo_Regional');
    
    if (riesgoRegional && riesgoRegional.analisis_persona > 25) {
        insights.push({
            id: 4,
            type: 'regional',
            category: 'IA Regional',
            icon: <DollarSign className="w-4 h-4 text-red-600" />,
            priority: 'high',
            message: `Sistema experto detecta alto impacto regional (${riesgoRegional.analisis_persona.toFixed(1)}% en perfil individual). Recomendación: evaluación contextual.`,
            confidence: 93,
            processing_step: 'Análisis de riesgo geográfico'
        });
    }

    // Análisis de edad con IA
    const edadFeature = demographicFeatures.find(f => f.feature === 'Edad_Real');
    const edadPersona = data.analisis_riesgo.demografico.edad;
    
    if (edadFeature && edadFeature.analisis_persona > 20) {
        insights.push({
            id: 5,
            type: 'demographic',
            category: 'IA Demográfica',
            icon: <GraduationCap className="w-4 h-4 text-amber-600" />,
            priority: edadPersona < 25 ? 'high' : 'medium',
            message: `Modelo detecta edad (${edadPersona} años) con ${edadFeature.analisis_persona.toFixed(1)}% de influencia en predicción individual.`,
            confidence: 88,
            processing_step: 'Análisis de cohorte generacional'
        });
    }

    // Análisis ocupacional con IA
    if (data.datos_renap.ocupacion === 'ESTUDIANTE') {
        insights.push({
            id: 6,
            type: 'occupation',
            category: 'IA Ocupacional',
            icon: <User className="w-4 h-4 text-blue-600" />,
            priority: 'medium',
            message: 'Clasificador automático identifica patrón estudiantil. Algoritmo ajusta expectativas de estabilidad de ingresos.',
            confidence: 90,
            processing_step: 'Clasificación ocupacional'
        });
    }

    // Análisis del feature más influyente general
    const topFeature = data.analisis_features[0]; // Ya viene ordenado por ranking
    if (topFeature && topFeature.importance > 15) {
        insights.push({
            id: 7,
            type: 'prediction',
            category: 'IA Predictiva',
            icon: <Target className="w-4 h-4 text-indigo-600" />,
            priority: 'high',
            message: `Motor predictivo prioriza "${topFeature.feature}" (ranking #${topFeature.ranking}) con ${topFeature.importance.toFixed(1)}% de importancia global.`,
            confidence: 96,
            processing_step: 'Ranking de características'
        });
    }

    // Análisis de confianza del modelo
    if (data.prediccion.nivel_confianza === 'Bajo') {
        insights.push({
            id: 8,
            type: 'prediction',
            category: 'Análisis Predicción',
            icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
            priority: 'high',
            message: 'El sistema detecta baja confianza en la predicción. Requiere validación manual por analista experimentado.',
            confidence: 85,
            processing_step: 'Evaluación de confianza'
        });
    }

    // Análisis combinado facial vs demográfico
    const totalFacialImportance = facialFeatures.reduce((sum, f) => sum + f.importance, 0);
    const totalDemographicImportance = demographicFeatures.reduce((sum, f) => sum + f.importance, 0);
    
    if (totalFacialImportance > totalDemographicImportance * 3) {
        insights.push({
            id: 9,
            type: 'image',
            category: 'IA Comparativa',
            icon: <Brain className="w-4 h-4 text-violet-600" />,
            priority: 'medium',
            message: `Análisis biométrico domina predicción (${totalFacialImportance.toFixed(1)}% facial vs ${totalDemographicImportance.toFixed(1)}% demográfico).`,
            confidence: 92,
            processing_step: 'Análisis de balance de features'
        });
    }

    return insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
};

    // *** EFECTO ADICIONAL PARA ASEGURAR SCROLL EN MÓVILES ***
    useEffect(() => {
        if (loading && aiProcessingSteps.length === 1) {
            // Cuando aparece el primer paso, hacer scroll nuevamente
            setTimeout(() => {
                scrollToElement(processingRef, -60);
            }, 200);
        }
    }, [aiProcessingSteps.length, loading]);

    // *** EFECTO PARA SCROLL AUTOMÁTICO AL INICIAR PROCESAMIENTO MEJORADO PARA MÓVILES ***
    useEffect(() => {
        if (loading && currentStepIndex === 0) {
            // Delay más largo para móviles para asegurar renderizado completo
            const isMobile = window.innerWidth <= 768;
            const delay = isMobile ? 300 : 100;

            setTimeout(() => {
                scrollToElement(processingRef, -50);
            }, delay);
        }
    }, [currentStepIndex, loading]);

    // *** EFECTO PARA SCROLL AUTOMÁTICO A RESULTADOS ***
    useEffect(() => {
        if (resultados && !loading) {
            // Delay para asegurar que los resultados estén completamente renderizados
            setTimeout(() => {
                scrollToElement(resultsRef, -30);
            }, 500);
        }
    }, [resultados, loading]);

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
    }, [loading, currentStepIndex, processingSteps]);

    const handleBuscar = async () => {

        // Validación de campos obligatorios
        if (!cui.trim() || edad <= 0 || !sectorEconomico.trim() ||
            !profesion.trim() || !estadoCivil || dependientes < 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos obligatorios',
                confirmButtonText: 'Ok',
                customClass: {
                    popup: 'swal2-popup-custom'
                }
            });
            return;
        }

        // console.log(photoDataUrl);
        scrollToTop();
        setLoading(true);
        setProcessingStep('');
        setSmartInsights([]);
        setAiProcessingSteps([]);
        setCurrentStepIndex(0);

        // Simular procesamiento completo
        setTimeout(async () => {
            try {
                const image_base64 = photoDataUrl;


                const datosDemo = await analyzeCui({
                    cui,
                    departamento,
                    municipio,
                    edad,
                    sector_economico: sectorEconomico,
                    profesion,
                    estado_civil: estadoCivil,
                    dependientes,
                    foto: ''//,image_base64 || ''
                });

                console.log('Respuesta completa:', datosDemo);


                if (image_base64) {
                    const foto = await getMediapipePoints(image_base64 || "");
                    setCameraBase64Photo(foto.processed_image_base64 || "");
                }

                if (datosDemo && Object.keys(datosDemo).length > 0) {
                    setResultados(datosDemo);
                    const insights = generateAIInsights(datosDemo);

                    // Mostrar insights progresivamente con efecto de IA
                    insights.forEach((insight, index) => {
                        setTimeout(() => {
                            setSmartInsights(prev => [...prev, insight]);
                        }, (index + 1) * 600);
                    });

                    // *** MOSTRAR EL BOTÓN NUEVA CONSULTA DESPUÉS DE PROCESAR ***
                    setHasResults(true);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de datos',
                        text: 'No se recibieron datos válidos del servidor',
                        confirmButtonText: 'Ok',
                        customClass: {
                            popup: 'swal2-popup-custom'
                        }
                    });
                }

            } catch (error) {
                console.error('Error en el análisis:', error);
                alert('Error al procesar el análisis. Por favor intenta nuevamente.');
            } finally {
                setLoading(false);
                setProcessingStep('');
            }
        }, 7000);
    };

    const data = resultados;

    const handleImageProcess = async () => {
        if (hasProcessedOnce) return;

        setIsProcessingImage(true);
        setHasProcessedOnce(true);

        // Simular procesamiento de IA
        setTimeout(() => {
            setShowProcessedImage(true);
            setIsProcessingImage(false);
        }, 2000);
    };

    return (
        <div
            className={`${bgColor} min-h-screen transition-colors duration-500`}
            style={useCustomBg ? { background: bgCode } : undefined}
        >
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header con emphasis en IA */}
                <Header />

                {/* Búsqueda con IA Enhancement - CON TODOS LOS PROPS INCLUYENDO NUEVA CONSULTA */}
                <ClientForm
                    cui={cui}
                    setCui={setCui}
                    setDepartamento={setDepartamento}
                    setMunicipio={setMunicipio}
                    edad={edad}
                    setEdad={setEdad}
                    sectorEconomico={sectorEconomico}
                    setSectorEconomico={setSectorEconomico}
                    profesion={profesion}
                    setProfesion={setProfesion}
                    estadoCivil={estadoCivil}
                    setEstadoCivil={setEstadoCivil}
                    dependientes={dependientes}
                    setDependientes={setDependientes}
                    photoDataUrl={photoDataUrl}
                    setPhotoDataUrl={setPhotoDataUrl}
                    handleBuscar={handleBuscar}
                    handleNuevaConsulta={handleNuevaConsulta}
                    hasResults={hasResults}
                    loading={loading}
                    aiProcessingSteps={aiProcessingSteps}
                    processingStep={processingStep}
                    currentStepIndex={currentStepIndex}
                    processingSteps={processingSteps}
                    openCamera={openCamera}
                    isCameraOpen={isCameraOpen}
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    capturePhoto={capturePhoto}
                    closeCamera={closeCamera}
                    onFileCapture={onFileCapture}
                    fileInputRef={fileInputRef}
                    facingMode={facingMode}
                    toggleCamera={toggleCamera}
                    hasMultipleCameras={hasMultipleCameras}
                    processingRef={processingRef}
                    departamento={departamento}
                    municipio={municipio}
                />

                {/* SKELETON AQUÍ */}
                <div>
                    {loading && (
                        <Skeleton />
                    )}
                </div>

                {/* *** RESULTADOS CON REFERENCIA PARA SCROLL *** */}
                <div ref={resultsRef}>
                    {data && !loading && (
                        <div>
                            <Result
                                {...data}  // Desestructura todas las propiedades de PredictionResponse
                                cameraBase64Photo={cameraBase64Photo}
                                showProcessedImage={showProcessedImage}
                                isProcessingImage={isProcessingImage}
                                hasProcessedOnce={hasProcessedOnce}
                                handleImageProcess={handleImageProcess}
                                handleImageError={handleImageError}
                                smartInsights={smartInsights}
                                calcularEdad={calcularEdad}
                                formatEstadoCivil={formatEstadoCivil}
                                getDecisionBg={getDecisionBg}
                                getDecisionColor={getDecisionColor}
                                getConfidenceColor={getConfidenceColor}
                                getInsightBg={getInsightBg}
                                getPriorityColor={getPriorityColor}
                            />
                        </div>
                    )}

                    {/* Footer con branding de IA */}
                    {data && !loading && (
                        <Footer />
                    )}
                </div>
            </div>

            {/* *** BOTÓN FLOTANTE SCROLL TO TOP MEJORADO PARA MÓVILES *** */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="scroll-to-top-btn"
                    aria-label="Ir al inicio"
                    type="button"
                >
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            )}

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

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40%, 43% {
                        transform: translateY(-8px);
                    }
                    70% {
                        transform: translateY(-4px);
                    }
                    90% {
                        transform: translateY(-2px);
                    }
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .animate-slideIn {
                    animation: slideIn 0.5s ease-out;
                }

                /* *** ESTILOS MEJORADOS PARA EL BOTÓN SCROLL TO TOP (OPTIMIZADO PARA MÓVILES) *** */
                .scroll-to-top-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999; /* Z-index más alto para asegurar visibilidad */
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    outline: none; /* Eliminar outline para móviles */
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* Transición más rápida para móviles */
                    animation: fadeInUp 0.3s ease-out;
                    backdrop-filter: blur(8px);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    /* Propiedades específicas para mejorar la interacción táctil */
                    -webkit-tap-highlight-color: transparent;
                    touch-action: manipulation;
                    user-select: none;
                    -webkit-user-select: none;
                    -webkit-touch-callout: none;
                }

                .scroll-to-top-btn:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2);
                    background: linear-gradient(135deg, #7289da 0%, #8b5fbf 100%);
                }

                .scroll-to-top-btn:active {
                    transform: translateY(0) scale(0.95);
                    box-shadow: 0 2px 12px rgba(102, 126, 234, 0.3), 0 1px 4px rgba(0, 0, 0, 0.15);
                    transition: all 0.1s ease-out;
                }

                /* *** ESTILOS ESPECÍFICOS PARA MÓVILES *** */
                @media (max-width: 768px) {
                    .scroll-to-top-btn {
                        bottom: 20px;
                        right: 20px;
                        width: 50px;
                        height: 50px;
                        /* Asegurar que sea fácil de tocar en móviles */
                        min-width: 50px;
                        min-height: 50px;
                        /* Mejorar la interacción táctil */
                        touch-action: manipulation;
                    }
                    
                    /* Efecto específico para touch en móviles */
                    .scroll-to-top-btn:active {
                        transform: scale(0.9);
                        background: linear-gradient(135deg, #5a67d8 0%, #7c3aed 100%);
                    }
                }

                @media (max-width: 480px) {
                    .scroll-to-top-btn {
                        bottom: 16px;
                        right: 16px;
                        width: 48px;
                        height: 48px;
                    }
                }

                /* Estilos para tablets */
                @media (min-width: 769px) and (max-width: 1024px) {
                    .scroll-to-top-btn {
                        bottom: 25px;
                        right: 25px;
                        width: 52px;
                        height: 52px;
                    }
                }

                /* Estilos para desktop */
                @media (min-width: 1025px) {
                    .scroll-to-top-btn {
                        bottom: 30px;
                        right: 30px;
                        width: 54px;
                        height: 54px;
                    }
                    
                    .scroll-to-top-btn:hover {
                        transform: translateY(-3px) scale(1.08);
                    }
                }

                /* *** ESTILOS PARA SCROLL SUAVE MEJORADOS PARA MÓVILES *** */
                html {
                    scroll-behavior: smooth;
                    scroll-padding-top: 80px;
                }

                /* Ajustes específicos para móviles */
                @media (max-width: 768px) {
                    html {
                        scroll-padding-top: 100px;
                    }
                    
                    /* Optimizaciones para iOS Safari y otros navegadores móviles */
                    body {
                        -webkit-overflow-scrolling: touch;
                        overflow-x: hidden; /* Prevenir scroll horizontal en móviles */
                    }
                    
                    /* Asegurar que el contenido no interfiera con el botón */
                    .scroll-to-top-btn {
                        pointer-events: auto;
                        isolation: isolate; /* Crear un nuevo contexto de apilamiento */
                    }
                }

                /* Mejorar visibilidad del botón en diferentes temas */
                @media (prefers-color-scheme: dark) {
                    .scroll-to-top-btn {
                        background: linear-gradient(135deg, #4c63d2 0%, #6b46c1 100%);
                        border: 2px solid rgba(255, 255, 255, 0.25);
                        box-shadow: 0 4px 20px rgba(76, 99, 210, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25);
                    }
                    
                    .scroll-to-top-btn:hover {
                        background: linear-gradient(135deg, #5b6bc8 0%, #7c3aed 100%);
                        box-shadow: 0 8px 30px rgba(91, 107, 200, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3);
                    }
                }

                /* Reducir movimiento para usuarios que prefieren menos animación */
                @media (prefers-reduced-motion: reduce) {
                    .scroll-to-top-btn {
                        transition: none;
                        animation: none;
                    }
                    
                    .scroll-to-top-btn:hover {
                        transform: none;
                    }
                    
                    html {
                        scroll-behavior: auto;
                    }
                }

                /* Asegurar que el botón no interfiera con otros elementos flotantes */
                .scroll-to-top-btn {
                    /* Agregar backdrop para evitar clicks accidentales */
                    isolation: isolate;
                }

                /* Fix para algunos navegadores móviles que pueden tener problemas con position fixed */
                @supports (-webkit-touch-callout: none) {
                    .scroll-to-top-btn {
                        position: -webkit-sticky;
                        position: sticky;
                        float: right;
                        clear: both;
                        margin: 20px 20px 0 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default BioRiskAI;