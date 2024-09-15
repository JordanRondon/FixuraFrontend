import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Incidente } from '../../Model/Incidente';

@Injectable({
  providedIn: 'root'
})

export class IncidenteService {

  private apiUrl = 'http://localhost:8080/api/incidente';

  constructor(private http: HttpClient) { }

  getListaIncidencia(DNI_usuario: string): Observable<Incidente[]> {
    return this.http.get<Incidente[]>(`${this.apiUrl}/list/usuario/${DNI_usuario}`). pipe(
      map((data: any[]) => data.map(item => new Incidente(
        item.id_incidente,
        item.fecha_publicacion,
        item.descripcion,
        item.ubicacion,
        item.imagen,
        item.total_votos,
        item.id_estado,
        item.DNI_usuario,
        item.id_categoria
      )))
    );
  }
}
