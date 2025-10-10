export interface FaceValidationResponse {
    tiene_cara:  boolean;
    num_caras:   number;
    coordenadas: Coordenada[];
    error:       null;
}

export interface Coordenada {
    x:     number;
    y:     number;
    ancho: number;
    alto:  number;
}
