import api from "@/api/axios";
import type { FaceValidationResponse } from "@/interfaces";



export const getFaceValidation = async (imagen: string) => {

    try {

        const { data } = await api.post<FaceValidationResponse>(
            "analyze_face",
            { imagen },
            { headers: { "Content-Type": "application/json" } });

        return data;

    } catch (error) {
        console.error("Error fetching face validation:", error);
        return {
            tiene_cara: false,
            num_caras: 0,
            coordenadas: [],
            error: "Error fetching face validation"
        }
    }

}