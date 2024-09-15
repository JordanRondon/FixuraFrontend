import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegistroIncidentesService {

  constructor(private http: HttpClient) { }
  saveIncidencia(request: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/incidente/save',request).pipe(map(res =>res));
  }
}
