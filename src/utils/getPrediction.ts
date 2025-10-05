import api from "@/api/axios";
import type { PredictionResponse } from "@/interfaces";

interface PredictionBody {
    dpi: string;
    // photo?: string;

}

interface AnalyzeCuiBody {
    cui: string;
    // region: string;
    departamento: string;
    municipio: string;
    edad: number;
    sector_economico: string;
    profesion: string;
    estado_civil: string;
    dependientes: number;
    foto: string;
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
    departamento,
    municipio,
    edad,
    sector_economico,
    profesion,
    estado_civil,
    dependientes,
    foto,
}: AnalyzeCuiBody) => {
    try {
        console.log(foto);
        
        const { data } = await api.post<PredictionResponse>(
            "analyze_cui?explain=true",
            {
                cui,
                departamento,
                municipio,
                region: '', // Mantener para compatibilidad hacia atrás
                edad,
                sector_economico,
                profesion,
                estado_civil,
                dependientes,
                foto
            },
            { headers: { "Content-Type": "application/json" } }
        );
        return data;

    } catch (error) {
        console.error("Error analyzing CUI:", error);
        return {

        } as PredictionResponse;
    }
}