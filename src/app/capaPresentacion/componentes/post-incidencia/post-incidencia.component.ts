import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-incidencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-incidencia.component.html',
  styleUrls: ['./post-incidencia.component.css']
})
export class PostIncidenciaComponent {
  isActive = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }
}