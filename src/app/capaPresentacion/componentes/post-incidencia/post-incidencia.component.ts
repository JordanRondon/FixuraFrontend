import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
//import { Incidente } from '../../../Model/Incidente';
import { es } from 'date-fns/locale';
import { IncidenciaLikeService } from '../../../Service/IncidenciaLike/incidencia-like.service';
import { IncidenciaLike } from '../../../Model/IncidenciaLike';
import { IncidenciaService } from '../../../Service/Incidencia/incidencia.service';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';
import { AdminModeratorDirective } from '../../../Auth/Directive/admin-moderator.directive';
import { CommonUserDirective } from '../../../Auth/Directive/common-user.directive';
import { EditIncidenciaComponent } from '../editar-incidencia/edit-incidencia/edit-incidencia.component';
//import { CategoriaService } from '../../../Service/Categoria/categoria.service';
import { Categoria } from '../../../Model/Categoria';
import { InfoIncidente } from '../../../Model/InfoIncidente';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogService } from 'app/Service/Dialog/dialog.service';

@Component({
  selector: 'app-post-incidencia',
  standalone: true,
  imports: [
    CommonModule,
    EditIncidenciaComponent,
    AdminModeratorDirective,
    CommonUserDirective,
  ],
  templateUrl: './post-incidencia.component.html',
  styleUrls: ['./post-incidencia.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostIncidenciaComponent implements OnInit, OnChanges {
  showFormEdit: boolean = false;

  @Output() imagenClick: EventEmitter<string> = new EventEmitter<string>();
  @Input() infoIncidente: InfoIncidente | undefined;
  @Input() listDistritoCoordenadas: { id_coordenada: number, latitud: number, longitud: number }[] = [];
  editIncidenciaAbierto: boolean | undefined;
  @Input() bandMAPAINCIDENCIAS: boolean | undefined;
  infoIncidenteCopy: InfoIncidente | undefined;
  @Input() nombreUsuario: String | undefined;
  isActive: boolean = false;
  incidenciaLike: IncidenciaLike = {
    dni: '',
    id_incidencia: -1,
    hour_liked: new Date(),
  };
  categoryName: string = '';

  readonly dialog = inject(MatDialog);

  constructor(
    private incidenciaLikeService: IncidenciaLikeService,
    private incidenciaService: IncidenciaService,
    private authService: AuthService,
    private dialogService: DialogService
  ) //private categoriaService: CategoriaService
  {}

  ngOnInit(): void {
    if (this.infoIncidente) {
      if (this.infoIncidente.tiene_like) this.isActive = true;

      this.infoIncidenteCopy = JSON.parse(JSON.stringify(this.infoIncidente));

      this.incidenciaLike = {
        dni: this.authService.getToken_dni() ?? '',
        id_incidencia: this.infoIncidente.id_incidencia ?? -1,
        hour_liked: new Date(),
      };
    }
  }

  ngOnChanges(changes: SimpleChanges) {}

  toggleActiveFormEdit() {
    this.showFormEdit = !this.showFormEdit;
  }

  closeFormEdit(event: MouseEvent) {
    // Verificar si el clik fue dentro de 'app-edit-incidencia'
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
      return format(fecha, "d 'de' MMMM 'del' yyyy, 'a las' hh:mm a", {
        locale: es,
      });
    else return 'Sin Información';
  }

  setInsertLike(incidenciaLike: IncidenciaLike): void {
    this.incidenciaLikeService.insertLike(incidenciaLike).subscribe(
      (respuesta) => {
        console.log('Like REGISTRADO correctamente:', respuesta);
        if (this.infoIncidente) this.infoIncidente.total_votos += 1;
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
        if (this.infoIncidente) this.infoIncidente.total_votos -= 1;
      },
      (error) => {
        console.error('ERROR al ELIMINAR el Like:', error);
        this.isActive = true;
      }
    );
  }

  // isLike(incidenciaLike: IncidenciaLike): void {
  //   this.incidenciaLikeService.thaLike(incidenciaLike).subscribe(
  //     (respuesta) => {
  //       this.isActive = respuesta;
  //     },
  //     (error) => {
  //       console.error('ERROR al VERIFICAR el Like:', error);
  //     }
  //   );
  // }

  // getVotos(id_incidencia: number): void {
  //   this.incidenciaService.getTotalVotos(id_incidencia).subscribe(
  //     (totalVotos: number) => {
  //       if (this.incidente) {
  //         this.incidente.total_votos = totalVotos;
  //       }
  //     },
  //     (error) => {
  //       console.error('ERROR al OBTENER total de votos:', error);
  //     }
  //   );
  // }

  deleteIncidencia(): void {
    if (this.infoIncidente) {
      this.incidenciaService
        .deleteIncidencia(this.infoIncidente.id_incidencia)
        .subscribe((response) => {
          console.log('Incidente eliminado correctamente:', response);
        });
    }
  }

  openDialogDelete(): void {
    this.dialogService.openDialog(
      {
        tipo: 'Eliminar Incidencia',
        titulo: '¿Estás seguro de eliminar esta incidencia?',
      },
      () => this.deleteIncidencia()
    );
  }

  // getNameCategory(id_category: number): void{
  //   this.categoriaService.getNameCategory(id_category).subscribe(
  //     (category: Categoria) => {
  //       this.categoryName = category.nombre;
  //     },
  //     (error) => {
  //       console.error('ERROR al OBTENER nombre de Categoria:', error);
  //     }
  //   );
  // }

  emitirClick(): void {
    this.imagenClick.emit(this.infoIncidente?.imagen);
  }
}