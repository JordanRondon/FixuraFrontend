import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Categoria } from '../../Model/Categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = 'http://localhost:8080/api/categoria';

  constructor(
    private http: HttpClient
  ) { }

  getListCategory(): Observable<Categoria[]> { 
    return this.http.get<Categoria[]>(this.apiUrl + '/list').pipe (
      map((data: any[]) => data.map(item => new Categoria(
        item.id_categoria,
        item.nombre
      )))
    );
  }

  getNameCategory(id_category: number): Observable<Categoria> {
    return this.http.get<Categoria>(this.apiUrl + '/name/' + id_category).pipe(
      map((data: Categoria) => data)
    );
  }
}
