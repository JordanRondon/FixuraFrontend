export class IncidenciaLike {
    dni: string;
    id_incidencia: number;
    hour_liked: Date;

    constructor(
        dni: string,
        id_incidencia: number,
        hour_liked: Date
    ) {
        this.dni = dni;
        this.id_incidencia = id_incidencia;
        this.hour_liked = hour_liked;
    }
}