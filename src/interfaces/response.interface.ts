export interface PredictionResponse {
    cui:             string;
    modelo:          string;
    version:         string;
    threshold:       number;
    datos_renap:     DatosRenap;
    analisis_riesgo: AnalisisRiesgo;
    prediccion:      Prediccion;
    explicacion:     Explicacion;
}

export interface AnalisisRiesgo {
    ocupacion:        Ocupacion;
    sector_economico: SectorEconomico;
    regional:         Regional;
    demografico:      Demografico;
    imagen:           Imagen;
}

export interface Demografico {
    edad:         number;
    fuente_edad:  string;
    estado_civil: string;
    dependientes: number;
}

export interface Imagen {
    disponible:      boolean;
    fuente:          string;
    analisis_facial: string;
}

export interface Ocupacion {
    ocupacion_renap:     string;
    profesion_declarada: string;
    ocupacion_final:     string;
    score_riesgo:        number;
    categoria:           string;
    nivel_riesgo:        string;
}

export interface Regional {
    region:       string;
    score_riesgo: number;
    nivel:        string;
}

export interface SectorEconomico {
    sector_declarado: string;
    score_riesgo:     number;
    categoria:        string;
}

export interface DatosRenap {
    status:            string;
    cui:               string;
    nombres_completos: string;
    primer_nombre:     string;
    segundo_nombre:    string;
    primer_apellido:   string;
    segundo_apellido:  string;
    fecha_nacimiento:  string;
    ocupacion:         string;
    genero:            string;
    estado_civil:      string;
    nacionalidad:      string;
    lugar_nacimiento:  LugarNacimiento;
    vecindad:          string;
    foto_disponible:   boolean;
    foto:               string;
    municipio:          string;
    departamento:      string;
}

export interface LugarNacimiento {
    pais:         string;
    departamento: string;
    municipio:    string;
}

export interface Explicacion {
    motivos_mora:       string[];
    motivos_no_mora:    string[];
    contribuciones_top: ContribucionesTop[];
}

export interface ContribucionesTop {
    feature:      string;
    valor:        number;
    riesgo_local: number;
    peso:         number;
    contribucion: number;
}

export interface Prediccion {
    probabilidad_mora: number;
    clasificacion:     string;
    nivel_confianza:   string;
    categoria_riesgo:  string;
    raw_probabilities: number[];
}


// export interface PredictionResponse {
//     prediction:            string;
//     probability_mora:      number;
//     confidence_level:      string;
//     risk_category:         string;
//     demographic_scores:    DemographicScores;
//     facial_scores:         FacialScores;
//     feature_contributions: FeatureContributions;
//     model_metadata:        ModelMetadata;
//     renap_data:            RenapData;
//     processing_timestamp:  Date;
//     success:               boolean;
//     message:               string;
// }

// export interface DemographicScores {
//     estabilidad_economica:   number;
//     riesgo_ocupacional:      number;
//     carga_familiar:          number;
//     madurez_edad:            number;
//     nivel_educativo:         number;
//     historial_crediticio:    number;
//     ubicacion_geografica:    number;
//     score_demografico_total: number;
// }

// export interface FacialScores {
//     calidad_imagen:      number;
//     simetria_facial:     number;
//     salud_aparente:      number;
//     indicadores_estres:  number;
//     cuidado_personal:    number;
//     confianza_deteccion: number;
//     uniformidad_piel:    number;
//     score_facial_total:  number;
// }

// export interface FeatureContributions {
//     edad:                 number;
//     ingresos:             number;
//     ocupacion:            number;
//     historial_crediticio: number;
//     ubicacion:            number;
//     calidad_facial:       number;
//     estres_facial:        number;
//     simetria:             number;
//     salud_piel:           number;
//     brillo_imagen:        number;
// }

// export interface ModelMetadata {
//     model_type:     string;
//     threshold:      number;
//     features_count: number;
//     features_head:  string[];
//     loaded_from:    string;
//     metadata_from:  string;
//     extras:         string[];
// }

// export interface RenapData {
//     dpi:                    string;
//     fecha_nacimiento_renap: string;
//     ocupacion_renap:        string;
//     genero_renap:           string;
//     tiene_foto_renap:       boolean;
//     primer_nombre:          string;
//     segundo_nombre:         string;
//     primer_apellido:        string;
//     segundo_apellido:       string;
//     estado_civil:           string;
//     nacionalidad:           string;
//     pais_nacimiento:        string;
//     depto_nacimiento:       string;
//     muni_nacimiento:        string;
//     vecindad:               string;
//     foto:                   string;
//     datos_estimados:        boolean;
// }
