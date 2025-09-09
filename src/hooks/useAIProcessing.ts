import { useState } from "react";


export const useAIProcessing = () => {

    const [loading, setLoading] = useState(false);
    const [processingStep, setProcessingStep] = useState('');
    const [aiProcessingSteps, setAiProcessingSteps] = useState<string[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);


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


    // const handleBuscar = async () => {
    //     if (!cui.trim()) return;
    //     console.log(photoDataUrl);

    //     setLoading(true);
    //     setProcessingStep('');
    //     setSmartInsights([]);
    //     setAiProcessingSteps([]);
    //     setCurrentStepIndex(0);

    //     // Simular procesamiento completo
    //     setTimeout(async () => {
    //         const image_base64 = photoDataUrl;
    //         const datosDemo = await getPrediction({ dpi: cui });

    //         if (image_base64) {
    //             const foto = await getMediapipePoints(image_base64 || "");
    //             setCameraBase64Photo(foto.processed_image_base64 || "");
    //         }

    //         // console.log("Foto procesada:", foto.processed_image_base64);  

    //         setResultados(datosDemo);
    //         const insights = generateAIInsights(datosDemo);

    //         // Mostrar insights progresivamente con efecto de IA
    //         insights.forEach((insight, index) => {
    //             setTimeout(() => {
    //                 setSmartInsights(prev => [...prev, insight]);
    //             }, (index + 1) * 600);
    //         });

    //         setLoading(false);
    //         setProcessingStep('');
    //     }, 7000);
    // };
    return {
        loading, 
        processingStep, 
        aiProcessingSteps, 
        currentStepIndex,
        processingSteps, 
        setLoading, 
        setProcessingStep, 
        setAiProcessingSteps, setCurrentStepIndex
    }
}
