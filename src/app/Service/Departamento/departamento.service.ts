import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private baseUrl = 'http://localhost:8080/api/v1/departamento';

  constructor(private httpClient: HttpClient) {
  }

  getDepartamento(): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/list`);
  }

  getProvincia(id_depart: number): Observable<any>{
    return this.httpClient.get<any>(this.baseUrl + '/' + id_depart + '/provincias')
  }

  getDistrito(id_depart: number, id_prov: number): Observable<any>{
    return this.httpClient.get<any>(this.baseUrl + '/' + id_depart + '/provincia/' + id_prov + '/distritos')
  }

  getNameDistrito(id_distrito: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + '/distrito/' + id_distrito)
  }
}
