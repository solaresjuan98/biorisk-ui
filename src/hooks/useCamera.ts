import { useEffect, useRef, useState } from 'react'

export const useCamera = () => {

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [hasMultipleCameras, setHasMultipleCameras] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const isTogglingRef = useRef(false); // Usar ref para evitar re-renders

    // Detectar si hay múltiples cámaras disponibles
    const checkMultipleCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setHasMultipleCameras(videoDevices.length > 1);
        } catch (error) {
            console.error('Error al detectar cámaras:', error);
            setHasMultipleCameras(false);
        }
    };

    const openCamera = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                fileInputRef.current?.click();
                return;
            }

            // Primero verificamos las cámaras disponibles
            await checkMultipleCameras();
            
            // Esperamos un momento para asegurar que el estado se actualizó
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Luego abrimos la cámara
            setIsCameraOpen(true);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Usar constraints más específicos para móviles
            const constraints = {
                video: {
                    facingMode: { ideal: facingMode },
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 }
                },
                audio: false,
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().catch(err => {
                        console.error('Error al reproducir video:', err);
                    });
                };
            }
        } catch (error) {
            console.error(error);
            setIsCameraOpen(false);
            fileInputRef.current?.click();
        }
    }

    const closeCamera = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setIsCameraOpen(false);
        isTogglingRef.current = false; // Reset toggle state
    };

    // Función mejorada para cambiar entre cámaras
    const toggleCamera = async () => {
        if (!hasMultipleCameras || isTogglingRef.current) {
            return;
        }

        isTogglingRef.current = true;
        const newMode = facingMode === 'user' ? 'environment' : 'user';
        
        try {
            // Detener stream actual ANTES de solicitar el nuevo
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => {
                    track.stop();
                });
                streamRef.current = null;
            }

            // Limpiar video element
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            // Esperar tiempo suficiente para liberar la cámara
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Intentar con constraints progresivamente más simples
            const constraintStrategies = [
                // Estrategia 1: ideal (más compatible)
                {
                    video: {
                        facingMode: { ideal: newMode },
                        width: { ideal: 1280, max: 1920 },
                        height: { ideal: 720, max: 1080 }
                    },
                    audio: false,
                },
                // Estrategia 2: exact (más específico)
                {
                    video: {
                        facingMode: { exact: newMode },
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false,
                },
                // Estrategia 3: básico (fallback)
                {
                    video: {
                        facingMode: newMode
                    },
                    audio: false,
                }
            ];

            let streamObtained = false;

            for (let i = 0; i < constraintStrategies.length && !streamObtained; i++) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia(constraintStrategies[i]);
                    streamRef.current = stream;
                    
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current?.play().catch(err => {
                                console.error('Error al reproducir video:', err);
                            });
                        };
                    }
                    
                    // Solo actualizar el estado si el stream se obtuvo exitosamente
                    setFacingMode(newMode);
                    streamObtained = true;
                    
                } catch (strategyError) {
                    console.log(`Estrategia ${i + 1} falló:`, strategyError);
                    if (i === constraintStrategies.length - 1) {
                        throw strategyError; // Si todas fallan, lanzar error
                    }
                }
            }

        } catch (error) {
            console.error('Error al cambiar cámara:', error);
            
            // Fallback: reabrir con la cámara original
            try {
                const fallbackConstraints = {
                    video: {
                        facingMode: { ideal: facingMode },
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false,
                };
                
                const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
                streamRef.current = stream;
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().catch(err => {
                            console.error('Error al reproducir video:', err);
                        });
                    };
                }
            } catch (fallbackError) {
                console.error('Error en fallback:', fallbackError);
                closeCamera();
            }
        } finally {
            isTogglingRef.current = false;
        }
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

    useEffect(() => {
        // Verificar cámaras disponibles al montar el componente
        checkMultipleCameras();
        
        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    return {
        isCameraOpen, 
        photoDataUrl, 
        setPhotoDataUrl, 
        facingMode, 
        hasMultipleCameras,
        videoRef, 
        canvasRef, 
        fileInputRef,
        openCamera, 
        closeCamera, 
        capturePhoto, 
        onFileCapture, 
        toggleCamera
    }
}