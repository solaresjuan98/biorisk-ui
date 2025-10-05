export const getDecisionColor = (decision: string) => {
    return decision === "NO_MORA" ? "text-emerald-600" : "text-red-600";
};

export const getDecisionBg = (decision: string) => {
    return decision === "NO_MORA" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200";
};

export const getConfidenceColor = (level: string) => {
    switch (level) {
        case 'Alto': return 'text-green-600 bg-green-50';
        case 'Medio': return 'text-yellow-600 bg-yellow-50';
        case 'Bajo': return 'text-gray-600 bg-gray-50';
        default: return 'text-gray-600 bg-gray-50';
    }
};

export const getInsightBg = (type: string) => {
    switch (type) {
        case 'warning': return "bg-amber-50 border-amber-200 text-amber-800";
        case 'success': return "bg-emerald-50 border-emerald-200 text-emerald-800";
        case 'info': return "bg-blue-50 border-blue-200 text-blue-800";
        case 'insight': return "bg-purple-50 border-purple-200 text-purple-800";
        case 'alert': return "bg-red-50 border-red-200 text-red-800";
        default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
};

export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high': return 'bg-red-100 text-red-700';
        case 'medium': return 'bg-yellow-100 text-yellow-700';
        case 'low': return 'bg-blue-100 text-blue-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};