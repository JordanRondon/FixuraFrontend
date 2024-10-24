import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';
import { EstadoService } from '../../../../Service/Estado/estado.service';
import { Estado } from '../../../../Model/Estado';
import { CategoriaService } from '../../../../Service/Categoria/categoria.service';
import { Categoria } from '../../../../Model/Categoria';
import { Incidente } from '../../../../Model/Incidente';
import { IncidenteCoordenada } from '../../../../Model/IncidenteCoordenada';
import { FormsModule } from '@angular/forms';
import { IncidenciaService } from '../../../../Service/Incidencia/incidencia.service';
import { InfoIncidente } from '../../../../Model/InfoIncidente';


@Component({
  selector: 'app-edit-incidencia',
  standalone: true,
  imports: [ CommonModule, GoogleMapsModule, FormsModule ],
  templateUrl: './edit-incidencia.component.html',
  styleUrl: './edit-incidencia.component.css'
})
export class EditIncidenciaComponent implements OnInit, OnChanges, AfterViewInit{

  @Output() formEditClosed = new EventEmitter<boolean>();
  @Input() infoIncidenteEdit: InfoIncidente | undefined;

  incidenteEditCache: InfoIncidente | undefined;

  Coordenada_incidente: IncidenteCoordenada | undefined;

  isOpenState = false; // Para controlar si las opciones están abiertas o no
  selectedOptionState: String = 'Seleccione una Opción'; // Opción seleccionada
  optionsState: Estado[] = [];

  isOpenCategory = false; // Para controlar si las opciones están abiertas o no
  selectedOptionCategory: String = 'Seleccione una Opción'; // Opción seleccionada
  optionsCategory: Categoria[] = [];

  apiKey: string = 'XIzaSyAu2e7Y6k3AS3Z0olMqdDtI-OdQZB0p44X'; 
  center: google.maps.LatLngLiteral = { lat: -8.1116, lng: -79.0288 };
  markerPosition: google.maps.LatLngLiteral | null = this.center; 
  zoom = 17;
  
  constructor(
    private http: HttpClient,
    private estadoService: EstadoService,
    private categoriaService: CategoriaService,
    private incidenciaService: IncidenciaService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    
    if(this.infoIncidenteEdit) {
      this.incidenteEditCache = JSON.parse(JSON.stringify(this.infoIncidenteEdit)); 
      this.selectedOptionState = this.infoIncidenteEdit.estado;
      this.selectedOptionCategory = this.infoIncidenteEdit.categoria;
    }
    
    if (this.infoIncidenteEdit?.id_incidencia) {
      this.getCoordenadas(this.infoIncidenteEdit.id_incidencia);
    }
    
    this.center = { lat: this.Coordenada_incidente?.latitud ?? -8.1116, lng: this.Coordenada_incidente?.longitud ?? -79.0288}; // Reestablece la posición 
    this.zoom = 17; // Reestablece el nivel de zoom
    console.log('ID_INCIDENCIA:', this.infoIncidenteEdit?.id_incidencia);
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
    this.isOpenCategory = false;
  }

  selectOptionState(option: Estado) {
    this.selectedOptionState = option.nombre;
    if (this.infoIncidenteEdit)
      this.infoIncidenteEdit.estado = option.nombre;
    this.isOpenState = false;
  }

  toggleOptionsCategory() {
    this.isOpenCategory = !this.isOpenCategory;
  }

  selectOptionCategory(option: Categoria) {
    this.selectedOptionCategory = option.nombre;
    if (this.infoIncidenteEdit)
      this.infoIncidenteEdit.categoria = option.nombre;
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
      this.markerPosition = { lat, lng };
      if (this.infoIncidenteEdit){
        this.infoIncidenteEdit.latitud = lat;
        this.infoIncidenteEdit.longitud = lng; 
        console.log("LATITUD SELECCIONADA:"+this.infoIncidenteEdit.latitud)
        console.log("LONGITUD SELECCIONADA:"+this.infoIncidenteEdit.longitud)
      }
  
      this.obtenerDireccion(lat, lng);
    }
  }

  obtenerDireccion(lat: number, lng: number): void {
    const url = `/api/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;

    this.http.get(url).subscribe((data: any) => {
      if (data.status === 'OK' && data.results.length > 0) {
        const direccion = data.results[0].formatted_address;
        if (this.infoIncidenteEdit){
          this.infoIncidenteEdit.ubicacion=direccion.toString();
        }
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

  // getNameState(id_state: number): void {
  //   this.estadoService.getNameState(id_state).subscribe(nameState => {
  //     this.selectedOptionState = nameState.nombre;
  //   });
  // }

  // getNameCategory(id_category: number): void {
  //   this.categoriaService.getNameCategory(id_category).subscribe(nameCategory => {
  //     this.selectedOptionCategory = nameCategory.nombre;
  //   });
  // }

  setIncidencia(): void {

    if (!this.infoIncidenteEdit) {
      console.error('Incidente no está definido');
      return;
    }

    const incidente: Incidente = {
      id_incidencia: this.infoIncidenteEdit.id_incidencia,
      fecha_publicacion: this.infoIncidenteEdit.fecha_publicacion,
      descripcion: '',
      ubicacion: this.infoIncidenteEdit.ubicacion,
      imagen: '',
      total_votos: 0,
      id_estado: 0,
      dni: '',
      id_categoria: 0,
      latitud: this.infoIncidenteEdit.latitud,
      longitud: this.infoIncidenteEdit.longitud
    }

    for (const state of this.optionsState) {
      if(state.nombre === this.infoIncidenteEdit.estado)
        incidente.id_estado = state.id_estado;
    }

    for (const category of this.optionsCategory) {
      if(category.nombre === this.infoIncidenteEdit.categoria)
        incidente.id_categoria= category.id_categoria;
    }
    
    this.incidenciaService.updateIncidencia(incidente).subscribe(
      response => {
        console.log('Incidente actualizado correctamente:', response);
      }
    );
  }

  getCoordenadas(id_incidencia: number): void {
    // if (!this.incidenteEdit) {
    //   console.error('Incidente no está definido');
    //   return;
    // }

    // this.incidenciaService.getCoordenadaIncidente(id_incidencia).subscribe(
    //   (data: IncidenteCoordenada) => {
    //     this.Coordenada_incidente = data;
    //     console.log('Coordenadas obtenidas:', this.Coordenada_incidente);

    //     // Actualiza el centro y la posición del marcador cuando obtienes las coordenadas
    //     this.center = { lat: this.Coordenada_incidente.latitud, lng: this.Coordenada_incidente.longitud };
    //     this.markerPosition = this.center;  // Actualiza la posición del marcador
    //     this.zoom = 17;  // Mantiene el zoom en 17
    //     if (this.incidenteEdit){
    //       this.incidenteEdit.latitud = this.Coordenada_incidente.latitud;
    //       this.incidenteEdit.longitud = this.Coordenada_incidente.longitud; 
    //     }
    //     console.log('Centro actualizado:', this.center);
    //   },
    //   (error) => {
    //     console.error('Error al obtener las coordenadas:', error);
    //   }
    // );
  }

  resetChanges(): void {
    this.infoIncidenteEdit = JSON.parse(JSON.stringify(this.incidenteEditCache));

    this.selectedOptionState = this.infoIncidenteEdit?.estado ?? 'Seleccione una Opción';
    this.selectedOptionCategory = this.infoIncidenteEdit?.categoria ?? 'Seleccione una Opción';
    const lat =this.infoIncidenteEdit?.latitud;
    const lng =this.infoIncidenteEdit?.longitud;
    if(lat && lng){
      this.markerPosition = { lat, lng };
    }
    
    this.changeDetector.markForCheck(); // Forzar actualización de la vista
  }
  
}