import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarUsuarioComponent } from '../../componentes/navbar-usuario/navbar-usuario.component';
import { PostIncidenciaComponent } from '../../componentes/post-incidencia/post-incidencia.component';
import { Incidente } from '../../../Model/Incidente';
import { Usuario } from '../../../Model/Usuario';
import { UsuariosService } from '../../../Service/Usuarios/usuarios.service';
import { IncidenciaService } from '../../../Service/Incidencia/incidencia.service';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';

@Component({
  selector: 'app-muro-administrador',
  standalone: true,
  imports: [CommonModule,NavbarUsuarioComponent,PostIncidenciaComponent],
  templateUrl: './muro-administrador.component.html',
  styleUrl: './muro-administrador.component.css'
})
export default class MuroAdministradorComponent implements OnInit{
  
  mostrarHerramientas: boolean = true;
  incidentes: Incidente[] = [];
  User: { [dni: string]: String } = {};
  dataUsuario: Usuario | undefined;

  constructor(
    private registerUserService: UsuariosService,
    private incidenteService: IncidenciaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getDataUserProfile();
  }


  toggleHerramientas(){
    console.log('Desplegando herramientas');
    this.mostrarHerramientas = !this.mostrarHerramientas;
  }

  getDataUserProfile(): void {
    if(this.authService.isAuthenticated()) {
      this.registerUserService.getUserProfile().subscribe({
        next: (user: Usuario) => {
          this.dataUsuario = user
          console.log('Datos del usuario: ', this.dataUsuario)
          this.getIncidentesMunicipalidad(this.dataUsuario?.idDist ?? -1);
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
}
