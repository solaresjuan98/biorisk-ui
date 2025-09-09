export interface AIInsight {
    id: number;
    type: string;
    message: string;
    confidence: number;
    category: string;
    icon: React.ReactNode;
    priority: 'high' | 'medium' | 'low';
    processing_step?: string;
}