

export const formatEstadoCivil = (estado: string) => {
    switch (estado) {
        case 'S': return 'Soltero';
        case 'C': return 'Casado';
        case 'D': return 'Divorciado';
        case 'V': return 'Viudo';
        default: return estado;
    }
};