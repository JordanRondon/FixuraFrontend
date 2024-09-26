import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  // Patron de diseño Singleton
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }
  
  // Guardar token en la cookie
  setToken(token: string): void {
    this.cookieService.set('token', token, {
      // Configuración de expiración y las opciones de seguridad.
      expires: 1, // Duración de 1 día
      path: '/',
      sameSite: 'Lax',
      //secure: true // para protocolo HTTPS
    });
  }

  // Obtener el token de la cookie
  getToken(): string | null {
    const token = this.cookieService.get('token');
    return token ? token : null;
  }

  // Eliminar el token de la cookie (cerrar sesión)
  deleteToken(): void {
    this.cookieService.delete('token', '/');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken(); // Devuelve true si hay un token
  }
}