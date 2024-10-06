import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Estado } from '../../Model/Estado';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private apiUrl = 'http://localhost:8080/api/estado';

  constructor(
    private http: HttpClient
  ) { }

  getListEstate(): Observable<Estado[]> { 
    return this.http.get<Estado[]>(this.apiUrl + '/list').pipe (
      map((data: any[]) => data.map(item => new Estado(
        item.id_estado,
        item.nombre
      )))
    );
  }
}
