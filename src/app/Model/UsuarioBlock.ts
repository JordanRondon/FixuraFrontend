export class UsuarioBlock {
  dni : string;
  nombre : string;
  apellido : string;
  correo: string;
  foto_perfil : string;

  constructor(
    dni : string,
    nombre : string,
    apellido : string,
    correo: string,
    foto_perfil : string
  ){
    this.dni = dni;
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.foto_perfil = foto_perfil;
  }
}