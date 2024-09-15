import { Component, OnInit } from '@angular/core';
import { NavbarUsuarioComponent } from '../../componentes/navbar-usuario/navbar-usuario.component';
import { PostIncidenciaComponent } from '../../componentes/post-incidencia/post-incidencia.component';
import { CommonModule } from '@angular/common';
import { RegistroIncidenciaComponent } from '../../componentes/registro-incidencia/registro-incidencia.component';
import { IncidenteService } from '../../../Service/getIncidente/obtener-incidentes.service';
import { Incidente } from '../../../Model/Incidente';

@Component({
  selector: 'app-muro-usuario',
  standalone: true,
  imports: [NavbarUsuarioComponent, PostIncidenciaComponent,RegistroIncidenciaComponent,CommonModule],
  templateUrl: './muro-usuario.component.html',
  styleUrl: './muro-usuario.component.css'
})

export default class MuroUsuarioComponent implements OnInit {
  
  mostrarFormulario: boolean = false;
  incidentes: Incidente[] = []

  constructor(private incidenteService: IncidenteService) { }

  ngOnInit(): void {
    this.getIncidentesPorUsuario('32542163');
  }

  abrirRegistroIncidencia() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  getIncidentesPorUsuario(DNI_usuario: string): void {
    this.incidenteService.getListaIncidencia(DNI_usuario).subscribe(
      (data: Incidente[]) => {
        this.incidentes = data;
        console.log(this.incidentes);
      },
      (error) => {
        console.error('Error al obtener los incidentes:', error);
      }
    );
  }
}
