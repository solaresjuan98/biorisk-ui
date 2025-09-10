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
