
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { Component, Input, OnInit } from '@angular/core';
import { IncidenciaService } from '../../../Service/Incidencia/incidencia.service';
import { IncidenteCoordenada } from '../../../Model/IncidenteCoordenada';
@Component({
  selector: 'app-mapa-incidencias',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, FormsModule],
  templateUrl: './mapa-incidencias.component.html',
  styleUrl: './mapa-incidencias.component.css'
})
export class MapaIncidenciasComponent {
  center: google.maps.LatLngLiteral = { lat: -8.1116, lng: -79.0288 };
  
  zoom = 15;
  latitud_incidencia:number| null=null;
  longitud_incidencia:number | null=null;
  IncidenteCoordenada: IncidenteCoordenada[] = [];
  @Input() distrito: number | undefined;
  constructor(
    private incidenteService: IncidenciaService
  ) { }
  ngOnInit(): void {
    this.getCoordenadasIncidentes(this.distrito ?? 2);
    
    console.log("dnizsfdsad:"+this.distrito?.toString())
  }
  getCoordenadasIncidentes(id_distrito: number): void {
    this.incidenteService.getListaCoordenadasIncidentes(id_distrito).subscribe(
      (data: IncidenteCoordenada[]) => {
        this.IncidenteCoordenada = data;
        console.log(this.IncidenteCoordenada);
      },
      (error) => {
        console.error('Error al obtener los incidentes:', error);
      }
    );
  }
}
