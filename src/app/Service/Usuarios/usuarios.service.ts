import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError, switchMap } from 'rxjs';
import { Usuario } from '../../Model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:8080/api/usuario';

  constructor(private httpClient: HttpClient) { }

  registrarUsuario(usuario: any): Observable<any>{
    if(!this.validateEmail(usuario.correo)){
      alert('Correo no valido');
      return throwError(() => new Error('Correo no válido'));
    }
    
    return this.checkExistEmail(usuario.correo).pipe(
      switchMap(exists => {
          if (exists) {
              alert('El correo ingresado ya existe');
              return throwError(() => new Error('El correo ya existe'));
          }
          
          // Si el correo no existe, procede a registrar
          return this.httpClient.post<any>(`${this.apiUrl}/register`, usuario).pipe(
              map(res => res),
              catchError(() => {
                  return throwError(() => new Error('Error durante el registro'));
              })
          );
      }),
      catchError(() => {
          return throwError(() => new Error('Error al verificar existencia de email'));
      })
    );
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

  checkExistEmail(correo: string): Observable<boolean>{
    return this.httpClient.post<boolean>(`${this.apiUrl}/existEmail`, correo).pipe(
      catchError(error => {
          console.error('Error al verificar existencia de email', error);
          return throwError(() => new Error('Error al verificar existencia de email'));
      })
    );
  }

  private validateEmail(email: string) {
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail)\.(com|es|net)$/;
    return emailRegex.test(email);
  }
  
}
