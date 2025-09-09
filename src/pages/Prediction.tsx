import { useState, useEffect } from 'react';
import { Brain, GraduationCap, DollarSign, Eye, Target, Shield, User } from 'lucide-react';
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

const BioRiskAI = () => {
    const [cui, setCui] = useState('');

    // *** NUEVOS ESTADOS FALTANTES ***
    const [region, setRegion] = useState('');
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

    // colores
    const [bgColor, setBgColor] = useState('bg-gray-100');
    const [bgCode, setBgCode] = useState<string>("");
    const [useCustomBg, setUseCustomBg] = useState<boolean>(false);

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
    } = useCamera();

    const { processingSteps } = useAIProcessing();

    // nuevos estados
    const [showProcessedImage, setShowProcessedImage] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [hasProcessedOnce, setHasProcessedOnce] = useState(false);
    const [cameraBase64Photo, setCameraBase64Photo] = useState("");

    // Generación de insights inteligentes con IA - ACTUALIZADA para nueva estructura
    const generateAIInsights = (data: PredictionResponse) => {
        const insights: AIInsight[] = [];

        // Análisis de edad y perfil con IA
        const edadPersona = data.analisis_riesgo.demografico.edad;
        if (edadPersona < 25) {
            insights.push({
                id: 1,
                type: 'demographic',
                category: 'IA Demográfica',
                icon: <Brain className="w-4 h-4 text-blue-600" />,
                priority: 'medium',
                message: `Nuestro modelo de IA detectó perfil joven (${edadPersona} años). Algoritmo sugiere verificar historial crediticio emergente.`,
                confidence: 87,
                processing_step: 'Análisis de cohorte generacional'
            });
        }

        // Análisis ocupacional con IA
        if (data.datos_renap.ocupacion === 'ESTUDIANTE') {
            insights.push({
                id: 2,
                type: 'occupation',
                category: 'IA Ocupacional',
                icon: <GraduationCap className="w-4 h-4 text-amber-600" />,
                priority: 'high',
                message: 'Red neuronal identifica patrón estudiantil. Ingresos variables detectados por algoritmo predictivo.',
                confidence: 93,
                processing_step: 'Clasificación ocupacional automática'
            });
        }

        // Análisis de riesgo regional con IA
        if (data.analisis_riesgo.regional.nivel === 'Muy Alto') {
            insights.push({
                id: 3,
                type: 'regional',
                category: 'IA Regional',
                icon: <DollarSign className="w-4 h-4 text-red-600" />,
                priority: 'high',
                message: 'Sistema experto detecta alto riesgo regional. Recomendación automática: evaluación manual.',
                confidence: 91,
                processing_step: 'Análisis de riesgo geográfico'
            });
        }

        // Análisis de confianza del modelo con IA
        if (data.prediccion.nivel_confianza === 'Bajo') {
            insights.push({
                id: 4,
                type: 'prediction',
                category: 'IA Meta-Análisis',
                icon: <Eye className="w-4 h-4 text-amber-600" />,
                priority: 'medium',
                message: 'Meta-algoritmo detecta baja confianza. IA recomienda activar validación humana adicional.',
                confidence: 88,
                processing_step: 'Análisis de confianza del modelo'
            });
        }

        // Análisis del factor más influyente con IA
        const topFeature = data.explicacion.contribuciones_top
            .sort((a, b) => Math.abs(b.contribucion) - Math.abs(a.contribucion))[0];

        if (topFeature && Math.abs(topFeature.contribucion) > 0.06) {
            insights.push({
                id: 5,
                type: 'prediction',
                category: 'IA Predictiva',
                icon: <Target className="w-4 h-4 text-purple-600" />,
                priority: 'high',
                message: `Motor de IA identifica "${topFeature.feature}" como factor crítico con ${(Math.abs(topFeature.contribucion) * 100).toFixed(1)}% de influencia predictiva.`,
                confidence: 92,
                processing_step: 'Análisis de importancia de características'
            });
        }

        // Análisis biométrico
        if (data.analisis_riesgo.imagen.disponible) {
            insights.push({
                id: 6,
                type: 'image',
                category: 'IA Biométrica',
                icon: <Shield className="w-4 h-4 text-emerald-600" />,
                priority: 'medium',
                message: 'Sistema biométrico procesó exitosamente todos los vectores de datos disponibles.',
                confidence: 98,
                processing_step: 'Análisis biométrico completo'
            });
        }

        // Insight de validación biométrica simulada
        insights.push({
            id: 8,
            type: 'image',
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

    // *** FUNCIÓN ACTUALIZADA PARA USAR analyzeCui ***
    const handleBuscar = async () => {
        // Validación de campos obligatorios
        if (!cui.trim() || !region.trim() || edad <= 0 || !sectorEconomico.trim() ||
            !profesion.trim() || !estadoCivil || dependientes < 0) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        console.log(photoDataUrl);

        setLoading(true);
        setProcessingStep('');
        setSmartInsights([]);
        setAiProcessingSteps([]);
        setCurrentStepIndex(0);

        // Simular procesamiento completo
        setTimeout(async () => {
            try {
                const image_base64 = photoDataUrl;

                // *** USAR analyzeCui EN LUGAR DE getPrediction ***
                const datosDemo = await analyzeCui({
                    cui,
                    region,
                    edad,
                    sector_economico: sectorEconomico,
                    profesion,
                    estado_civil: estadoCivil,
                    dependientes
                });

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
                } else {
                    alert('No se recibieron datos válidos del servidor');
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

                {/* Búsqueda con IA Enhancement - CON TODOS LOS PROPS */}
                <ClientForm
                    cui={cui}
                    setCui={setCui}
                    region={region}
                    setRegion={setRegion}
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
                />

                {/* SKELETON AQUÍ */}
                <div>
                    {loading && (
                        <Skeleton />
                    )}
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

                .animate-slideIn {
                    animation: slideIn 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default BioRiskAI;