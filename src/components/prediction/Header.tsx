import { Brain, Cpu, Network, Shield } from "lucide-react"

export const Header = () => {
    return (
        <div className="text-center py-8 relative">
            {/* agregar /20 para opacidad */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-3xl"></div>
            <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-600 rounded-2xl">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
                        <Cpu className="w-8 h-8 text-white" />
                    </div>
                    <div className="p-3 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl">
                        <Network className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    BioRisk
                </h1>
                <p className="text-xl text-blue-200 mb-2">Análisis Predictivo + Biométrico</p>
                <div className="flex items-center justify-center gap-4 text-xs text-blue-300">
                    {/* <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>IA Generativa</span>
                            </div> */}
                    {/* <div className="flex items-center gap-2">
                                <Target className="w-3 h-3" />
                                <span>Predicción Automática</span>
                            </div> */}
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        <span>Análisis Demógrafico y Biométrico</span>
                    </div>
                </div>
            </div>
        </div>

    )
}
