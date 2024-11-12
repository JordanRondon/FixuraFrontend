import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe} from '@angular/common';
import { NavbarUsuarioComponent } from '../../componentes/navbar-usuario/navbar-usuario.component';
import { PostIncidenciaComponent } from '../../componentes/post-incidencia/post-incidencia.component';
import { Usuario } from '../../../Model/Usuario';
import { UsuariosService } from '../../../Service/Usuarios/usuarios.service';
import { IncidenciaService } from '../../../Service/Incidencia/incidencia.service';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';
import { MapaIncidenciasComponent } from '../../componentes/mapa-incidencias/mapa-incidencias.component';
import { InfoIncidente } from '../../../Model/InfoIncidente';
import { Page } from '../../../Model/Page';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DepartamentoService } from '../../../Service/Departamento/departamento.service';
import { ImageModalComponent } from '../../componentes/image-modal/image-modal.component';
import { BlockUsersComponent } from "../../componentes/block-users/block-users.component";
import { UsuarioBlock } from 'app/Model/UsuarioBlock';
import { FormControl, ReactiveFormsModule, ValueChangeEvent } from '@angular/forms';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { MatOption } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { IncidenciaConsolidadoService } from 'app/Service/IncidenciaConsolidado/incidencia-consolidado.service';
import { IncidenciaConsolidado } from 'app/Model/IncidenciaConsolidado';
import { DialogService } from 'app/Service/Dialog/dialog.service';
import { NotificacionesService } from 'app/Service/Notificaciones/notificaciones.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-muro-administrador',
  standalone: true,
  imports: [
    CommonModule,
    NavbarUsuarioComponent,
    PostIncidenciaComponent,
    MapaIncidenciasComponent,
    InfiniteScrollModule,
    ImageModalComponent,
    BlockUsersComponent,
    MatOption,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    AsyncPipe,
    AlertComponent,
    ToastrModule,
    MatIconModule,
    MatMenu,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './muro-administrador.component.html',
  styleUrl: './muro-administrador.component.css',
})
export default class MuroAdministradorComponent implements OnInit, OnDestroy {
  mostrarHerramientas: boolean = true;
  // incidentes: Incidente[] = [];
  // User: { [dni: string]: String } = {};
  usuarios: UsuarioBlock[] = [];

  control = new FormControl('');
  usuariosFiltrados: UsuarioBlock[] = [];

  mostrarMapaIncidencias = false;
  dataUsuario: Usuario | undefined;
  vistaActiva: string = 'perfil';

  nameMunicipalidad: String = '';
  imageMuniciapalidad: String = '';

  selectedImage: string = '';
  isModalActive: boolean = false;
  mostrarIncidencias: boolean = true;
  mostrarBloquearUsuarios: boolean = false;
  isExpanded: boolean = false;

  listIncidentes: InfoIncidente[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 10;
  loading: boolean = false;
  listDistritoCoordenadas: {
    id_coordenada: number;
    latitud: number;
    longitud: number;
  }[] = [];
  listIncidentesMasVotados: InfoIncidente[] = [];
  existUser: boolean = false;
  existIncidentes: boolean = false;
  notificaciones: String[] = [];
  notificacionesCount: number = 0;

  constructor(
    private registerUserService: UsuariosService,
    private departamentoService: DepartamentoService,
    private incidenteService: IncidenciaService,
    private incConsolidadoService: IncidenciaConsolidadoService,
    private authService: AuthService,
    private dialogService: DialogService,
    private notificacionesService: NotificacionesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    
    //localStorage.clear();

    this.getDataUserProfile();

    this.subscribeToNotifications();

    this.notificaciones = this.getFromLocalStorage('notificaciones', []);
    this.notificacionesCount = this.getFromLocalStorage('notificaiones-count', 0);

    //this.refreshIncidentes();

    this.control.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      this.filtrarUsuarios(value || '');
    });
  }

  ngOnDestroy(): void {
    this.notificacionesService.disconnect();
  }

  private getFromLocalStorage(key: string, defaultValue: any): any {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  }

  subscribeToNotifications(): void {
    this.notificacionesService.getMessage().subscribe((message) => {
      if (this.notificaciones.length === 5) {
        this.notificaciones.shift();
      }

      this.notificaciones.push(message);
      this.notificacionesCount++;
      
      this.updateLocalStorage();
      this.showToast(message);
    });
  }

  private updateLocalStorage(): void {
    localStorage.setItem('notificaciones', JSON.stringify(this.notificaciones));
    localStorage.setItem('notificaiones-count', JSON.stringify(this.notificacionesCount));
  }

  resetCount():void{
    this.notificacionesCount = 0;
    this.updateLocalStorage();
  }

  private showToast(message: string): void {
    this.toastr.info(message, 'Notificación', {
      closeButton: true,
      timeOut: 4000,
      extendedTimeOut: 1000,
      easeTime: 300,
      progressBar: true,
      positionClass: 'toast-bottom-right'
    });
  }

  refreshIncidentes(): void{
    this.notificacionesService.getIncidentUpdates().subscribe(() => {
      this.resetVarsPage();
      this.loadIncidentes();  
    });
  }

  mostrarPerfil() {
    this.vistaActiva = 'perfil';
    this.resetVarsPage();
    this.loadIncidentes();
  }
  mostrarMapa() {
    this.vistaActiva = 'mapa';
  }
  mostrarUsuarios() {
    this.vistaActiva = 'usuarios';
    this.getUsuariosMunicipalidad(this.dataUsuario?.idDist??-1);
  }

  mostrarConsolidacion() {
    this.vistaActiva = 'consolidacion';
    this.resetVarsPage();
    this.loadConsolidado();
  }

  openInput() {
    this.isExpanded = !this.isExpanded;
  }

  toggleHerramientas() {
    console.log('Desplegando herramientas');
    this.mostrarHerramientas = !this.mostrarHerramientas;
  }

  openImageModal(image: string): void {
    this.selectedImage = image;
    this.isModalActive = true;
  }

  closeImageModal(): void {
    this.isModalActive = false;
  }

  getDataUserProfile(): void {
    if (this.authService.isAuthenticated()) {
      this.registerUserService.getUserProfile().subscribe({
        next: (user: Usuario) => {
          this.dataUsuario = user;
          console.log('Datos del usuario: ', this.dataUsuario);
          this.getNameDistrito(user.idDist);
          this.loadIncidentes();
          this.loadDistrito_Coordenadas(this.dataUsuario.idDist);
        },
        error: (error) => {
          console.error('Error al obtener el perfil de usuario', error);
        },
      });
    }
  }

  loadIncidentes(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.incidenteService
      .getListIncidenciaDistrito(
        this.page,
        this.size,
        this.dataUsuario?.idDist ?? -1
      )
      .subscribe({
        next: (response: Page<InfoIncidente>) => {
          this.listIncidentes = [...this.listIncidentes, ...response.content]; // Añadir más incidencias
          this.totalElements = response.totalElements;
          this.page += 1; // Incrementar la página para la siguiente carga
          console.log('Incidentes cargados:', this.listIncidentes);
          this.loading = false;
          this.existIncidentes = true;
        },
        error: (error) => {
          console.error('Error al cargar incidentes:', error);
          this.loading = false;
        },
      });
  }

  loadConsolidado(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.incidenteService
      .getListConsolidadoDistrito(
        this.page,
        this.size,
        this.dataUsuario?.idDist ?? -1
      )
      .subscribe({
        next: (response: Page<InfoIncidente>) => {
          this.listIncidentes = [...this.listIncidentes, ...response.content]; // Añadir más incidencias
          this.totalElements = response.totalElements;
          this.page += 1; // Incrementar la página para la siguiente carga
          console.log('Consolidados cargados:', this.listIncidentes);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar incidentes:', error);
          this.loading = false;
        },
      });
  }

  onScroll(): void {
    if (this.vistaActiva === 'masVotadas') {
      return; // No cargar más incidencias originales
    }
    this.loadIncidentes();
  }

  getNameDistrito(id_distrito: number): void {
    this.departamentoService.getNameDistrito(id_distrito).subscribe({
      next: (distrito: any) => {
        this.nameMunicipalidad = 'Municipalidad de ' + distrito.nombre;
        this.imageMuniciapalidad = distrito.foto_perfil;
      },
      error: (error) => {
        console.error('Error al cargar nombre de Distrito:', error);
      },
    });
  }
  loadDistrito_Coordenadas(id_distrito: number): void {
    this.departamentoService
      .getDistrito_Coordenads(id_distrito)
      .subscribe((resp) => {
        if (resp) {
          console.log(resp);
          this.listDistritoCoordenadas = resp;
          console.log(
            'Datos asignados a listDistritoCoordenadas:',
            this.listDistritoCoordenadas
          );
        }
      });
  }

  getUsuariosMunicipalidad(id_distrito: number): void {
    this.incidenteService.getListaUsuariosMunicipalidad(id_distrito).subscribe({
      next: (result: UsuarioBlock[]) => {
        this.usuarios = result;
        this.usuariosFiltrados = result;
        this.getDataUsuarios(this.usuarios);
        this.existUser = true;
      },
      error: (error) => {
        console.error('Error al obtener a los usuarios:', error);
      },
    });
  }

  getDataUsuarios(listUsuarios: UsuarioBlock[]): void {
    listUsuarios.map((usuario) => ({
      dni: usuario.dni,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      fotoPerfil: usuario.fotoPerfil,
    }));
  }

  filtrarUsuarios(nombre: string): void {
    this.usuariosFiltrados = this.usuarios.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  resetVarsPage(): void {
    this.listIncidentes = [];
    this.totalElements = 0;
    this.page = 0;
    this.size = 10;
    this.loading = false;
  }

  saveConsolidadoIncidencia(id_incidencia: number): void {
    const incidenciaConsolidado = new IncidenciaConsolidado(
      this.authService.getToken_dni() ?? '',
      id_incidencia,
      new Date()
    );

    this.incConsolidadoService
      .insertIncidenciaConsolidado(incidenciaConsolidado)
      .subscribe({
        error: (error) => {
          console.error('Error al obtener a los usuarios:', error);
        },
      });
  }

  openDialog(id_incidencia: number): void {
    this.dialogService.openDialog(
      {
        tipo: 'Agregar Consolidado',
        titulo: '¿Estás seguro de consolidar esta incidencia?',
      },
      () => this.saveConsolidadoIncidencia(id_incidencia)
    );
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
  aplicarFiltroMasVotados(): void {
    this.vistaActiva = 'masVotadas';
    this.page = 0;
    this.listIncidentes = [];

    this.loading = true;
    this.incidenteService
      .getIncidentesMasVotados(
        this.page,
        this.size,
        this.dataUsuario?.idDist ?? -1
      )
      .subscribe({
        next: (response: Page<InfoIncidente>) => {
          this.listIncidentes = [...this.listIncidentes, ...response.content];
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error incidencias mas votadas:', error.message, error);
          this.loading = false;
        },
      });
  }
}
