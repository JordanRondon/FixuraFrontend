import {
  Component,
  Input,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { ImagenService } from '../../../Service/Imagen/imagen.service';
import { IncidenciaService } from '../../../Service/Incidencia/incidencia.service';
import { Incidente } from '../../../Model/Incidente';
import { CategoriaService } from '../../../Service/Categoria/categoria.service';
import { Categoria } from '../../../Model/Categoria';
import { AlertComponent } from 'ngx-bootstrap/alert';

@Component({
  selector: 'app-registro-incidencia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    AlertComponent,
  ],
  templateUrl: './registro-incidencia.component.html',
  styleUrls: ['./registro-incidencia.component.css'],
})
export class RegistroIncidenciaComponent implements OnInit {
  @Output() nuevaIncidenciaRegistrada = new EventEmitter<void>();
  formulario: FormGroup;
  //ubicacionSeleccionada: string = '';
  categorias: string[] = ['Poste', 'Pista', 'Desague'];
  apiKey: string = 'XIzaSyAu2e7Y6k3AS3Z0olMqdDtI-OdQZB0p44X';
  center: google.maps.LatLngLiteral = { lat: -8.1116, lng: -79.0288 };
  markerPosition: google.maps.LatLngLiteral | null = this.center;
  markerOptions: google.maps.MarkerOptions = { position: this.center };
  zoom = 17;
  latitud_incidencia: number | null = null;
  longitud_incidencia: number | null = null;
  imagenPrevisualizacion: string | ArrayBuffer | null = null;
  archivoSeleccionado: File | null = null;
  optionsCategory: Categoria[] = [];
  //usuario: number=32542163;
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  polygon: google.maps.Polygon | null = null;
  polygonPath: google.maps.LatLngLiteral[] = [];

  @Input() dniUsuario: string | undefined;
  @Input() listDistritoCoordenadas: {
    id_coordenada: number;
    latitud: number;
    longitud: number;
  }[] = [];

  incomplete: boolean = false;

  constructor(
    private fb: FormBuilder,
    private imagenService: ImagenService,
    private categoriaService: CategoriaService,
    private registroIncideten: IncidenciaService,
    private http: HttpClient
  ) {
    this.formulario = this.fb.group({
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      descripcion: ['', Validators.required],
      foto: [''],
    });
  }

  ngOnInit(): void {
    console.log(this.dniUsuario);
    console.log(
      'Coordenadas del distrito:',
      JSON.stringify(this.listDistritoCoordenadas, null, 2)
    );
    this.polygonPath = this.listDistritoCoordenadas.map((coordenada) => ({
      lat: coordenada.latitud,
      lng: coordenada.longitud,
    }));
    this.obtenerUbicacionActual();
    this.getListCategoria();
    this.tryInitPolygon();
  }

  // Cuando el usuario selecciona una ubicación en el mapa
  onUbicacionSeleccionada(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const clickLocation = new google.maps.LatLng(lat, lng);
      if (
        this.polygon &&
        google.maps.geometry.poly.containsLocation(clickLocation, this.polygon)
      ) {
        this.latitud_incidencia = lat;
        this.longitud_incidencia = lng;
        this.markerPosition = { lat, lng };
        this.obtenerDireccion(lat, lng);
        console.log('Ubicación dentro del polígono:', lat, lng);
      } else {
        console.log('El clic está fuera del área delimitada por el polígono.');
      }
    }
  }

  //Funcion para extraer la ubicacion actual del usuario
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
      console.log('Polígono inicializado y agregado al mapa.');
    } else {
      console.error('Mapa no disponible.');
    }
  }

  obtenerUbicacionActual(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.markerPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.zoom = 17;
        },
        (error) => {
          console.error('Error al obtener la ubicación: ', error);
        }
      );
    } else {
      console.error('La geolocalización no es compatible con este navegador.');
    }
  }

  obtenerDireccion(lat: number, lng: number): void {
    const url = `/api/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;

    this.http.get(url).subscribe((data: any) => {
      if (data.status === 'OK' && data.results.length > 0) {
        const direccion = data.results[0].formatted_address;
        this.formulario.patchValue({ ubicacion: direccion });
        console.log(this.formulario.value.ubicacion);
      } else {
        console.error('Error al obtener la dirección');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.archivoSeleccionado = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imagenPrevisualizacion = reader.result;
      };
      reader.readAsDataURL(file); // Convertir a base64
    }
  }

  onSubmit() {
    if (this.formulario.invalid || !this.archivoSeleccionado) {
      this.incomplete = true;
      return;
    }

    const fechaFormateada = this.obtenerFechaActual();
    const formIncidente = new FormData();
    const formData = new FormData();
    formData.append('file', this.archivoSeleccionado);

    // Opcional: enviar otros datos del formulario
    formIncidente.append('fecha_publicacion', fechaFormateada);
    formIncidente.append('descripcion', this.formulario.value.descripcion);
    formIncidente.append('ubicacion', this.formulario.value.ubicacion);
    formIncidente.append(
      'imagen',
      'https://raw.githubusercontent.com/KevinGM02/Galeria-Imagenes-Fixura/main/imagenes/' +
        this.archivoSeleccionado.name
    );
    formIncidente.append('total_votos', '0');
    formIncidente.append('id_estado', '3');
    formIncidente.append('DNI', this.dniUsuario ?? '');
    formIncidente.append(
      'id_categoria',
      this.formulario.value.categoria.toString()
    );
    formIncidente.append(
      'latitud',
      this.latitud_incidencia != null
        ? this.latitud_incidencia.toString()
        : 'null'
    );
    formIncidente.append(
      'longitud',
      this.longitud_incidencia != null
        ? this.longitud_incidencia.toString()
        : 'null'
    );

    console.log(fechaFormateada);
    console.log(this.formulario.value.descripcion);
    console.log(this.formulario.value.ubicacion);
    console.log(this.archivoSeleccionado.name);
    console.log(this.dniUsuario);
    console.log(this.formulario.value.categoria.toString());
    console.log(
      this.latitud_incidencia != null
        ? this.latitud_incidencia.toString()
        : 'null'
    );

    this.imagenService.saveImagenIncidencia(formData).subscribe((resp) => {
      if (resp) {
        console.log('Imagen subida exitosamente');
        this.registroIncideten
          .saveIncidencia(formIncidente)
          .subscribe((resp) => {
            if (resp) {
              this.formulario.reset();
              this.imagenPrevisualizacion = null;
              this.nuevaIncidenciaRegistrada.emit(); // Emitir el evento
            }
          });
      } else {
        console.error('Error al subir la imagen');
      }
    });
  }

  obtenerFechaActual(): string {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Los meses en JavaScript son de 0-11
    const dia = ('0' + fecha.getDate()).slice(-2);

    const horas = ('0' + fecha.getHours()).slice(-2);
    const minutos = ('0' + fecha.getMinutes()).slice(-2);
    const segundos = ('0' + fecha.getSeconds()).slice(-2);
    const milisegundos = ('00' + fecha.getMilliseconds()).slice(-3);

    return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}.${milisegundos}`;
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
}
