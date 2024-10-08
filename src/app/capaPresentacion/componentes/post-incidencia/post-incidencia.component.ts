import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import { Incidente } from '../../../Model/Incidente';
import { es } from 'date-fns/locale';
import { IncidenciaLikeService } from '../../../Service/IncidenciaLike/incidencia-like.service';
import { IncidenciaLike } from '../../../Model/IncidenciaLike';
import { IncidenciaService } from '../../../Service/Incidencia/incidencia.service';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';
import { AdminModeratorDirective } from '../../../Auth/Directive/admin-moderator.directive';
import { CommonUserDirective } from '../../../Auth/Directive/common-user.directive';
import { EditIncidenciaComponent } from '../editar-incidencia/edit-incidencia/edit-incidencia.component';
import { CategoriaService } from '../../../Service/Categoria/categoria.service';
import { Categoria } from '../../../Model/Categoria';

@Component({
  selector: 'app-post-incidencia',
  standalone: true,
  imports: [
    CommonModule,
    EditIncidenciaComponent,
    AdminModeratorDirective,
    CommonUserDirective
  ],
  templateUrl: './post-incidencia.component.html',
  styleUrls: ['./post-incidencia.component.css']
})

export class PostIncidenciaComponent implements OnInit, OnChanges {
  
  showFormEdit: boolean = false;
  
  @Input() incidente: Incidente | undefined;
  incidenteCopy: Incidente | undefined;
  @Input() nombreUsuario: String | undefined;
  isActive: boolean = false;
  incidenciaLike: IncidenciaLike = { 
    dni: '',
    id_incidencia: -1,
    hour_liked: new Date()
  };
  categoryName: string='';

  constructor(
    private incidenciaLikeService: IncidenciaLikeService,
    private incidenciaService: IncidenciaService,
    private authService: AuthService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    if (this.incidente) {
      this.incidenteCopy = JSON.parse(JSON.stringify(this.incidente)); 
      this.incidenciaLike = {
        dni: this.authService.getToken_dni() ?? '',
        id_incidencia: this.incidente.id_incidencia ?? -1,
        hour_liked: new Date()
      };
      if (this.authService.getToken_Id_rol != null && this.authService.getToken_Id_rol() === 3) {
        // si el rol es usuario entonces verificar que se dio like a la incidencia
        this.isLike(this.incidenciaLike);
      }

      this.getNameCategory(this.incidente.id_categoria);
      this.getVotos(this.incidente.id_incidencia);
    }
  }

  ngOnChanges(changes: SimpleChanges) { }
    

  toggleActiveFormEdit() {
    this.showFormEdit = !this.showFormEdit;
  }

  closeFormEdit(event: MouseEvent) {
    // Verificar si el clic fue dentro de 'app-edit-incidencia'
    const target = event.target as HTMLElement;
    if (target.closest('app-edit-incidencia') === null) {
      this.showFormEdit = false; // Cierra el formulario si se hace clic fuera
    }
  }

  toggleActive() {
    if (this.isActive) this.setDeleteLike(this.incidenciaLike);
    else this.setInsertLike(this.incidenciaLike);

    this.isActive = !this.isActive;
  }

  formatearFecha(fecha?: Date): string {
    if (fecha) 
      return format(fecha, "d 'de' MMMM 'del' yyyy, 'a las' hh:mm a", { locale: es });
    else
      return "Sin Información"
  }

  setInsertLike(incidenciaLike: IncidenciaLike): void {
    this.incidenciaLikeService.insertLike(incidenciaLike).subscribe(
      (respuesta) => {
        console.log('Like REGISTRADO correctamente:', respuesta);
        if (this.incidente)
          this.getVotos(this.incidente.id_incidencia);
      },
      (error) => {
        console.error('ERROR al REGISTRAR el Like:', error);
        this.isActive = false;
      }
    );
  }

  setDeleteLike(incidenciaLike: IncidenciaLike): void {
    this.incidenciaLikeService.deleteLike(incidenciaLike).subscribe(
      (respuesta) => {
        console.log('Like ELIMINADO correctamente:', respuesta);
        if (this.incidente)
          this.getVotos(this.incidente.id_incidencia);
      },
      (error) => {
        console.error('ERROR al ELIMINAR el Like:', error);
        this.isActive = true;
      }
    );
  }

  isLike(incidenciaLike: IncidenciaLike): void {
    this.incidenciaLikeService.thaLike(incidenciaLike).subscribe(
      (respuesta) => {
        this.isActive = respuesta;
      },
      (error) => {
        console.error('ERROR al VERIFICAR el Like:', error);
      }
    );
  }

  getVotos(id_incidencia: number): void {
    this.incidenciaService.getTotalVotos(id_incidencia).subscribe(
      (totalVotos: number) => {
        if (this.incidente) {
          this.incidente.total_votos = totalVotos;
        }
      },
      (error) => {
        console.error('ERROR al OBTENER total de votos:', error);
      }
    );
  }

  deleteIncidencia(): void {
    if(this.incidente) {
      const confirmacion = window.confirm('¿Estás seguro que quieres eliminar esta incidencia?');
      if(confirmacion) {
        this.incidenciaService.deleteIncidencia(this.incidente.id_incidencia).subscribe(
          response => {
            console.log('Incidente eliminado correctamente:', response);
          }
        );
      }
    }
  }

  getNameCategory(id_category: number): void{
    this.categoriaService.getNameCategory(id_category).subscribe(
      (category: Categoria) => {
        this.categoryName = category.nombre;
      },
      (error) => {
        console.error('ERROR al OBTENER nombre de Categoria:', error);
      }
    );
  }
}