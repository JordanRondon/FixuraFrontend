import { Component } from '@angular/core';
import { NavbarUsuarioComponent } from '../../componentes/navbar-usuario/navbar-usuario.component';
import { PostIncidenciaComponent } from '../../componentes/post-incidencia/post-incidencia.component';
import { CommonModule } from '@angular/common';
import { RegistroIncidenciaComponent } from '../../componentes/registro-incidencia/registro-incidencia.component';

@Component({
  selector: 'app-muro-usuario',
  standalone: true,
  imports: [NavbarUsuarioComponent, PostIncidenciaComponent,RegistroIncidenciaComponent,CommonModule],
  templateUrl: './muro-usuario.component.html',
  styleUrl: './muro-usuario.component.css'
})
export default class MuroUsuarioComponent {
  mostrarFormulario: boolean = false;

  abrirRegistroIncidencia() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }
}
