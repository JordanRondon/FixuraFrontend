import { PostIncidenciaComponent } from '../../componentes/post-incidencia/post-incidencia.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMap,GoogleMapsModule } from '@angular/google-maps';
import { Component, Input, OnInit ,ViewChild} from '@angular/core';
import { IncidenciaService } from '../../../Service/Incidencia/incidencia.service';
import { IncidenteCoordenada } from '../../../Model/IncidenteCoordenada';
import { Incidente } from 'app/Model/Incidente';
import { InfoIncidente } from '../../../Model/InfoIncidente';
@Component({
  selector: 'app-mapa-incidencias',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, FormsModule,PostIncidenciaComponent],
  templateUrl: './mapa-incidencias.component.html',
  styleUrl: './mapa-incidencias.component.css'
})
export class MapaIncidenciasComponent {
  center: google.maps.LatLngLiteral = { lat: -8.1116, lng: -79.0288 };
  vistaActiva: boolean = false;
  zoom = 15;
  latitud_incidencia:number| null=null;
  longitud_incidencia:number | null=null;
  IncidenteCoordenada: IncidenteCoordenada[] = [];
  polygon: google.maps.Polygon | null = null;
  polygonPath: google.maps.LatLngLiteral[] = [];
  incidencia: InfoIncidente | undefined ;
  bandMAPAINCIDENCIAS: boolean = true;
  @Input() distrito: number | undefined;
  @Input() listDistritoCoordenadas: { id_coordenada: number, latitud: number, longitud: number }[] = [];
  
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  constructor(
    private incidenteService: IncidenciaService
  ) { }
  ngOnInit(): void {
    this.getCoordenadasIncidentes(this.distrito ?? 2);
    this.polygonPath = this.listDistritoCoordenadas.map(coordenada => ({
      lat: coordenada.latitud,
      lng: coordenada.longitud
    }));
    this.tryInitPolygon();
    console.log("dnizsfdsad:"+this.distrito?.toString())
  }
  getMarkerIcon(incidente: IncidenteCoordenada): google.maps.Icon  {
    // Cambia la lógica según tus criterios para elegir el color
    let color = 'red'; // Color por defecto
    if (incidente.id_categoria == 1) {
      color = 'yellow';
    } else if (incidente.id_categoria == 2) {
      color = 'ltblue';
    } else if (incidente.id_categoria == 3) {
      color = 'purple';
    }
    else if (incidente.id_categoria == 4) {
      color = 'orange';
    }
    else if (incidente.id_categoria == 5) {
      color = 'green';
    }
    else if (incidente.id_categoria == 6) {
      color = 'red';
    }
    else if (incidente.id_categoria == 7) {
      color = 'pink';
    }
    return {
      url: `https://maps.gstatic.com/mapfiles/ms2/micons/${color}-dot.png`,
      scaledSize: new google.maps.Size(40, 40), // Tamaño del marcador
    };
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
  abrirIncidencia(): void {
    this.vistaActiva=true
  }
  CerrarIncidencia(): void {
    this.vistaActiva=false
  }
  onMarkerClick(id_incidencia: number) {
    console.log('Marker clicked with id_incidencia:', id_incidencia);
    
    this.incidenteService.getIncidenciaporID(id_incidencia.toString()).subscribe(
      (data: InfoIncidente) => {
        this.incidencia = data;
        
        console.log('Incidencia obtenida:', this.incidencia);
        this.abrirIncidencia()
        // Aquí puedes usar "incidencia" para cualquier otra lógica
      },
      (error) => {
        console.error('Error al obtener incidencia:', error);
      }
    );
  }
  tryInitPolygon(): void {
    const interval = setInterval(() => {
      if (this.map && this.map.googleMap) {
        this.initPolygon();
        clearInterval(interval);
      }
    }, 300); // Revisa cada 300ms si el mapa ya está disponible
  }
  
  initPolygon(): void {
    this.polygon = new google.maps.Polygon({
      paths: this.polygonPath,
      strokeColor: '#87CEEB',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#87CEEB',
      fillOpacity: 0.2,
      clickable: false,
    });
  
    if (this.map.googleMap) {
      this.polygon.setMap(this.map.googleMap);
      console.log("Polígono inicializado y agregado al mapa.");
    } else {
      console.error("Mapa no disponible.");
    }
  }
}
