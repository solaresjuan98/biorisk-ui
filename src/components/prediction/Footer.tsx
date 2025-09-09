import { Brain, Sparkles, Zap } from "lucide-react"

export const Footer = () => {
    return (
        <div className="text-center py-6">
            <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-lg px-6 py-3 rounded-full shadow-lg border border-white/30 text-gray-900">
                <Brain className="w-5 h-5 text-blue-600" />
                {/* <span className="text-sm">Procesado por Sistema de IA: {new Date(data.processing_timestamp).toLocaleString('es-GT')}</span> */}
                <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-blue-200 text-sm mt-3 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Powered by Advanced AI • Machine Learning • Análisis Biométrico
            </p>
        </div>
    )
}
