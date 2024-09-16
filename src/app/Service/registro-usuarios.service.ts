import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Usuario } from '../Model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuariosService {

  constructor(private httpClient: HttpClient) { }

  saveUsuario(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:8080/api/usuario/save', request).pipe(map(res => res));
  }

  login(correo: string, contrasenia: string): Observable<Usuario> {
    return this.httpClient.post<any>('http://localhost:8080/api/usuario/login', { correo, contrasenia }).pipe(
      map((data: any) => new Usuario(
        data.nombre,
        data.dni,
        data.correo,
        data.contrasenia,
        data.fotoPerfil,
        data.tiempo_ban,
        data.id_rol,
        data.idDist
      )),
      catchError(error => {
        console.error('Error durante el inicio de sesión', error);
        throw error;
      })
    );
  }
}
