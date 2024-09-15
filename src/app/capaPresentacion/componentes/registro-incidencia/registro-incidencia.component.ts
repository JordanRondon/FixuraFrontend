import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { ImagenServiceService } from '../../../Service/imagen-service.service';
import { RegistroIncidentesService } from '../../../Service/registro-incidentes.service';
@Component({
  selector: 'app-registro-incidencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './registro-incidencia.component.html',
  styleUrls: ['./registro-incidencia.component.css']
})
export class RegistroIncidenciaComponent implements OnInit {
  formulario: FormGroup;
  ubicacionSeleccionada: string = '';
  categorias: string[] = ['Restaurante', 'Tienda', 'Parque', 'Escuela', 'Hospital'];
  apiKey: string = 'XIzaSyAu2e7Y6k3AS3Z0olMqdDtI-OdQZB0p44X'; 
  imagenPrevisualizacion: string | ArrayBuffer | null = null;
  archivoSeleccionado: File | null = null;
  usuario: number=32542163;
  constructor(private fb: FormBuilder,private imagenService: ImagenServiceService,private registroIncideten: RegistroIncidentesService,private http: HttpClient) {
    this.formulario = this.fb.group({
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      foto: ['']
    });
  }
  
  ngOnInit(): void { }

  // Cuando el usuario selecciona una ubicación en el mapa
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
        this.ubicacionSeleccionada = direccion;
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
      console.log('dsadasdasd');
      return;
    }
    
    const fechaFormateada = this.obtenerFechaActual();
    const formIncidente = new FormData();
    const formData = new FormData();
    formData.append('file', this.archivoSeleccionado);
    
    // Opcional: enviar otros datos del formulario
    formIncidente.append('fecha_publicacion', fechaFormateada);
    formIncidente.append('descripcion', this.formulario.value.descripcion);
    formIncidente.append('ubicacion', "mi_casa");
    formIncidente.append('imagen',"https://raw.githubusercontent.com/KevinGM02/Galeria-Imagenes-Fixura/main/imagenes/"+this.archivoSeleccionado.name );
    formIncidente.append('total_votos',"0");
    formIncidente.append('id_estado',"3");
    formIncidente.append('DNI',this.usuario.toString());
    formIncidente.append('id_categoria', this.formulario.value.categoria.toString());
    console.log(fechaFormateada);
    console.log(this.formulario.value.descripcion);
    console.log(this.archivoSeleccionado.name);
    console.log(this.usuario.toString());
    console.log(this.formulario.value.categoria.toString());
    this.registroIncideten.saveIncidencia(formIncidente).subscribe(resp=>{
      if(resp){
        this.formulario.reset();
        console.log('Incidente registrado correctamente');
      }else{
        console.error('Error al registrar un incidente');
      }
    });
    this.imagenService.saveImagenIncidencia(formData).subscribe(resp=>{
      if(resp){
        this.formulario.reset();
        console.log('Imagen subida exitosamente');
      }else{
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
  
}