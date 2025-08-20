import api from "@/api/axios";
import type { PredictionResponse } from "@/interfaces";

interface PredictionBody {
    dpi: string;
    // photo?: string;

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