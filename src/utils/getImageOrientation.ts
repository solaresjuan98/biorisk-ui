// utils/imageOrientation.ts
// Función para corregir la orientación de imágenes basándose en metadatos EXIF
// Agregar al principio de tu componente ClientForm.tsx:
// import { processImageFile } from '@/utils/imageOrientation';

export const getImageOrientation = (file: File): Promise<number> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const view = new DataView(e.target?.result as ArrayBuffer);
            
            if (view.getUint16(0, false) !== 0xFFD8) {
                resolve(-2); // No es un JPEG
                return;
            }
            
            const length = view.byteLength;
            let offset = 2;
            
            while (offset < length) {
                if (view.getUint16(offset + 2, false) <= 8) {
                    resolve(-1);
                    return;
                }
                
                const marker = view.getUint16(offset, false);
                offset += 2;
                
                if (marker === 0xFFE1) {
                    // Encontró marcador APP1 (EXIF)
                    if (view.getUint32(offset += 2, false) !== 0x45786966) {
                        resolve(-1);
                        return;
                    }
                    
                    const little = view.getUint16(offset += 6, false) === 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    const tags = view.getUint16(offset, little);
                    offset += 2;
                    
                    for (let i = 0; i < tags; i++) {
                        if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                            // Tag 0x0112 es la orientación
                            resolve(view.getUint16(offset + (i * 12) + 8, little));
                            return;
                        }
                    }
                } else if ((marker & 0xFF00) !== 0xFF00) {
                    break;
                } else {
                    offset += view.getUint16(offset, false);
                }
            }
            resolve(-1);
        };
        
        reader.readAsArrayBuffer(file);
    });
};

export const correctImageOrientation = (
    imageDataUrl: string,
    orientation: number
): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                resolve(imageDataUrl);
                return;
            }
            
            const width = img.width;
            const height = img.height;

            // Configurar transformaciones según orientación EXIF
            switch (orientation) {
                // case 2:
                //     // Espejo horizontal
                //     canvas.width = width;
                //     canvas.height = height;
                //     ctx.transform(-1, 0, 0, 1, width, 0);
                //     break;
                // case 3:
                //     // Rotación 180°
                //     canvas.width = width;
                //     canvas.height = height;
                //     ctx.transform(-1, 0, 0, -1, width, height);
                //     break;
                // case 4:
                //     // Espejo vertical
                //     canvas.width = width;
                //     canvas.height = height;
                //     ctx.transform(1, 0, 0, -1, 0, height);
                //     break;
                // case 5:
                //     // Espejo horizontal + Rotación 90° antihorario
                //     canvas.width = height;
                //     canvas.height = width;
                //     ctx.transform(0, 1, 1, 0, 0, 0);
                //     break;
                // case 6:
                //     // Rotación 90° horario
                //     canvas.width = height;
                //     canvas.height = width;
                //     ctx.transform(0, 1, -1, 0, height, 0);
                //     break;
                // case 7:
                //     // Espejo horizontal + Rotación 90° horario
                //     canvas.width = height;
                //     canvas.height = width;
                //     ctx.transform(0, -1, -1, 0, height, width);
                //     break;
                // case 8:
                //     // Rotación 90° antihorario
                //     canvas.width = height;
                //     canvas.height = width;
                //     ctx.transform(0, -1, 1, 0, 0, width);
                //     break;
                default:
                    // Sin transformación (orientación 1 o desconocida)
                    canvas.width = width;
                    canvas.height = height;
                    break;
            }
            
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        
        img.src = imageDataUrl;
    });
};
// Función combinada que procesa el archivo completo
export const processImageFile = async (file: File): Promise<string> => {
    // Leer el archivo como Data URL
    const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
    });
    
    // Obtener orientación EXIF
    const orientation = await getImageOrientation(file);
    console.log('Image orientation:', orientation);
    
    // Si tiene orientación EXIF problemática, corregirla
    if (orientation > 1) {
        return await correctImageOrientation(dataUrl, orientation);
    }
    
    // Si no tiene problemas de orientación, devolver tal cual
    return dataUrl;
};