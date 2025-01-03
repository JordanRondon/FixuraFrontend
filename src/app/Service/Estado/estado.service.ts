import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Estado } from '../../Model/Estado';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private apiUrl = 'https://fixurabackend.onrender.com/api/estado';

  constructor(
    private http: HttpClient
  ) { }

  getListState(): Observable<Estado[]> { 
    return this.http.get<Estado[]>(this.apiUrl + '/list').pipe (
      map((data: any[]) => data.map(item => new Estado(
        item.id_estado,
        item.nombre
      )))
    );
  }

  getNameState(id_state: number): Observable<Estado> {
    return this.http.get<Estado>(this.apiUrl + '/name/' + id_state).pipe(
      map((data: Estado) => data)
    );
  }
}
