import apiMediapipe from "@/api/mediapipe";



export const getMediapipePoints = async (image_base64: string) => {

    try {
        
        const { data } = await apiMediapipe.post(
            "analyze_face",
            { image_base64 },
            { headers: { "Content-Type": "application/json" }
        });
        
        return data;

    } catch (error) {
        console.error("Error fetching mediapipe points:", error);
        return {} as any;
        
    }

}