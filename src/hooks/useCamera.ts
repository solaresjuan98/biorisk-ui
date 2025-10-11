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
    const [maxValidationAttempts] = useState(10);
    const [captureInterval] = useState(3000);
    const [photoFrozen, setPhotoFrozen] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const detectionCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const isTogglingRef = useRef(false);
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const endpointUrl = useRef('http://localhost:8000/api/validate-face');
    
    // Nuevo: ref para prevenir múltiples llamadas simultáneas
    const streamInitializingRef = useRef(false);

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

    const validateFaceWithEndpoint = async (imageDataUrl: string) => {
        if (photoFrozen || isValidatingWithEndpoint || validationAttempts >= maxValidationAttempts) return;

        setIsValidatingWithEndpoint(true);
        setValidationAttempts(prev => prev + 1);

        try {
            const result = await getFaceValidation(imageDataUrl);

            if (result.tiene_cara && result.num_caras > 0) {
                setFaceDetected(true);
                setPhotoDataUrl(imageDataUrl);
                setPhotoFrozen(true);

                if (captureIntervalRef.current) {
                    clearInterval(captureIntervalRef.current);
                    captureIntervalRef.current = null;
                }

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
                setFaceDetected(false);
                setFacePosition(null);
                console.log(`❌ Intento ${validationAttempts}/${maxValidationAttempts}: ${result.error || 'Rostro no detectado'}`);

                if (validationAttempts >= maxValidationAttempts) {
                    console.log('🔄 Máximo de intentos alcanzado. Deteniendo validación automática.');
                    stopAutomaticCapture();
                }
            }
        } catch (error) {
            console.error('Error al validar rostro con endpoint:', error);
            setFaceDetected(false);
            setFacePosition(null);

            if (validationAttempts >= maxValidationAttempts) {
                stopAutomaticCapture();
            }
        } finally {
            setIsValidatingWithEndpoint(false);
        }
    };

    const startAutomaticCapture = () => {
        if (captureIntervalRef.current || photoFrozen) return;

        console.log(`🎥 Iniciando captura automática cada ${captureInterval}ms`);

        setTimeout(captureFrameForValidation, 1000);
        captureIntervalRef.current = setInterval(captureFrameForValidation, captureInterval);
    };

    const stopAutomaticCapture = () => {
        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
            captureIntervalRef.current = null;
            console.log('⏹️ Captura automática detenida');
        }
    };

    const resetValidation = () => {
        setFaceDetected(false);
        setFacePosition(null);
        setValidationAttempts(0);
        setPhotoFrozen(false);
        setIsValidatingWithEndpoint(false);
        stopAutomaticCapture();
    };

    // FUNCIÓN MEJORADA: Detener stream de forma segura
    const stopStreamSafely = async () => {
        console.log('🛑 Deteniendo stream de forma segura...');
        
        // Detener captura automática primero
        stopAutomaticCapture();
        
        // Pausar el video primero
        if (videoRef.current) {
            try {
                videoRef.current.pause();
                videoRef.current.srcObject = null;
            } catch (error) {
                console.warn('Error al pausar video:', error);
            }
        }
        
        // Esperar a que el video se detenga completamente
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Detener todas las pistas del stream
        if (streamRef.current) {
            try {
                streamRef.current.getTracks().forEach((track) => {
                    track.stop();
                    console.log('✅ Track detenido:', track.kind);
                });
            } catch (error) {
                console.warn('Error al detener tracks:', error);
            }
            streamRef.current = null;
        }
        
        // Esperar un poco más para asegurar liberación de recursos
        await new Promise(resolve => setTimeout(resolve, 200));
    };

    // FUNCIÓN MEJORADA: Iniciar stream de forma segura
    const startStreamSafely = async (constraints: MediaStreamConstraints) => {
        if (streamInitializingRef.current) {
            console.warn('⚠️ Stream ya se está inicializando, esperando...');
            return null;
        }

        streamInitializingRef.current = true;

        try {
            console.log('🎬 Iniciando stream con constraints:', constraints);
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (!videoRef.current) {
                console.warn('⚠️ videoRef no disponible');
                stream.getTracks().forEach(track => track.stop());
                return null;
            }

            // Asignar el stream al video
            videoRef.current.srcObject = stream;
            streamRef.current = stream;

            // Esperar a que los metadatos se carguen
            await new Promise<void>((resolve, reject) => {
                const video = videoRef.current;
                if (!video) {
                    reject(new Error('Video ref perdido'));
                    return;
                }

                const handleLoadedMetadata = () => {
                    console.log('✅ Metadatos cargados');
                    video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                    resolve();
                };

                const handleError = (error: Event) => {
                    console.error('❌ Error al cargar metadatos:', error);
                    video.removeEventListener('error', handleError);
                    reject(error);
                };

                video.addEventListener('loadedmetadata', handleLoadedMetadata);
                video.addEventListener('error', handleError);

                // Timeout de seguridad
                setTimeout(() => {
                    video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                    video.removeEventListener('error', handleError);
                    reject(new Error('Timeout esperando metadatos'));
                }, 5000);
            });

            // Reproducir el video
            await videoRef.current.play();
            console.log('▶️ Video reproduciéndose');

            return stream;

        } catch (error) {
            console.error('❌ Error al iniciar stream:', error);
            throw error;
        } finally {
            streamInitializingRef.current = false;
        }
    };

    const openCamera = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                fileInputRef.current?.click();
                return;
            }

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

            const stream = await startStreamSafely(constraints);
            
            if (stream) {
                // Iniciar captura automática después de un delay
                setTimeout(startAutomaticCapture, 500);
            }

        } catch (error) {
            console.error('Error al abrir cámara:', error);
            setIsCameraOpen(false);
            fileInputRef.current?.click();
        }
    };

    const closeCamera = async () => {
        await stopStreamSafely();
        setIsCameraOpen(false);
        resetValidation();
        isTogglingRef.current = false;
    };

    // FUNCIÓN MEJORADA: Toggle de cámara con mejor manejo para Samsung
    const toggleCamera = async () => {
        if (!hasMultipleCameras || isTogglingRef.current || streamInitializingRef.current) {
            console.warn('⚠️ No se puede cambiar cámara en este momento');
            return;
        }

        isTogglingRef.current = true;
        const newMode = facingMode === 'user' ? 'environment' : 'user';

        try {
            console.log(`🔄 Cambiando de ${facingMode} a ${newMode}`);
            
            // Detener stream actual de forma segura
            await stopStreamSafely();
            
            // Esperar un momento adicional para Samsung
            await new Promise(resolve => setTimeout(resolve, 500));

            // Probar diferentes estrategias de constraints
            const constraintStrategies = [
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
                        facingMode: { ideal: newMode },
                        width: { ideal: 1280, max: 1920 },
                        height: { ideal: 720, max: 1080 }
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
                    console.log(`📋 Intentando estrategia ${i + 1}...`);
                    
                    const stream = await startStreamSafely(constraintStrategies[i]);
                    
                    if (stream) {
                        setFacingMode(newMode);
                        streamObtained = true;
                        
                        // Reiniciar validación y captura
                        resetValidation();
                        setTimeout(startAutomaticCapture, 500);
                        
                        console.log(`✅ Estrategia ${i + 1} exitosa`);
                    }

                } catch (strategyError) {
                    console.log(`❌ Estrategia ${i + 1} falló:`, strategyError);
                    
                    // Limpiar cualquier recurso parcial
                    await stopStreamSafely();
                    
                    if (i === constraintStrategies.length - 1) {
                        throw strategyError;
                    }
                    
                    // Esperar antes de la siguiente estrategia
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }

        } catch (error) {
            console.error('❌ Error al cambiar cámara:', error);

            try {
                // Intentar volver a la cámara original
                console.log('🔙 Intentando volver a cámara original...');
                
                await stopStreamSafely();
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const fallbackConstraints = {
                    video: {
                        facingMode: { ideal: facingMode },
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false,
                };

                const stream = await startStreamSafely(fallbackConstraints);
                
                if (stream) {
                    resetValidation();
                    setTimeout(startAutomaticCapture, 500);
                    console.log('✅ Recuperado a cámara original');
                }
                
            } catch (fallbackError) {
                console.error('❌ Error en fallback:', fallbackError);
                await closeCamera();
            }
        } finally {
            isTogglingRef.current = false;
        }
    };

    const capturePhoto = () => {
        if (!faceDetected || !photoDataUrl) {
            console.log('No hay rostro válido detectado para guardar');
            return;
        }

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

    const setEndpointUrl = (url: string) => {
        endpointUrl.current = url;
    };

    useEffect(() => {
        checkMultipleCameras();

        return () => {
            // Cleanup al desmontar
            stopAutomaticCapture();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
            }
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