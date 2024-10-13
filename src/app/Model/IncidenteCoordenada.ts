export class IncidenteCoordenada {
    id_incidencia: number;
    latitud: number;
    longitud: number; 

    constructor(
        id_incidencia: number, latitud: number, longitud: number
    ) {
        this.id_incidencia = id_incidencia;
        this.latitud = latitud;
        this.longitud = longitud;
    }
}