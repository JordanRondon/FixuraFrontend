import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  constructor(private http: HttpClient) { }
  saveImagenIncidencia(request: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v1/upload/image',request).pipe(map(res =>res));
  }
}
