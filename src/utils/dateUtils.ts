export const calcularEdad = (fechaNacimiento: string): number => {
    const [dia, mes, año] = fechaNacimiento.split('/').map(Number);
    const nacimiento = new Date(año, mes - 1, dia);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();

    if (mesActual < (mes - 1) || (mesActual === (mes - 1) && diaActual < dia)) {
        edad--;
    }

    return edad;
};

// export const formatDate = (date: string | Date): string => {
//     // Función para formatear fechas
// };

// export const getDateDifference = (date1: string, date2: string): number => {
//     // Función para calcular diferencia entre fechas
// };

// export const isValidDate = (dateString: string): boolean => {
//     // Validar formato de fecha
// };