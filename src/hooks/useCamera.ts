import { useEffect, useRef, useState } from 'react'

export const useCamera = () => {

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);


    const openCamera = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                // Fallback (móviles): usa la cámara del dispositivo vía input capture
                fileInputRef.current?.click();
                return;
            }

            // Primero mostrar la UI para que el videoRef esté disponible
            setIsCameraOpen(true);
            
            // Pequeño delay para asegurar que el DOM se actualice
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } },
                audio: false,
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                
                // Agregar event listener para cuando el video esté listo
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                };
            }
        } catch (error) {
            console.error(error);
            setIsCameraOpen(false); // Cerrar si hay error
            fileInputRef.current?.click();
        }
    }

    const closeCamera = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        const w = video.videoWidth || 720;
        const h = video.videoHeight || 960;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setPhotoDataUrl(dataUrl);
        closeCamera();
    };

    const onFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoDataUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    // Limpieza por si el componente se desmonta con la cámara abierta
    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    return {
        isCameraOpen, photoDataUrl, setPhotoDataUrl,
        videoRef, canvasRef, fileInputRef,
        openCamera, closeCamera, capturePhoto, onFileCapture
    }
}