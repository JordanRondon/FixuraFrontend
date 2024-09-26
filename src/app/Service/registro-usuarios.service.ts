import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Usuario } from '../Model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuariosService {

  private apiUrl = 'http://localhost:8080/api/usuario';

  constructor(private httpClient: HttpClient) { }

  saveUsuario(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:8080/api/usuario/save', request).pipe(map(res => res));
  }

  login(correo: string, contrasenia: string): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl+'/login', { correo, contrasenia }).pipe(
      catchError(error => {
        console.error('Error durante el inicio de sesión', error);
        return throwError(() => new Error('Error en el proceso de login'));
      })
    );
  }

  // Método para obtener el perfil de usuario
  getUserProfile(): Observable<Usuario> {
    return this.httpClient.post<any>(`${this.apiUrl}/profile`, null).pipe(
      map((data: any) => {
        return new Usuario(
          data.nombre,
          data.dni,
          data.correo,
          data.contrasenia,
          data.foto_perfil,
          data.tiempo_ban,
          data.id_rol,
          data.id_distrito
        );
      }),
      catchError(error => {
        console.error('Error al obtener el perfil de usuario', error);
        return throwError(() => new Error('Error al obtener el perfil de usuario'));
      })
    );
  }
}
