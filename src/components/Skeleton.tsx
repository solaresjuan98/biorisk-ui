
export const Skeleton = () => {
    return (
        <>

            <div className="space-y-6 animate-pulse">
                {/* Header Skeleton */}
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
                        <div className="h-8 w-2/3 bg-white/30 rounded mb-3"></div>
                        <div className="h-4 w-1/3 bg-white/30 rounded mb-1"></div>
                        <div className="h-4 w-1/4 bg-white/30 rounded"></div>
                    </div>
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Foto skeleton */}
                        <div className="lg:col-span-1">
                            <div className="w-full h-80 bg-gray-200 rounded-xl"></div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className="h-14 bg-gray-200 rounded"></div>
                                <div className="h-14 bg-gray-200 rounded"></div>
                                <div className="h-14 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        {/* Panel principal skeleton */}
                        <div className="lg:col-span-3 space-y-4">
                            <div className="h-24 bg-gray-200 rounded"></div>
                            <div className="h-36 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Bloques secundarios skeleton */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        </>
    )
}
