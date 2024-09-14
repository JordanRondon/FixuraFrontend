import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro-incidencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapsModule, HttpClientModule],
  templateUrl: './registro-incidencia.component.html',
  styleUrls: ['./registro-incidencia.component.css']
})
export class RegistroIncidenciaComponent implements OnInit {
  formulario: FormGroup;
  ubicacionSeleccionada: string = '';
  categorias: string[] = ['Restaurante', 'Tienda', 'Parque', 'Escuela', 'Hospital'];
  apiKey: string = 'XIzaSyAu2e7Y6k3AS3Z0olMqdDtI-OdQZB0p44X'; 
  imagenPrevisualizacion: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imagenPrevisualizacion = reader.result;
      };
      reader.readAsDataURL(file); // Convertir a base64
    }
  }
  onSubmit(): void {
    if (this.formulario.valid) {
      console.log('Formulario enviado:', this.formulario.value);
    } else {
      console.log('Formulario no válido');
    }
  }
}
