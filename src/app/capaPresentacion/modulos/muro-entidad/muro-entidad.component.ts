import { Component, OnInit } from '@angular/core';
import { NavbarUsuarioComponent } from '../../componentes/navbar-usuario/navbar-usuario.component';
import { PostIncidenciaComponent } from '../../componentes/post-incidencia/post-incidencia.component';
import { RegistroIncidenciaComponent } from '../../componentes/registro-incidencia/registro-incidencia.component';
import { CommonModule } from '@angular/common';
import { Incidente } from '../../../Model/Incidente';
import { Usuario } from '../../../Model/Usuario';
import { UsuariosService } from '../../../Service/Usuarios/usuarios.service';
import { IncidenciaService } from '../../../Service/Incidencia/incidencia.service';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';
import { InfoIncidente } from '../../../Model/InfoIncidente';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Page } from '../../../Model/Page';
import { DepartamentoService } from '../../../Service/Departamento/departamento.service';
import { ImageModalComponent } from '../../componentes/image-modal/image-modal.component';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { NotificacionesService } from 'app/Service/Notificaciones/notificaciones.service';

@Component({
  selector: 'app-muro-entidad',
  standalone: true,
  imports: [NavbarUsuarioComponent, PostIncidenciaComponent,RegistroIncidenciaComponent,CommonModule, InfiniteScrollModule, ImageModalComponent, AlertComponent],
  templateUrl: './muro-entidad.component.html',
  styleUrls: ['./muro-entidad.component.css']
})
export default class MuroEntidadComponent implements OnInit {
  mostrarFormulario: boolean = false;
  // incidentes: Incidente[] = [];
  // User: { [dni: string]: String } = {};
  dataUsuario: Usuario | null  = null;
  nameMunicipalidad: String = '';

  selectedImage: string = '';
  isModalActive: boolean = false;

  listIncidentes: InfoIncidente[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 10;
  
  loading: boolean = false;
  listDistritoCoordenadas: {id_coordenada: number, latitud: number, longitud: number}[] = [];

  incomplete: boolean = false;

  constructor(
    private registerUserService: UsuariosService,
    private departamentoService: DepartamentoService,
    private incidenteService: IncidenciaService,
    private authService: AuthService,
    private notificationService: NotificacionesService,
  ) { }

  ngOnInit(): void {
    this.getDataUserProfile();
    this.refreshIncidentes();
  }

  refreshIncidentes(){
    this.notificationService.getIncidentUpdates().subscribe(() => {
      this.resetVarsPage();
      this.loadIncidentes();  
    });
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
          this.getNameDistrito(user.idDist);
          this.loadIncidentes()
          this.loadDistrito_Coordenadas(this.dataUsuario.idDist);
        },
        error: (error) => {
          console.error('Error al obtener el perfil de usuario', error);
        }
      });
    }
  }

  resetVarsPage(): void {
    this.listIncidentes = [];
    this.totalElements = 0;
    this.page = 0;
    this.size = 10;
    this.loading = false;
  }

  loadIncidentes(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.incidenteService.getListIncidenciaUsuarioDistrito(this.page, this.size, this.authService.getToken_dni() ?? '', this.dataUsuario?.idDist ?? -1).subscribe({
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

  getNameDistrito(id_distrito: number): void {
    this.departamentoService.getNameDistrito(id_distrito).subscribe({
      next: (distrito: any) => {
        this.nameMunicipalidad = 'Municipalidad de ' + distrito.nombre;
      },
      error: (error) => {
        console.error('Error al cargar nombre de Distrito:', error);
      }
    });
  }
  loadDistrito_Coordenadas(id_distrito: number): void {
    
    this.departamentoService.getDistrito_Coordenads(id_distrito).subscribe(resp => {
      if (resp) {
        console.log(resp)
        this.listDistritoCoordenadas = resp;
        console.log("Datos asignados a listDistritoCoordenadas:", this.listDistritoCoordenadas);
      }
    });
  }
  // getIncidentesMunicipalidad(id_distrito: number): void {
  //   this.incidenteService.getListaIncidenciaMunicipalidad(id_distrito).subscribe(
  //     (data: Incidente[]) => {
  //       this.incidentes = data;
  //       console.log(this.incidentes);
  //       this.getNameUserIncidencia(this.incidentes);
  //     },
  //     (error) => {
  //       console.error('Error al obtener los incidentes:', error);
  //     }
  //   );
  // }

  // getNameUserIncidencia(listIncidencia: Incidente[]): void {
  //   for(let incidencia of listIncidencia) {
  //     this.incidenteService.getNameUserIncidencia(incidencia.id_incidencia).subscribe(nameUser => {
  //       this.User[incidencia.dni] = nameUser;
  //     });
  //   }
  // }
}
