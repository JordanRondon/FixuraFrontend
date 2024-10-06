import { AfterViewInit, Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';
import { EstadoService } from '../../../../Service/Estado/estado.service';
import { Estado } from '../../../../Model/Estado';


@Component({
  selector: 'app-edit-incidencia',
  standalone: true,
  imports: [ CommonModule, GoogleMapsModule ],
  templateUrl: './edit-incidencia.component.html',
  styleUrl: './edit-incidencia.component.css'
})
export class EditIncidenciaComponent implements OnInit, OnChanges, AfterViewInit{

  @Output() formEditClosed = new EventEmitter<boolean>();

  isOpenState = false; // Para controlar si las opciones están abiertas o no
  selectedOptionState: string = 'Selecciona una opción'; // Opción seleccionada
  optionsState: Estado[] = [];

  isOpenCategory = false; // Para controlar si las opciones están abiertas o no
  selectedOptionCategory: string = 'Selecciona una opción'; // Opción seleccionada
  optionsCategory = [
    { label: 'Categoría 1', value: 1 },
    { label: 'Categoría 2', value: 2 },
    { label: 'Categoría 3', value: 3 }
  ];

  apiKey: string = 'XIzaSyAu2e7Y6k3AS3Z0olMqdDtI-OdQZB0p44X'; 
  center: google.maps.LatLngLiteral = { lat: -8.1116, lng: -79.0288 };
  marker: google.maps.Marker | null = null;
  zoom = 17;

  constructor(
    private http: HttpClient,
    private estadoService: EstadoService
  ) {}

  ngOnInit() {
    this.center = { lat: -8.1116, lng: -79.0288 }; // Reestablece la posición 
    this.zoom = 17; // Reestablece el nivel de zoom
    console.log('Centro:', this.center);
    console.log('Zoom:', this.zoom);
    document.addEventListener('click', this.closeOptions.bind(this));
    this.getListEstate()
  }

  ngOnChanges() {
    this.center = { lat: -8.1116, lng: -79.0288 }; // Reestablece la posición 
    this.zoom = 17; // Reestablece el nivel de zoom
  }

  ngAfterViewInit() {
    this.center = { lat: -8.1116, lng: -79.0288 }; // Reestablece la posición 
    this.zoom = 17; // Reestablece el nivel de zoom
  }

  closeForm() {
    this.formEditClosed.emit(false);
  }

  toggleOptionsState() {
    this.isOpenState = !this.isOpenState;
  }

  selectOptionState(option: any) {
    this.selectedOptionState = option.nombre;
    this.isOpenState = false;
  }

  toggleOptionsCategory() {
    this.isOpenCategory = !this.isOpenCategory;
  }

  selectOptionCategory(option: any) {
    this.selectedOptionCategory = option.label;
    this.isOpenCategory = false;
  }

  // Cierra el menú si se hace clic fuera del select
  closeOptions(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.comboBox')) {
      this.isOpenState = false;
      this.isOpenCategory = false;
    }
  }

  onUbicacionSeleccionada(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.obtenerDireccion(lat, lng);
    }
  }

  obtenerDireccion(lat: number, lng: number): void {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;

    this.http.get(url).subscribe((data: any) => {
      if (data.status === 'OK' && data.results.length > 0) {
        const direccion = data.results[0].formatted_address;
        
  
        console.error(direccion);
      } else {
        console.error('Error al obtener la dirección');
      }
    });
  }

  getListEstate(): void {
    this.estadoService.getListEstate().subscribe(
      (respuesta) => {
        this.optionsState = respuesta;
      },
      (error) => {
        console.error('ERROR al obtener listaa de Estados:', error);
      }
    );
  }
}
