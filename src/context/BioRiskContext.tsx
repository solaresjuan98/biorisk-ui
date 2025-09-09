import type { AIInsight, PredictionResponse } from "@/interfaces";
import { createContext, useContext } from "react";


interface BioRiskContextType {
    cui: string;
    setCui: (value: string) => void;
    resultados: PredictionResponse | null;
    setResultados: (value: PredictionResponse | null) => void;
    smartInsights: AIInsight[];
    setSmartInsights: (value: AIInsight[]) => void;
    // ... otros estados globales
}

export const BioRiskContext = createContext<BioRiskContextType | undefined>(undefined);

export const useBioRisk = () => {
    const context = useContext(BioRiskContext);
    if (!context) {
        throw new Error('useBioRisk must be used within BioRiskProvider');
    }
    return context;
};