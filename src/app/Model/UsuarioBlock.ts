export class UsuarioBlock {
  dni : string;
  nombre : string;
  apellido : string;
  correo: string;
  fotoPerfil : string;

  constructor(
    dni : string,
    nombre : string,
    apellido : string,
    correo: string,
    fotoPerfil : string
  ){
    this.dni = dni;
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.fotoPerfil = fotoPerfil;
  }
}