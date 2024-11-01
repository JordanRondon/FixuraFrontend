import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IncidenciaConsolidado } from 'app/Model/IncidenciaConsolidado';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaConsolidadoService {

  private apiUrl = 'http://localhost:8080/api/incidenteConsolidado';

  constructor(
    private http: HttpClient
  ) { }

  insertIncidenciaConsolidado(incidenciaConsolidado: IncidenciaConsolidado): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/insertConsolidado', incidenciaConsolidado).pipe(
      map(respuetsa => respuetsa)
    )
  }
}
