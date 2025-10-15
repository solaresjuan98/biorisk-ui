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
            // 🔥 MEJORADO: Usar dimensiones reales del video para máxima calidad
            const w = video.videoWidth || 1920;
            const h = video.videoHeight || 1080;
            
            canvas.width = w;
            canvas.height = h;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // 🔥 MEJORADO: Configurar contexto para máxima calidad
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(video, 0, 0, w, h);
            
            // 🔥 MEJORADO: Calidad JPEG al 95% (mejor que 80%)
            const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

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

                // Detener captura automática
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

                console.log('✅ Rostro válido detectado');
                
                // 🔥 NUEVO: Cerrar cámara automáticamente después de 1.5 segundos
                setTimeout(async () => {
                    console.log('🔒 Cerrando cámara automáticamente...');
                    await closeCamera();
                }, 1500);
                
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

    // 🔥 MEJORADO: Detener stream de forma segura y completa
    const stopStreamSafely = async () => {
        console.log('🛑 Deteniendo stream de forma segura...');

        // Detener captura automática primero
        stopAutomaticCapture();

        // Pausar y limpiar el video
        if (videoRef.current) {
            try {
                videoRef.current.pause();
                videoRef.current.srcObject = null;
                // Forzar recarga del elemento
                videoRef.current.load();
            } catch (error) {
                console.warn('Error al pausar video:', error);
            }
        }

        // Esperar a que el video se detenga completamente
        await new Promise(resolve => setTimeout(resolve, 150));

        // Detener TODOS los tracks del stream
        if (streamRef.current) {
            try {
                const tracks = streamRef.current.getTracks();
                tracks.forEach((track) => {
                    track.stop();
                    console.log('✅ Track detenido:', track.kind, track.label);
                });
                
                // Limpiar referencia
                streamRef.current = null;
            } catch (error) {
                console.warn('Error al detener tracks:', error);
            }
        }

        // Esperar para asegurar liberación completa de recursos
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('✅ Stream completamente detenido');
    };

    const startStreamSafely = async (constraints: MediaStreamConstraints) => {
        if (streamInitializingRef.current) {
            console.warn('⚠️ Stream ya se está inicializando, esperando...');
            let attempts = 0;
            while (streamInitializingRef.current && attempts < 30) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            if (streamInitializingRef.current) return null;
        }

        streamInitializingRef.current = true;

        try {
            console.log('🎬 Iniciando stream con constraints:', constraints);

            if (!videoRef.current) {
                throw new Error('videoRef no disponible antes de getUserMedia');
            }

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (!videoRef.current) {
                console.warn('⚠️ videoRef perdido después de getUserMedia');
                stream.getTracks().forEach(track => track.stop());
                return null;
            }

            videoRef.current.srcObject = null;
            await new Promise(resolve => setTimeout(resolve, 50));

            videoRef.current.srcObject = stream;
            streamRef.current = stream;

            await new Promise<void>((resolve, reject) => {
                const video = videoRef.current;
                if (!video) {
                    reject(new Error('Video ref perdido'));
                    return;
                }

                if (video.videoWidth > 0 && video.videoHeight > 0) {
                    console.log('✅ Metadatos ya disponibles');
                    resolve();
                    return;
                }

                const handleLoadedMetadata = () => {
                    console.log('✅ Metadatos cargados:', {
                        width: video.videoWidth,
                        height: video.videoHeight
                    });
                    cleanup();
                    resolve();
                };

                const handleError = (error: Event) => {
                    console.error('❌ Error al cargar metadatos:', error);
                    cleanup();
                    reject(error);
                };

                const cleanup = () => {
                    video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                    video.removeEventListener('error', handleError);
                    if (timeoutId) clearTimeout(timeoutId);
                };

                video.addEventListener('loadedmetadata', handleLoadedMetadata);
                video.addEventListener('error', handleError);

                const timeoutId = setTimeout(() => {
                    cleanup();
                    reject(new Error('Timeout esperando metadatos'));
                }, 8000);
            });

            try {
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;

                await videoRef.current.play();
                console.log('▶️ Video reproduciéndose');

                await new Promise(resolve => setTimeout(resolve, 100));

                if (videoRef.current.paused) {
                    console.warn('⚠️ Video sigue pausado, reintentando...');
                    await videoRef.current.play();
                }

            } catch (playError) {
                console.error('❌ Error al reproducir video:', playError);
                throw new Error('No se pudo reproducir el video');
            }

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
    
            // Limpiar estado previo completamente
            await stopStreamSafely();
            resetValidation();
    
            // Verificar cámaras ANTES de abrir
            await checkMultipleCameras();
    
            // Esperar tiempo suficiente
            await new Promise(resolve => setTimeout(resolve, 200));
    
            // Abrir la cámara (actualiza el DOM)
            setIsCameraOpen(true);
    
            // Esperar a que el DOM se actualice
            await new Promise(resolve => setTimeout(resolve, 300));
    
            // Verificar que videoRef está montado
            if (!videoRef.current) {
                console.error('❌ videoRef no disponible después de abrir cámara');
                throw new Error('Video element no montado');
            }
    
            // ⚡ MEJORADO: Constraints de alta calidad (similar a cámara nativa)
            const constraints = {
                video: {
                    facingMode: { ideal: facingMode },
                    width: { ideal: 1920, max: 4096 },    // Resolución máxima
                    height: { ideal: 1080, max: 2160 },   // Hasta 4K
                    aspectRatio: { ideal: 16 / 9 },
                    frameRate: { ideal: 30, max: 60 },    // Frame rate óptimo
                },
                audio: false,
            };
    
            const stream = await startStreamSafely(constraints);
    
            if (!stream) {
                throw new Error('No se pudo obtener el stream');
            }
    
            // Esperar antes de iniciar captura automática
            setTimeout(startAutomaticCapture, 1000);
    
        } catch (error) {
            console.error('Error al abrir cámara:', error);
            setIsCameraOpen(false);
            await stopStreamSafely();
    
            // Fallback a selección de archivo
            setTimeout(() => {
                fileInputRef.current?.click();
            }, 100);
        }
    };

    const closeCamera = async () => {
        await stopStreamSafely();
        setIsCameraOpen(false);
        resetValidation();
        isTogglingRef.current = false;
    };

    const toggleCamera = async () => {
        if (!hasMultipleCameras || isTogglingRef.current || streamInitializingRef.current) {
            console.warn('⚠️ No se puede cambiar cámara en este momento');
            return;
        }

        isTogglingRef.current = true;
        const newMode = facingMode === 'user' ? 'environment' : 'user';

        try {
            console.log(`🔄 Cambiando de ${facingMode} a ${newMode}`);

            await stopStreamSafely();
            await new Promise(resolve => setTimeout(resolve, 800));

            const constraintStrategies = [
                {
                    video: {
                        facingMode: { exact: newMode },
                        width: { ideal: 1920, max: 4096 },
                        height: { ideal: 1080, max: 2160 },
                        aspectRatio: { ideal: 16 / 9 },
                        frameRate: { ideal: 30, max: 60 },
                    },
                    audio: false,
                },
                {
                    video: {
                        facingMode: { ideal: newMode },
                        width: { ideal: 1920, max: 4096 },
                        height: { ideal: 1080, max: 2160 }
                    },
                    audio: false,
                },
                {
                    video: { facingMode: newMode },
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
                        resetValidation();
                        setTimeout(startAutomaticCapture, 1000);
                        console.log(`✅ Estrategia ${i + 1} exitosa`);
                    }

                } catch (strategyError) {
                    console.log(`❌ Estrategia ${i + 1} falló:`, strategyError);
                    await stopStreamSafely();

                    if (i === constraintStrategies.length - 1) {
                        throw strategyError;
                    }

                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

        } catch (error) {
            console.error('❌ Error al cambiar cámara:', error);

            try {
                const fallbackConstraints = {
                    video: {
                        facingMode: { ideal: facingMode },
                        width: { ideal: 1920, max: 4096 },
                        height: { ideal: 1080, max: 2160 },
                    },
                    audio: false,
                };

                await stopStreamSafely();
                await new Promise(resolve => setTimeout(resolve, 500));

                const fallbackStream = await startStreamSafely(fallbackConstraints);
                if (fallbackStream) {
                    resetValidation();
                    setTimeout(startAutomaticCapture, 1000);
                    console.log('✅ Fallback a cámara original exitoso');
                } else {
                    throw new Error('Fallback falló');
                }
            } catch (fallbackError) {
                console.error('❌ Fallback falló:', fallbackError);
                await closeCamera();
            }
        } finally {
            isTogglingRef.current = false;
        }
    };

    // 🔥 MEJORADO: Capturar foto cierra la cámara automáticamente
    const capturePhoto = async () => {
        if (!faceDetected || !photoDataUrl) {
            console.log('No hay rostro válido detectado para guardar');
            return;
        }

        console.log('📸 Guardando foto y cerrando cámara...');
        
        // Detener captura automática inmediatamente
        stopAutomaticCapture();
        
        // La foto ya está guardada en photoDataUrl (capturada por validateFaceWithEndpoint)
        // Solo necesitamos cerrar la cámara
        await closeCamera();
        
        console.log('✅ Foto guardada y cámara cerrada');
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