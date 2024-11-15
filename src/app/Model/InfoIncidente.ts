export class InfoIncidente {
    id_incidencia: number;
    fecha_publicacion: Date;
    descripcion: string;
    ubicacion: string;
    imagen: string;
    total_votos: number;
    estado: string;
    usuarioFirstName: string;
    usuarioLastName: string;
    usuario_foto: string;
    categoria: string;
    latitud: number;
    longitud: number;
    tiene_like: Boolean;

    constructor(
        id_incidencia: number,
        fecha_publicacion: Date,
        descripcion: string,
        ubicacion: string,
        imagen: string,
        total_votos: number,
        estado: string,
        usuarioFirstName: string,
        usuarioLastName: string,
        usuario_foto: string,
        categoria: string,
        latitud: number,
        longitud: number,
        tienen_like: Boolean
    ) {
        this.id_incidencia = id_incidencia;
        this.fecha_publicacion = fecha_publicacion;
        this.descripcion = descripcion;
        this.ubicacion = ubicacion;
        this.imagen = imagen;
        this.total_votos = total_votos;
        this.estado = estado;
        this.usuarioFirstName = usuarioFirstName;
        this.usuarioLastName = usuarioLastName;
        this.usuario_foto = usuario_foto;
        this.categoria = categoria;
        this.latitud = latitud;
        this.longitud = longitud;
        this.tiene_like = tienen_like;
    }
}
