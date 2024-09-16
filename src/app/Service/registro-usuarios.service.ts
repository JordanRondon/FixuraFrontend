import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuariosService {

  constructor(private httpClient: HttpClient) { }

  saveUsuario(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:8080/api/usuario/save', request).pipe(map(res => res));
  }
}
