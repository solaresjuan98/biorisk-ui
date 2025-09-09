export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23f8fafc" stroke="%23e2e8f0" stroke-width="2"/><text x="150" y="200" text-anchor="middle" fill="%236b7280" font-size="16">Imagen no disponible</text></svg>';
};

export const generatePlaceholderImage = (width: number, height: number, text: string): string => {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="%23f8fafc" stroke="%23e2e8f0" stroke-width="2"/><text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="%236b7280" font-size="16">${text}</text></svg>`;
};

export const compressImage = (file: File, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };

        img.src = URL.createObjectURL(file);
    });
};