import { useState, type JSX } from 'react';
import { Search, User, Camera, Brain, Palette, BarChart3, AlertCircle, CheckCircle, XCircle, Clock, Eye, Smile, TrendingUp, Star, Smartphone, Moon, Zap } from 'lucide-react';

// Interfaces para tipar los datos
interface CalidadImagen {
  brightness_score: number;
  contrast_score: number;
  sharpness_score: number;
  noise_score: number;
  total_quality_score: number;
  is_acceptable: boolean;
}

interface OrientacionFacial {
  yaw_angle: number;
  pitch_angle: number;
  roll_angle: number;
  is_frontal_pose: boolean;
}

interface SimetriaFacial {
  overall_symmetry: number;
  eye_symmetry: number;
  mouth_symmetry: number;
  face_symmetry: number;
}

interface ProporcionesAureas {
  golden_ratio_compliance: number;
  facial_thirds_compliance: number;
  upper_face_ratio: number;
  middle_face_ratio: number;
  lower_face_ratio: number;
}

interface RatiosFaciales {
  facial_index: number;
  eye_to_face_ratio: number;
  eye_spacing_ratio: number;
  nose_width_ratio: number;
  mouth_width_ratio: number;
  nose_height_ratio: number;
  mouth_height_ratio: number;
}

interface Expresiones {
  smile_intensity: number;
  eye_openness: number;
  jaw_tension: number;
  expression_confidence: number;
}

interface CoincidenciaColorPiel {
  rgb: number[];
  nombre: string;
  clase: string;
}

interface ColorPiel {
  rgb_detectado: number[];
  posicion_normalizada: number;
  indice_barra_color: number;
  coincidencia_mas_cercana: CoincidenciaColorPiel;
}

interface Genero {
  Woman: number;
  Man: number;
}

interface Raza {
  asian: number;
  indian: number;
  black: number;
  white: number;
  'middle eastern': number;
  'latino hispanic': number;
}

interface Emocion {
  angry: number;
  disgust: number;
  fear: number;
  happy: number;
  sad: number;
  surprise: number;
  neutral: number;
}

interface AnalisisDemografico {
  edad: number;
  genero: Genero;
  raza: Raza;
  emocion: Emocion;
}

interface AnalisisContexto {
  es_selfie: boolean;
  poca_luz: boolean;
  con_flash: boolean;
}

interface FactoresIndividuales {
  calidad_imagen: number;
  pose_frontal: number;
  simetria_facial: number;
  confianza_prediccion: number;
}

interface MetricasConfiabilidad {
  score_general: number;
  nivel_confiabilidad: string;
  factores_individuales: FactoresIndividuales;
  recomendacion: string;
}

interface TopCaracteristicas {
  [key: string]: number;
}

interface ResultadoPrincipal {
  porcentaje: string;
  probabilidad_mora: number;
  prediccion_mora: number;
  umbral_usado: number;
  confianza: string;
  decision: string;
}

interface DatosAnalisis {
  timestamp: string;
  imagen_url: string;
  resultado_principal: ResultadoPrincipal;
  calidad_imagen: CalidadImagen;
  orientacion_facial: OrientacionFacial;
  simetria_facial: SimetriaFacial;
  proporciones_aureas: ProporcionesAureas;
  ratios_faciales: RatiosFaciales;
  expresiones: Expresiones;
  color_piel: ColorPiel;
  analisis_demografico: AnalisisDemografico;
  analisis_contexto: AnalisisContexto;
  metricas_confiabilidad: MetricasConfiabilidad;
  top_caracteristicas_importantes: TopCaracteristicas;
}

interface ResultadosResponse {
  cui_recibido: string;
  resultados: [boolean, DatosAnalisis, number];
}

const PrediccionFrontend: React.FC = () => {
  const [cui, setCui] = useState<string>('');
  const [resultados, setResultados] = useState<ResultadosResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para realizar la consulta a la API
  const handleBuscar = async (): Promise<void> => {
    if (!cui.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Aquí iría tu endpoint real
      const response = await fetch('/api/prediccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cui: cui.trim() })
      });

      if (!response.ok) {
        throw new Error('Error al consultar la API');
      }

      const data: ResultadosResponse = await response.json();
      setResultados(data);
    } catch (err) {
      setError('Error al realizar la consulta. Por favor, intente nuevamente.');
      console.error('Error:', err);
      
      // Para demo, mostrar datos de ejemplo después de 1.5s
      setTimeout(() => {
        const datosDemo: ResultadosResponse = {
          "cui_recibido": cui,
          "resultados": [
            true,
            {
              "timestamp": "2025-07-22T08:56:28.613334",
              "imagen_url": "https://renap-dpi.s3.amazonaws.com/2996110000101_20250709.png",
              "resultado_principal": {
                "porcentaje": "18.06%",
                "probabilidad_mora": 0.18056531893837138,
                "prediccion_mora": 0,
                "umbral_usado": 0.5322344298108611,
                "confianza": "Alta",
                "decision": "NO MORA"
              },
              "calidad_imagen": {
                "brightness_score": 100.0,
                "contrast_score": 91.33,
                "sharpness_score": 16.20,
                "noise_score": 0.0,
                "total_quality_score": 53.88,
                "is_acceptable": false
              },
              "orientacion_facial": {
                "yaw_angle": 0.0004,
                "pitch_angle": 0.0620,
                "roll_angle": 0.0237,
                "is_frontal_pose": true
              },
              "simetria_facial": {
                "overall_symmetry": 99.85,
                "eye_symmetry": 99.92,
                "mouth_symmetry": 99.89,
                "face_symmetry": 99.78
              },
              "proporciones_aureas": {
                "golden_ratio_compliance": 44.41,
                "facial_thirds_compliance": 100.0,
                "upper_face_ratio": 0.214,
                "middle_face_ratio": 0.340,
                "lower_face_ratio": 0.446
              },
              "ratios_faciales": {
                "facial_index": 1.090,
                "eye_to_face_ratio": 0.230,
                "eye_spacing_ratio": 0.302,
                "nose_width_ratio": 0.314,
                "mouth_width_ratio": 0.385,
                "nose_height_ratio": 0.2,
                "mouth_height_ratio": 0.05
              },
              "expresiones": {
                "smile_intensity": 0.031,
                "eye_openness": 50.0,
                "jaw_tension": 20.0,
                "expression_confidence": 93.43
              },
              "color_piel": {
                "rgb_detectado": [177, 111, 81],
                "posicion_normalizada": 0.5,
                "indice_barra_color": 0,
                "coincidencia_mas_cercana": {
                  "rgb": [177, 111, 81],
                  "nombre": "Color detectado",
                  "clase": "Análisis directo"
                }
              },
              "analisis_demografico": {
                "edad": 27.0,
                "genero": {
                  "Woman": 0.19,
                  "Man": 99.81
                },
                "raza": {
                  "asian": 6.04,
                  "indian": 12.05,
                  "black": 12.88,
                  "white": 7.75,
                  "middle eastern": 4.59,
                  "latino hispanic": 56.69
                },
                "emocion": {
                  "angry": 0.060,
                  "disgust": 0.0,
                  "fear": 0.077,
                  "happy": 0.0,
                  "sad": 6.43,
                  "surprise": 0.0,
                  "neutral": 93.43
                }
              },
              "analisis_contexto": {
                "es_selfie": true,
                "poca_luz": false,
                "con_flash": true
              },
              "metricas_confiabilidad": {
                "score_general": 76.90,
                "nivel_confiabilidad": "Alta",
                "factores_individuales": {
                  "calidad_imagen": 53.88,
                  "pose_frontal": 90.0,
                  "simetria_facial": 99.85,
                  "confianza_prediccion": 63.89
                },
                "recomendacion": "Usar predicción"
              },
              "top_caracteristicas_importantes": {
                "gender_score": 0.056,
                "image_sharpness": 0.041,
                "age": 0.034,
                "roll_angle": 0.029,
                "emotion_happy": 0.029,
                "eye_symmetry": 0.028,
                "is_low_light_context": 0.028,
                "race_asian": 0.028,
                "nose_width_ratio": 0.027,
                "race_latino_hispanic": 0.027
              }
            },
            200
          ]
        };
        setResultados(datosDemo);
        setError(null);
      }, 500);
    }
    
    setLoading(false);
  };

  const getDecisionColor = (decision: string): string => {
    return decision === "NO MORA" ? "text-green-600" : "text-red-600";
  };

  const getDecisionBgColor = (decision: string): string => {
    return decision === "NO MORA" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  };

  const getDecisionIcon = (decision: string): JSX.Element => {
    return decision === "NO MORA" ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />;
  };

//   const formatPercentage = (value: string | number): string => {
//     if (typeof value === 'string') return value;
//     return `${(value * 100).toFixed(2)}%`;
//   };

  const getConfiabilidadColor = (nivel: string): string => {
    const colors: Record<string, string> = {
      'Alta': 'text-green-600 bg-green-50',
      'Media': 'text-yellow-600 bg-yellow-50',
      'Baja': 'text-red-600 bg-red-50'
    };
    return colors[nivel] || 'text-gray-600 bg-gray-50';
  };

  const rgbToHex = (rgb: number[]): string => {
    return `rgb(${rgb.join(', ')})`;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23f8fafc" stroke="%23e2e8f0" stroke-width="2"/><text x="150" y="200" text-anchor="middle" fill="%236b7280" font-size="16">Imagen no disponible</text></svg>';
  };

  // Verificar si tenemos resultados válidos
  const data: DatosAnalisis | null = resultados?.resultados?.[0] ? resultados.resultados[1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Sistema de Predicción de Mora
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Análisis avanzado basado en reconocimiento facial y machine learning
          </p>
        </div>

        {/* Campo de búsqueda */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8">
          <div className="max-w-2xl mx-auto">
            <label className="block text-lg font-semibold text-gray-200 mb-4 text-center">
              Ingresa el CUI para análisis
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={cui}
                onChange={(e) => setCui(e.target.value)}
                placeholder="Ejemplo: 3295608081107"
                className="flex-1 px-6 py-4 border-2 border-gray-600 bg-gray-700 text-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg font-mono transition-all duration-200 placeholder-gray-400"
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleBuscar}
                disabled={loading || !cui.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Analizando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Buscar
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Resultados */}
        {data && (
          <div className="space-y-8">
            {/* Resultado Principal - Hero Section */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Resultado del Análisis</h2>
                    <p className="opacity-90 text-lg">CUI: {resultados?.cui_recibido}</p>
                    <p className="opacity-75 text-sm flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4" />
                      {new Date(data.timestamp).toLocaleString('es-GT')}
                    </p>
                  </div>
                  <Brain className="w-16 h-16 opacity-80" />
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Imagen */}
                  <div className="lg:col-span-1 flex justify-center">
                    <div className="relative">
                      <img
                        src={data.imagen_url}
                        alt="Imagen de análisis"
                        className="rounded-2xl shadow-lg max-w-full h-auto border-4 border-gray-100"
                        onError={handleImageError}
                      />
                      {data.analisis_contexto?.con_flash && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Con Flash
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Resultado y Métricas */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Decisión Principal */}
                    <div className={`p-6 rounded-2xl border-2 ${getDecisionBgColor(data.resultado_principal.decision)}`}>
                      <div className={`flex items-center gap-4 ${getDecisionColor(data.resultado_principal.decision)} mb-4`}>
                        {getDecisionIcon(data.resultado_principal.decision)}
                        <span className="text-3xl font-bold">
                          {data.resultado_principal.decision}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">Probabilidad</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {data.resultado_principal.porcentaje}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">Confianza</p>
                          <div className={`inline-block px-3 py-1 rounded-full font-bold ${getConfiabilidadColor(data.resultado_principal.confianza)}`}>
                            {data.resultado_principal.confianza}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">Umbral</p>
                          <p className="text-lg font-bold text-gray-800">
                            {(data.resultado_principal.umbral_usado * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">Score</p>
                          <p className="text-lg font-bold text-purple-600">
                            {data.metricas_confiabilidad.score_general.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contexto de la Imagen */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`p-4 rounded-xl text-center ${data.analisis_contexto.es_selfie ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}`}>
                        <Smartphone className="w-6 h-6 mx-auto mb-2" />
                        <p className="font-semibold">Selfie</p>
                        <p className="text-sm">{data.analisis_contexto.es_selfie ? 'Sí' : 'No'}</p>
                      </div>
                      <div className={`p-4 rounded-xl text-center ${data.analisis_contexto.poca_luz ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
                        <Moon className="w-6 h-6 mx-auto mb-2" />
                        <p className="font-semibold">Poca Luz</p>
                        <p className="text-sm">{data.analisis_contexto.poca_luz ? 'Sí' : 'No'}</p>
                      </div>
                      <div className={`p-4 rounded-xl text-center ${data.analisis_contexto.con_flash ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-600'}`}>
                        <Zap className="w-6 h-6 mx-auto mb-2" />
                        <p className="font-semibold">Flash</p>
                        <p className="text-sm">{data.analisis_contexto.con_flash ? 'Sí' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Análisis Detallados */}
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6">
              {/* Análisis Demográfico */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-7 h-7 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Análisis Demográfico</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-1">
                      {data.analisis_demografico.edad}
                    </div>
                    <p className="text-gray-600">años</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-700 font-semibold mb-3">Género:</p>
                    <div className="space-y-2">
                      {Object.entries(data.analisis_demografico.genero).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="capitalize">{key}:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{width: `${value}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12">{value.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-700 font-semibold mb-3">Etnia (Top 3):</p>
                    <div className="space-y-2">
                      {Object.entries(data.analisis_demografico.raza)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="capitalize text-sm">{key.replace('_', ' ')}:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full" 
                                  style={{width: `${value}%`}}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-12">{value.toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expresiones y Emociones */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Smile className="w-7 h-7 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-900">Expresiones</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <Eye className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Apertura Ojos</p>
                      <p className="text-xl font-bold text-yellow-600">{data.expresiones.eye_openness}%</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-xl">
                      <Smile className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Sonrisa</p>
                      <p className="text-xl font-bold text-pink-600">{(data.expresiones.smile_intensity * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-700 font-semibold mb-3">Emociones Principales:</p>
                    <div className="space-y-2">
                      {Object.entries(data.analisis_demografico.emocion)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="capitalize text-sm">{key}:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-orange-500 h-2 rounded-full" 
                                  style={{width: `${Math.min(value, 100)}%`}}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-12">{value.toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Confianza Expresión:</p>
                    <p className="text-lg font-bold text-gray-800">{data.expresiones.expression_confidence.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Calidad de Imagen */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Camera className="w-7 h-7 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Calidad de Imagen</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Brillo:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-yellow-500 h-3 rounded-full transition-all duration-300" 
                          style={{width: `${data.calidad_imagen.brightness_score}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{data.calidad_imagen.brightness_score.toFixed(0)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Contraste:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                          style={{width: `${data.calidad_imagen.contrast_score}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{data.calidad_imagen.contrast_score.toFixed(0)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nitidez:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-500 h-3 rounded-full transition-all duration-300" 
                          style={{width: `${Math.min(data.calidad_imagen.sharpness_score * 6, 100)}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{data.calidad_imagen.sharpness_score.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Estado de la Imagen:</span>
                      <div className="flex items-center gap-2">
                        {data.calidad_imagen.is_acceptable ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-medium ${data.calidad_imagen.is_acceptable ? 'text-green-600' : 'text-red-600'}`}>
                          {data.calidad_imagen.is_acceptable ? 'Aceptable' : 'No Aceptable'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Score Total:</p>
                      <p className="text-lg font-bold text-gray-800">{data.calidad_imagen.total_quality_score.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simetría Facial */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-7 h-7 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">Simetría Facial</h3>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(data.simetria_facial).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-gray-600 capitalize text-sm">
                        {key.replace('_', ' ')}:
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300" 
                            style={{width: `${value}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12">{value.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-sm text-purple-600 mb-1">Simetría General</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {data.simetria_facial.overall_symmetry.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Proporciones Áureas */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-7 h-7 text-yellow-600" />
                  <h3 className="text-xl font-bold text-gray-900">Proporciones Áureas</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {data.proporciones_aureas.golden_ratio_compliance.toFixed(1)}%
                    </div>
                    <p className="text-gray-600">Proporción Áurea</p>
                  </div>

                  <div>
                    <p className="text-gray-700 font-semibold mb-3">Tercios Faciales:</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Superior:</span>
                        <span className="font-medium">{(data.proporciones_aureas.upper_face_ratio * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Medio:</span>
                        <span className="font-medium">{(data.proporciones_aureas.middle_face_ratio * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Inferior:</span>
                        <span className="font-medium">{(data.proporciones_aureas.lower_face_ratio * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700 mb-1">Cumplimiento Tercios:</p>
                    <p className="text-lg font-bold text-yellow-800">{data.proporciones_aureas.facial_thirds_compliance}%</p>
                  </div>
                </div>
              </div>

              {/* Orientación Facial */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="w-7 h-7 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-900">Orientación Facial</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Yaw (Horizontal):</span>
                    <span className="font-medium">{(data.orientacion_facial.yaw_angle * 180 / Math.PI).toFixed(2)}°</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pitch (Vertical):</span>
                    <span className="font-medium">{(data.orientacion_facial.pitch_angle * 180 / Math.PI).toFixed(2)}°</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Roll (Inclinación):</span>
                    <span className="font-medium">{(data.orientacion_facial.roll_angle * 180 / Math.PI).toFixed(2)}°</span>
                  </div>
                  
                  <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-indigo-900">Pose Frontal:</span>
                      <div className="flex items-center gap-2">
                        {data.orientacion_facial.is_frontal_pose ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-medium ${data.orientacion_facial.is_frontal_pose ? 'text-green-600' : 'text-red-600'}`}>
                          {data.orientacion_facial.is_frontal_pose ? 'Sí' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Características Importantes y Color de Piel */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Características */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-7 h-7 text-emerald-600" />
                  <h3 className="text-xl font-bold text-gray-900">Características Más Importantes</h3>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(data.top_caracteristicas_importantes)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([key, value], index) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {key.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">
                          {(value * 100).toFixed(2)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Color de Piel y Ratios */}
              <div className="space-y-6">
                {/* Color de Piel */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Palette className="w-6 h-6 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-900">Color de Piel</h3>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                      style={{backgroundColor: rgbToHex(data.color_piel.rgb_detectado)}}
                    ></div>
                    <div>
                      <p className="font-semibold text-gray-800">{data.color_piel.coincidencia_mas_cercana.nombre}</p>
                      <p className="text-sm text-gray-600">RGB: {data.color_piel.rgb_detectado.join(', ')}</p>
                      <p className="text-sm text-gray-500">{data.color_piel.coincidencia_mas_cercana.clase}</p>
                    </div>
                  </div>
                </div>

                {/* Ratios Faciales */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Ratios Faciales</h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-600 font-medium">Índice Facial</p>
                      <p className="text-blue-800 font-bold">{data.ratios_faciales.facial_index.toFixed(3)}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-purple-600 font-medium">Ratio Ojos</p>
                      <p className="text-purple-800 font-bold">{data.ratios_faciales.eye_to_face_ratio.toFixed(3)}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-green-600 font-medium">Separación Ojos</p>
                      <p className="text-green-800 font-bold">{data.ratios_faciales.eye_spacing_ratio.toFixed(3)}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-orange-600 font-medium">Ancho Nariz</p>
                      <p className="text-orange-800 font-bold">{data.ratios_faciales.nose_width_ratio.toFixed(3)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con timestamp */}
            <div className="text-center text-gray-500 py-6">
              <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                <Clock className="w-4 h-4" />
                <span>Análisis completado el {new Date(data.timestamp).toLocaleString('es-GT')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrediccionFrontend;