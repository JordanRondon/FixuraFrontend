import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarUsuarioComponent } from '../../componentes/navbar-usuario/navbar-usuario.component';
import { PostIncidenciaComponent } from '../../componentes/post-incidencia/post-incidencia.component';
import { Incidente } from '../../../Model/Incidente';
import { Usuario } from '../../../Model/Usuario';
import { UsuariosService } from '../../../Service/Usuarios/usuarios.service';
import { IncidenciaService } from '../../../Service/Incidencia/incidencia.service';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';
import { MapaIncidenciasComponent } from '../../componentes/mapa-incidencias/mapa-incidencias.component';
import { BlockUsersComponent } from "../../componentes/block-users/block-users.component";
import { UsuarioBlock } from '../../../Model/UsuarioBlock';

@Component({
  selector: 'app-muro-administrador',
  standalone: true,
  imports: [CommonModule, NavbarUsuarioComponent, PostIncidenciaComponent, MapaIncidenciasComponent, BlockUsersComponent],
  templateUrl: './muro-administrador.component.html',
  styleUrl: './muro-administrador.component.css'
})
export default class MuroAdministradorComponent implements OnInit{
  
  mostrarHerramientas: boolean = true;
  incidentes: Incidente[] = [];
  usuarios: UsuarioBlock[] = [];
  User: { [dni: string]: String } = {};
  UserBlock: {} = {}
  mostrarMapaIncidencias = false;
  dataUsuario: Usuario | undefined;
  mostrarIncidencias: boolean = true;
  mostrarBloquearUsuarios: boolean = false;

  constructor(
    private registerUserService: UsuariosService,
    private incidenteService: IncidenciaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getDataUserProfile();
    
  }
  mostrarMapa() {
    this.mostrarMapaIncidencias = true;
  }

  toggleHerramientas(){
    console.log('Desplegando herramientas');
    this.mostrarHerramientas = !this.mostrarHerramientas;
  }
  
  toggleIncidencias(){
    this.mostrarIncidencias = true;
    this.mostrarBloquearUsuarios = false;
  }

  toggleBloquearUsuarios(){
    this.mostrarBloquearUsuarios = true;
    this.mostrarIncidencias = false;
  }

  getDataUserProfile(): void {
    if(this.authService.isAuthenticated()) {
      this.registerUserService.getUserProfile().subscribe({
        next: (user: Usuario) => {
          this.dataUsuario = user
          console.log('Datos del usuario: ', this.dataUsuario)
          this.getIncidentesMunicipalidad(this.dataUsuario?.idDist ?? -1);
          this.getUsuariosMunicipalidad(this.dataUsuario?.idDist ?? -1);
        },
        error: (error) => {
          console.error('Error al obtener el perfil de usuario', error);
        }
      });
    }
  }

  getIncidentesMunicipalidad(id_distrito: number): void {
    this.incidenteService.getListaIncidenciaMunicipalidad(id_distrito).subscribe(
      (data: Incidente[]) => {
        this.incidentes = data;
        console.log(this.incidentes);
        this.getNameUserIncidencia(this.incidentes);
      },
      (error) => {
        console.error('Error al obtener los incidentes:', error);
      }
    );
  }

  getNameUserIncidencia(listIncidencia: Incidente[]): void {
    for(let incidencia of listIncidencia) {
      this.incidenteService.getNameUserIncidencia(incidencia.id_incidencia).subscribe(nameUser => {
        this.User[incidencia.dni] = nameUser;
      });
    }
  }

  getUsuariosMunicipalidad(id_distrito: number): void {
    this.incidenteService.getListaUsuariosMunicipalidad(id_distrito).subscribe({
      next: (result: UsuarioBlock[]) => {
        this.usuarios = result;
        this.getDataUsuarios(this.usuarios);
      },
      error: (error) => {
        console.error('Error al obtener a los usuarios:', error);
      }
    });
  }

  getDataUsuarios(listUsuarios: UsuarioBlock[]): void {
    const usuariosData = listUsuarios.map(usuario => ({
      dni: usuario.dni,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      fotoPerfil: usuario.fotoPerfil
    }));
  }

}
