import api from "@/api/axios";
import type { PredictionResponse } from "@/interfaces";

interface PredictionBody {
    dpi: string;
    // photo?: string;

}

interface AnalyzeCuiBody {
    cui: string;
    region: string;
    edad: number;
    sector_economico: string;
    profesion: string;
    estado_civil: string;
    dependientes: number;
}


export const getPrediction = async ({ dpi }: PredictionBody) => {
    try {
        const { data } = await api.post<PredictionResponse>(
            "predict-dpi",
            { dpi },
            { headers: { "Content-Type": "application/json" } });
        return data;

    } catch (error) {
        console.error("Error fetching prediction:", error);
        return {} as PredictionResponse;
    }

}



export const analyzeCui = async ({
    cui,
    region,
    edad,
    sector_economico,
    profesion,
    estado_civil,
    dependientes
}: AnalyzeCuiBody) => {
    try {
        const { data } = await api.post<PredictionResponse>(
            "analyze_cui?explain=true",
            {
                cui,
                region,
                edad,
                sector_economico,
                profesion,
                estado_civil,
                dependientes
            },
            { headers: { "Content-Type": "application/json" } }
        );
        return data;

    } catch (error) {
        console.error("Error analyzing CUI:", error);
        return {} as PredictionResponse;
    }
}