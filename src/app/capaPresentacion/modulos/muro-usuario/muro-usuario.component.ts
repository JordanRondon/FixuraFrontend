import { Component, OnInit } from '@angular/core';
import { NavbarUsuarioComponent } from '../../componentes/navbar-usuario/navbar-usuario.component';
import { PostIncidenciaComponent } from '../../componentes/post-incidencia/post-incidencia.component';
import { CommonModule } from '@angular/common';
import { RegistroIncidenciaComponent } from '../../componentes/registro-incidencia/registro-incidencia.component';
import { IncidenciaService } from '../../../Service/Incidencia/incidencia.service';
import { UsuariosService } from '../../../Service/Usuarios/usuarios.service';
import { Incidente } from '../../../Model/Incidente';
import { Usuario } from '../../../Model/Usuario';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';
import { InfoIncidente } from '../../../Model/InfoIncidente';
import { Page } from '../../../Model/Page';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ImageModalComponent } from '../../componentes/image-modal/image-modal.component';

@Component({
  selector: 'app-muro-usuario',
  standalone: true,
  imports: [
    NavbarUsuarioComponent,
    PostIncidenciaComponent,
    RegistroIncidenciaComponent,
    CommonModule,
    InfiniteScrollModule,
    ImageModalComponent
  ],
  templateUrl: './muro-usuario.component.html',
  styleUrl: './muro-usuario.component.css'
})

export default class MuroUsuarioComponent implements OnInit {
  
  mostrarFormulario: boolean = false;
  // incidentes: Incidente[] = [];
  dataUsuario: Usuario | null  = null;

  selectedImage: string = '';
  isModalActive: boolean = false;

  listIncidentes: InfoIncidente[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 10;
  loading: boolean = false;

  constructor(
    private registerUserService: UsuariosService,
    private incidenteService: IncidenciaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getDataUserProfile();
    //this.getIncidentesPorUsuario(this.authService.getToken_dni() ?? '');
    this.loadIncidentes();
  }

  abrirRegistroIncidencia() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  openImageModal(image: string): void {
    this.selectedImage = image;
    this.isModalActive = true;
  }

  closeImageModal(): void {
    this.isModalActive = false;
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

  loadIncidentes(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.incidenteService.getListIncidenciaUsuario(this.page, this.size, this.authService.getToken_dni() ?? '').subscribe({
      next: (response: Page<InfoIncidente>) => {
        this.listIncidentes = [...this.listIncidentes, ...response.content];// Añadir más incidencias
        this.totalElements = response.totalElements;
        this.page += 1;  // Incrementar la página para la siguiente carga
        console.log('Incidentes cargados:', this.listIncidentes);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar incidentes:', error);
        this.loading = false;
      }
    });
  }

  onScroll(): void {
    this.loadIncidentes();
  }

  // getIncidentesPorUsuario(DNI_usuario: string): void {
  //   this.incidenteService.getListaIncidencia(DNI_usuario).subscribe(
  //     (data: Incidente[]) => {
  //       this.incidentes = data;
  //       console.log(this.incidentes);
  //     },
  //     (error) => {
  //       console.error('Error al obtener los incidentes:', error);
  //     }
  //   );
  // }
}
