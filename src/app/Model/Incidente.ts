export class Incidente {
    id_incidente: number;
    fecha_publicacion: Date;
    descripcion: string;
    ubicacion: string;
    imagen: string;
    total_votos: number;
    id_estado: number;
    DNI_usuario: string;
    id_categoria: number;

    constructor(
        id_incidente: number, fecha_publicacion: Date, descripcion: string,
        ubicacion: string, imagen: string, total_votos: number, id_estado: number,
        DNI_usuario: string, id_categoria: number
    ) {
        this.id_incidente = id_incidente;
        this.fecha_publicacion = fecha_publicacion;
        this.descripcion = descripcion;
        this.ubicacion = ubicacion;
        this.imagen = imagen;
        this.total_votos = total_votos;
        this.id_estado = id_estado;
        this.DNI_usuario = DNI_usuario;
        this.id_categoria = id_categoria
    }
}