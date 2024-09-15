import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import { Incidente } from '../../../Model/Incidente';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-post-incidencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-incidencia.component.html',
  styleUrls: ['./post-incidencia.component.css']
})

export class PostIncidenciaComponent implements OnChanges {

  @Input() incidente: Incidente | undefined;
  isActive = false;

  ngOnChanges(changes: SimpleChanges) { }
    

  toggleActive() {
    this.isActive = !this.isActive;
  }

  formatearFecha(fecha?: Date): string {
    if (fecha) 
      return format(fecha, "d 'de' MMMM 'del' yyyy, 'a las' hh:mm a", { locale: es });
    else
      return "Sin Información"
  }
}