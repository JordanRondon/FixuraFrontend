import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { parseISO } from 'date-fns';
import { Incidente } from '../../Model/Incidente';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

  private apiUrl = 'http://localhost:8080/api/incidente';

  constructor(private http: HttpClient) { }


  saveIncidencia(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save`,request).pipe(map(res =>res));
  }

  getListaIncidencia(DNI_usuario: string): Observable<Incidente[]> {
    return this.http.get<Incidente[]>(`${this.apiUrl}/list/usuario/${DNI_usuario}`). pipe(
      map((data: any[]) => data.map(item => new Incidente(
        item.id_incidencia,
        parseISO(item.fecha_publicacion),
        item.descripcion,
        item.ubicacion,
        item.imagen,
        item.total_votos,
        item.id_estado,
        item.dni,
        item.id_categoria
      )))
    );
  }

  getListaIncidenciaMunicipalidad(id_distrito: number): Observable<Incidente[]> {
    return this.http.get<Incidente[]>(`${this.apiUrl}/list/municipalidad/${id_distrito}`). pipe(
      map((data: any[]) => data.map(item => new Incidente(
        item.id_incidencia,
        parseISO(item.fecha_publicacion),
        item.descripcion,
        item.ubicacion,
        item.imagen,
        item.total_votos,
        item.id_estado,
        item.dni,
        item.id_categoria
      )))
    );
  }

  getTotalVotos(id_incidencia: number): Observable<number> {
    return this.http.get<number>(this.apiUrl + '/totalVotos/' + id_incidencia);
  }

  getNameUserIncidencia(id_incidencia: number): Observable<String> {
    return this.http.get<String>(this.apiUrl + '/name/usuario/' + id_incidencia, { responseType: 'text' as 'json' })
  }

  updateIncidencia(incidente: Incidente): Observable<any> {
    return this.http.put<any>('http://localhost:8080/api/incidente/updateIncidencia', incidente).pipe();
  }

}
