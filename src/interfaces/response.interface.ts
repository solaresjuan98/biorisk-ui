export interface PredictionResponse {
    cui:             string;
    modelo:          string;
    version:         string;
    threshold:       number;
    datos_renap:     DatosRenap;
    analisis_riesgo: AnalisisRiesgo;
    prediccion:      Prediccion;
    explicacion:     Explicacion;
    analisis_features: AnalisisFeature[];
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
    probabilidad_mora:          number;
    probabilidad_mora_original: number;
    clasificacion:              string;
    nivel_confianza:            string;
    categoria_riesgo:           string;
    raw_probabilities:          number[];
    pesos_modelo:               PesosModelo;
    ajuste_regional:            AjusteRegional;
    ajuste_edad:                AjusteEdad;
    ajuste_total:               number;
    // analisis_features:          AnalisisFeature[];
}

export interface AnalisisFeature {
    feature:            string;
    categoria_feature:  'Facial' | 'Demográfico';
    importance:         number;
    ranking:            number;
    analisis_persona:   number;
    resultado:          number;
}

export interface PesosModelo {
    variables_faciales:     number;
    variables_demograficas: number;
    detalle:                DetallePesos;
}

export interface DetallePesos {
    facial_base: number;
    regional:    number;
    edad:        number;
}

export interface AjusteRegional {
    aplicado:       boolean;
    score_regional: number;
    peso:           number;
    ajuste:         number;
    diferencia:     number;
}

export interface AjusteEdad {
    aplicado:    boolean;
    edad:        number;
    score_edad:  number;
    peso:        number;
    ajuste:      number;
    diferencia:  number;
}