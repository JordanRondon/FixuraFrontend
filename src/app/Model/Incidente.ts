export class Incidente {
    id_incidencia: number;
    fecha_publicacion: Date;
    descripcion: string;
    ubicacion: string;
    imagen: string;
    total_votos: number;
    id_estado: number;
    dni: string;
    id_categoria: number;
    latitud: number;
    longitud: number; 

    constructor(
        id_incidencia: number, fecha_publicacion: Date, descripcion: string,
        ubicacion: string, imagen: string, total_votos: number, id_estado: number,
        dni: string, id_categoria: number, latitud: number, longitud: number
    ) {
        this.id_incidencia = id_incidencia;
        this.fecha_publicacion = fecha_publicacion;
        this.descripcion = descripcion;
        this.ubicacion = ubicacion;
        this.imagen = imagen;
        this.total_votos = total_votos;
        this.id_estado = id_estado;
        this.dni = dni;
        this.id_categoria = id_categoria;
        this.latitud = latitud;
        this.longitud = longitud;
    }
}