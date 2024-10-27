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
import { InfoIncidente } from '../../../Model/InfoIncidente';
import { Page } from '../../../Model/Page';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DepartamentoService } from '../../../Service/Departamento/departamento.service';
import { ImageModalComponent } from '../../componentes/image-modal/image-modal.component';

@Component({
  selector: 'app-muro-administrador',
  standalone: true,
  imports: [
    CommonModule,
    BlockUsersComponent,
    NavbarUsuarioComponent,
    PostIncidenciaComponent,
    MapaIncidenciasComponent,
    InfiniteScrollModule,
    ImageModalComponent
  ],
  templateUrl: './muro-administrador.component.html',
  styleUrl: './muro-administrador.component.css'
})
export default class MuroAdministradorComponent implements OnInit{
  
  mostrarHerramientas: boolean = true;
  // incidentes: Incidente[] = [];
  // User: { [dni: string]: String } = {};
  mostrarMapaIncidencias = false;
  dataUsuario: Usuario | undefined;
  nameMunicipalidad: String = '';

  selectedImage: string = '';
  isModalActive: boolean = false;

  listIncidentes: InfoIncidente[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 10;
  loading: boolean = false;

  constructor(
    private registerUserService: UsuariosService,
    private departamentoService: DepartamentoService,
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
          this.getNameDistrito(user.idDist);
          this.loadIncidentes();
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

    this.incidenteService.getListIncidenciaDistrito(this.page, this.size, this.dataUsuario?.idDist ?? -1).subscribe({
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
