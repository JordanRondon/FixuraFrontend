import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Incidente } from '../../../Model/Incidente';

@Component({
  selector: 'app-post-incidencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-incidencia.component.html',
  styleUrls: ['./post-incidencia.component.css']
})
export class PostIncidenciaComponent {

  @Input() incidente: Incidente | undefined;
  isActive = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }
}