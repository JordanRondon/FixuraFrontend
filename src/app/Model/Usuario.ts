export class Usuario {
  nombre : string;
  dni : string;
  correo : string;
  contrasenia : string;
  fotoPerfil : string;
  tiempo_ban : Date;
  id_rol : number;
  idDist : number;

  constructor(
      nombre : string,
      dni : string,
      correo : string,
      contrasenia : string,
      fotoPerfil : string,
      tiempo_ban : Date,
      id_rol : number,
      idDist : number
  ) {
      this.nombre = nombre;
      this.dni = dni;
      this.correo = correo;
      this.contrasenia = contrasenia;
      this.fotoPerfil = fotoPerfil;
      this.tiempo_ban = tiempo_ban;
      this.id_rol = id_rol;
      this.idDist = idDist;
  }
}