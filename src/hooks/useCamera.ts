import { getFaceValidation } from '@/utils/getFaceValidation';
import { useEffect, useRef, useState } from 'react'

export const useCamera = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [hasMultipleCameras, setHasMultipleCameras] = useState(true);
    const [faceDetected, setFaceDetected] = useState(false);
    const [facePosition, setFacePosition] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [isProcessingFrame, setIsProcessingFrame] = useState(false);
    const [isValidatingWithEndpoint, setIsValidatingWithEndpoint] = useState(false);
    const [validationAttempts, setValidationAttempts] = useState(0);
    const [maxValidationAttempts] = useState(10); // Máximo 10 intentos
    const [captureInterval] = useState(3000); // 3 segundos por defecto
    const [photoFrozen, setPhotoFrozen] = useState(false); // Estado para congelar la foto

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const detectionCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const isTogglingRef = useRef(false);
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const endpointUrl = useRef('http://localhost:8000/api/validate-face'); // URL del endpoint

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

    // Función para capturar frame automáticamente
    const captureFrameForValidation = async () => {
        if (photoFrozen || !videoRef.current || !canvasRef.current || isProcessingFrame) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        try {
            const w = video.videoWidth || 640;
            const h = video.videoHeight || 480;
            canvas.width = w;
            canvas.height = h;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(video, 0, 0, w, h);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

            await validateFaceWithEndpoint(dataUrl);
        } catch (error) {
            console.error('Error al capturar frame:', error);
        }
    };

    // Función para validar rostro con endpoint externo
    const validateFaceWithEndpoint = async (imageDataUrl: string) => {
        if (photoFrozen || isValidatingWithEndpoint || validationAttempts >= maxValidationAttempts) return;

        setIsValidatingWithEndpoint(true);
        setValidationAttempts(prev => prev + 1);

        try {
            // Enviar al endpoint
            const result = await getFaceValidation(imageDataUrl);

            // Procesar respuesta del endpoint
            if (result.tiene_cara && result.num_caras > 0) {
                // Rostro válido detectado
                setFaceDetected(true);
                setPhotoDataUrl(imageDataUrl);
                setPhotoFrozen(true); // Congelar la foto

                // Detener el intervalo de captura
                if (captureIntervalRef.current) {
                    clearInterval(captureIntervalRef.current);
                    captureIntervalRef.current = null;
                }

                // Guardar coordenadas del primer rostro detectado
                if (result.coordenadas && result.coordenadas.length > 0) {
                    const coordenada = result.coordenadas[0];
                    setFacePosition({
                        x: coordenada.x,
                        y: coordenada.y,
                        width: coordenada.ancho || 0,
                        height: coordenada.alto || 0
                    });
                }

                console.log('✅ Rostro válido detectado y guardado');
            } else {
                // Rostro no válido o no detectado
                setFaceDetected(false);
                setFacePosition(null);
                console.log(`❌ Intento ${validationAttempts}/${maxValidationAttempts}: ${result.error || 'Rostro no detectado'}`);

                // Si se alcanzó el máximo de intentos
                if (validationAttempts >= maxValidationAttempts) {
                    console.log('🔄 Máximo de intentos alcanzado. Deteniendo validación automática.');
                    stopAutomaticCapture();
                }
            }
        } catch (error) {
            console.error('Error al validar rostro con endpoint:', error);
            setFaceDetected(false);
            setFacePosition(null);

            // En caso de error, continuar intentando (a menos que sea un error crítico)
            if (validationAttempts >= maxValidationAttempts) {
                stopAutomaticCapture();
            }
        } finally {
            setIsValidatingWithEndpoint(false);
        }
    };

    // Iniciar captura automática
    const startAutomaticCapture = () => {
        if (captureIntervalRef.current || photoFrozen) return;

        console.log(`🎥 Iniciando captura automática cada ${captureInterval}ms`);

        // Primera captura inmediata después de 1 segundo
        setTimeout(captureFrameForValidation, 1000);

        // Luego capturar cada X segundos
        captureIntervalRef.current = setInterval(captureFrameForValidation, captureInterval);
    };

    // Detener captura automática
    const stopAutomaticCapture = () => {
        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
            captureIntervalRef.current = null;
            console.log('⏹️ Captura automática detenida');
        }
    };

    // Reiniciar validación (para permitir nueva captura)
    const resetValidation = () => {
        setFaceDetected(false);
        setFacePosition(null);
        // setPhotoDataUrl(null);
        setValidationAttempts(0);
        setPhotoFrozen(false);
        setIsValidatingWithEndpoint(false);
        stopAutomaticCapture();
    };

    const openCamera = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                fileInputRef.current?.click();
                return;
            }

            // Reiniciar estados
            resetValidation();

            await checkMultipleCameras();
            await new Promise(resolve => setTimeout(resolve, 50));

            setIsCameraOpen(true);
            await new Promise(resolve => setTimeout(resolve, 100));

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
                    videoRef.current?.play().then(() => {
                        // Iniciar captura automática una vez que el video esté reproduciéndose
                        setTimeout(startAutomaticCapture, 500);
                    }).catch(err => {
                        console.error('Error al reproducir video:', err);
                    });
                };
            }
        } catch (error) {
            console.error(error);
            setIsCameraOpen(false);
            fileInputRef.current?.click();
        }
    };

    const closeCamera = () => {
        stopAutomaticCapture();
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setIsCameraOpen(false);
        resetValidation();
        isTogglingRef.current = false;
    };

    const toggleCamera = async () => {
        if (!hasMultipleCameras || isTogglingRef.current) {
            return;
        }

        isTogglingRef.current = true;
        stopAutomaticCapture();

        const newMode = facingMode === 'user' ? 'environment' : 'user';

        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => {
                    track.stop();
                });
                streamRef.current = null;
            }

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            await new Promise(resolve => setTimeout(resolve, 300));

            const constraintStrategies = [
                {
                    video: {
                        facingMode: { ideal: newMode },
                        width: { ideal: 1280, max: 1920 },
                        height: { ideal: 720, max: 1080 }
                    },
                    audio: false,
                },
                {
                    video: {
                        facingMode: { exact: newMode },
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false,
                },
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
                            videoRef.current?.play().then(() => {
                                // Reiniciar validación y captura automática
                                resetValidation();
                                setTimeout(startAutomaticCapture, 500);
                            }).catch(err => {
                                console.error('Error al reproducir video:', err);
                            });
                        };
                    }

                    setFacingMode(newMode);
                    streamObtained = true;

                } catch (strategyError) {
                    console.log(`Estrategia ${i + 1} falló:`, strategyError);
                    if (i === constraintStrategies.length - 1) {
                        throw strategyError;
                    }
                }
            }

        } catch (error) {
            console.error('Error al cambiar cámara:', error);

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
                        videoRef.current?.play().then(() => {
                            resetValidation();
                            setTimeout(startAutomaticCapture, 500);
                        }).catch(err => {
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

    // Función para captura manual (ahora guarda la foto si ya está validada)
    const capturePhoto = () => {
        if (!faceDetected || !photoDataUrl) {
            console.log('No hay rostro válido detectado para guardar');
            return;
        }

        // La foto ya está guardada en photoDataUrl, solo cerramos la cámara
        console.log(photoDataUrl);
        
        closeCamera();
    };

    const onFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoDataUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    // Configurar la URL del endpoint (función auxiliar)
    const setEndpointUrl = (url: string) => {
        endpointUrl.current = url;
    };

    useEffect(() => {
        checkMultipleCameras();

        return () => {
            stopAutomaticCapture();
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    return {
        isCameraOpen,
        photoDataUrl,
        setPhotoDataUrl,
        facingMode,
        hasMultipleCameras,
        faceDetected,
        facePosition,
        isValidatingWithEndpoint,
        validationAttempts,
        maxValidationAttempts,
        photoFrozen,
        videoRef,
        canvasRef,
        detectionCanvasRef,
        fileInputRef,
        openCamera,
        closeCamera,
        capturePhoto,
        onFileCapture,
        toggleCamera,
        resetValidation,
        setEndpointUrl
    }
}