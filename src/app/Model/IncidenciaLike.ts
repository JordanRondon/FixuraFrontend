export class IncidenciaLike {
    dni: string;
    id_incidente: number;
    hour_liked: Date;

    constructor(
        dni: string,
        id_incidente: number,
        hour_liked: Date
    ) {
        this.dni = dni;
        this.id_incidente = id_incidente;
        this.hour_liked = hour_liked;
    }
}