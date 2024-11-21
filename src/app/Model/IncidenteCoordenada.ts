export class IncidenteCoordenada {
    id_incidencia: number;
    latitud: number;
    longitud: number; 
    id_categoria: number;
    constructor(
        id_incidencia: number, latitud: number, longitud: number,id_categoria: number
    ) {
        this.id_incidencia = id_incidencia;
        this.latitud = latitud;
        this.longitud = longitud;
        this.id_categoria = id_categoria;
    }
}