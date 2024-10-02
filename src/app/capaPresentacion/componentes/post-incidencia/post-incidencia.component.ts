import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import { Incidente } from '../../../Model/Incidente';
import { es } from 'date-fns/locale';
import { IncidenciaLikeService } from '../../../Service/IncidenciaLike/incidencia-like.service';
import { IncidenciaLike } from '../../../Model/IncidenciaLike';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';

@Component({
  selector: 'app-post-incidencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-incidencia.component.html',
  styleUrls: ['./post-incidencia.component.css']
})

export class PostIncidenciaComponent implements OnInit, OnChanges {

  @Input() incidente: Incidente | undefined;
  @Input() nombreUsuario: string | undefined;
  isActive: boolean = false;
  incidenciaLike: IncidenciaLike = { 
    dni: '',
    id_incidencia: -1,
    hour_liked: new Date()
  };

  constructor(
    private incidenciaLikeService: IncidenciaLikeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.incidente) {
      this.incidenciaLike = {
        dni: this.authService.getToken_dni() ?? '',
        id_incidencia: this.incidente.id_incidente ?? -1,
        hour_liked: new Date()
      };
      this.isLike(this.incidenciaLike);
    }
  }

  ngOnChanges(changes: SimpleChanges) { }
    

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

}