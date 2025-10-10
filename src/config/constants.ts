export const PREDICTION_API_URL = import.meta.env.VITE_API_PREDICTION_URL;
export const MEDIAPIPE_API_URL = import.meta.env.VITE_API_MEDIAPIPE_URL;
export const API_THRESHOLD = parseFloat(import.meta.env.VITE_API_THRESHOLD) || 0.3;
export const APP_ENVIRONMENT = import.meta.env.VITE_APP_ENVIRONMENT || 'production';