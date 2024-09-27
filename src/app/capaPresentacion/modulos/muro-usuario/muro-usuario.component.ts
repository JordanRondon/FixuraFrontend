import { Component, OnInit } from '@angular/core';
import { NavbarUsuarioComponent } from '../../componentes/navbar-usuario/navbar-usuario.component';
import { PostIncidenciaComponent } from '../../componentes/post-incidencia/post-incidencia.component';
import { CommonModule } from '@angular/common';
import { RegistroIncidenciaComponent } from '../../componentes/registro-incidencia/registro-incidencia.component';
import { IncidenteService } from '../../../Service/getIncidente/obtener-incidentes.service';
import { RegistroUsuariosService } from '../../../Service/registro-usuarios.service';
import { Incidente } from '../../../Model/Incidente';
import { Usuario } from '../../../Model/Usuario';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';

@Component({
  selector: 'app-muro-usuario',
  standalone: true,
  imports: [NavbarUsuarioComponent, PostIncidenciaComponent,RegistroIncidenciaComponent,CommonModule],
  templateUrl: './muro-usuario.component.html',
  styleUrl: './muro-usuario.component.css'
})

export default class MuroUsuarioComponent implements OnInit {
  
  mostrarFormulario: boolean = false;
  incidentes: Incidente[] = [];
  dataUsuario: Usuario | null  = null;

  constructor(
    private registerUserService: RegistroUsuariosService,
    private incidenteService: IncidenteService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getDataUserProfile();
    this.getIncidentesPorUsuario(this.authService.getToken_dni() ?? '');
  }

  abrirRegistroIncidencia() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  getDataUserProfile(): void {
    if(this.authService.isAuthenticated()) {
      this.registerUserService.getUserProfile().subscribe({
        next: (user: Usuario) => {
          this.dataUsuario = user
          console.log('Datos del usuario: ', this.dataUsuario)
        },
        error: (error) => {
          console.error('Error al obtener el perfil de usuario', error);
        }
      });
    }
  }

  getIncidentesPorUsuario(DNI_usuario: string): void {
    this.incidenteService.getListaIncidencia(DNI_usuario).subscribe(
      (data: Incidente[]) => {
        this.incidentes = data;
        console.log(this.incidentes);
      },
      (error) => {
        console.error('Error al obtener los incidentes:', error);
      }
    );
  }
}
