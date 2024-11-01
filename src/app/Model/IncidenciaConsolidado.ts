export class IncidenciaConsolidado {
    dni: string;
    id_incidencia: number;
    hour_consolidado: Date;

    constructor(
        dni: string,
        id_incidencia: number,
        hour_consolidado: Date
    ) {
        this.dni = dni;
        this.id_incidencia = id_incidencia;
        this.hour_consolidado = hour_consolidado;
    }
}