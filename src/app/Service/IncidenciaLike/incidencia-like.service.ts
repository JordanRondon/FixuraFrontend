import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IncidenciaLike } from '../../Model/IncidenciaLike';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaLikeService {

  private apiUrl = 'https://fixurabackend.onrender.com/api/incidenteLike';

  constructor(
    private http: HttpClient
  ) { }

  insertLike(incidenciaLike: IncidenciaLike): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/insertLike', incidenciaLike).pipe(
      map(respuetsa => respuetsa)
    )
  }

  deleteLike(incidenciaLike: IncidenciaLike): Observable<any> {
    return this.http.delete<any>(this.apiUrl+'/deleteLike', {
      body: incidenciaLike  // Aquí pasas el cuerpo de la solicitud
    }).pipe(
      map(response => response)
    );
  }

  thaLike(incidenciaLike: IncidenciaLike): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/thaLike', incidenciaLike).pipe(
      map(response => response)
    );
  }
}