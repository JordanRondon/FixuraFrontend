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

  registrarUsuario(usuario: any): Observable<any> {
    if (!this.validateEmail(usuario.correo)) {
      alert('Correo no válido');
      return throwError(() => new Error('Correo no válido'));
    }
  
    return this.checkExistEmail(usuario.correo).pipe(
      switchMap((emailResponse: any) => {
        if (emailResponse.success) {
          alert(emailResponse.menssage);
          return throwError(() => new Error('Correo ya existe'));
        }
  
        return this.verifyDni(usuario.dni).pipe(
          switchMap((dniResponse: any) => {
            if (!dniResponse.success) {
              alert(dniResponse.menssage);
              return throwError(() => new Error('DNI no válido'));
            }
  
            return this.httpClient.post<any>(`${this.apiUrl}/register`, usuario);
          })
        );
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

  checkExistEmail(correo: string): Observable<any>{
    return this.httpClient.post<String>(`${this.apiUrl}/existEmail`, correo).pipe();
  }

  verifyDni(dni: string): Observable<any>{
    return this.httpClient.post<String>(`${this.apiUrl}/verifyDni`, dni).pipe();
  }

  private validateEmail(email: string) {
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail)\.(com|es|net)$/;
    return emailRegex.test(email);
  }
  
}
