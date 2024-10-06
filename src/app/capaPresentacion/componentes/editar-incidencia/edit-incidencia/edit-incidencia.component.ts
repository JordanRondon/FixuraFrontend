import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';
import { EstadoService } from '../../../../Service/Estado/estado.service';
import { Estado } from '../../../../Model/Estado';
import { CategoriaService } from '../../../../Service/Categoria/categoria.service';
import { Categoria } from '../../../../Model/Categoria';
import { Incidente } from '../../../../Model/Incidente';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit-incidencia',
  standalone: true,
  imports: [ CommonModule, GoogleMapsModule, FormsModule ],
  templateUrl: './edit-incidencia.component.html',
  styleUrl: './edit-incidencia.component.css'
})
export class EditIncidenciaComponent implements OnInit, OnChanges, AfterViewInit{

  @Output() formEditClosed = new EventEmitter<boolean>();
  @Input() incidenteEdit: Incidente | undefined;

  isOpenState = false; // Para controlar si las opciones están abiertas o no
  selectedOptionState: String = 'Seleccione una Opción'; // Opción seleccionada
  optionsState: Estado[] = [];

  isOpenCategory = false; // Para controlar si las opciones están abiertas o no
  selectedOptionCategory: String = 'Seleccione una Opción'; // Opción seleccionada
  optionsCategory: Categoria[] = [];

  apiKey: string = 'XIzaSyAu2e7Y6k3AS3Z0olMqdDtI-OdQZB0p44X'; 
  center: google.maps.LatLngLiteral = { lat: -8.1116, lng: -79.0288 };
  marker: google.maps.Marker | null = null;
  zoom = 17;

  constructor(
    private http: HttpClient,
    private estadoService: EstadoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit() {
    if(this.incidenteEdit) {
      this.getNameState(this.incidenteEdit.id_estado);
      this.getNameCategory(this.incidenteEdit.id_categoria);
    }
    this.center = { lat: -8.1116, lng: -79.0288 }; // Reestablece la posición 
    this.zoom = 17; // Reestablece el nivel de zoom
    console.log('Centro:', this.center);
    console.log('Zoom:', this.zoom);
    document.addEventListener('click', this.closeOptions.bind(this));
    this.getListEstate();
    this.getListCategoria();
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

  selectOptionState(option: Estado) {
    this.selectedOptionState = option.nombre;
    if (this.incidenteEdit)
      this.incidenteEdit.id_estado = option.id_estado;
    this.isOpenState = false;
  }

  toggleOptionsCategory() {
    this.isOpenCategory = !this.isOpenCategory;
  }

  selectOptionCategory(option: Categoria) {
    this.selectedOptionCategory = option.nombre;
    if (this.incidenteEdit)
      this.incidenteEdit.id_categoria = option.id_categoria;
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
    this.estadoService.getListState().subscribe(
      (respuesta) => {
        this.optionsState = respuesta;
      },
      (error) => {
        console.error('ERROR al obtener lista de Estados:', error);
      }
    );
  }

  getListCategoria(): void {
    this.categoriaService.getListCategory().subscribe(
      (respuesta) => {
        this.optionsCategory = respuesta;
      },
      (error) => {
        console.error('ERROR al obtener lista de Categorias:', error);
      }
    );
  }

  getNameState(id_state: number): void {
    this.estadoService.getNameState(id_state).subscribe(nameState => {
      this.selectedOptionState = nameState.nombre;
    });
  }

  getNameCategory(id_category: number): void {
    this.categoriaService.getNameCategory(id_category).subscribe(nameCategory => {
      this.selectedOptionCategory = nameCategory.nombre;
    });
  }
}