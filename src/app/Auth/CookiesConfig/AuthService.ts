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

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken(); // Devuelve true si hay un token
  }

  // Eliminar el token de la cookie (cerrar sesión)
  deleteToken(): void {
    this.cookieService.delete('token', '/');
  }

  // decodifica el token para obtener el payload
  decodeToken(token: string): any {
    if (!token) return null;
    const payload = token.split('.')[1]; // Obtener la parte del payload del JWT
    const decodedPayload = JSON.parse(atob(payload)); // Decodificar y convertir a objeto
    return decodedPayload;
  }

  // Obtener el correo del usuario desde el Token
  getToken_correo(): number | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.sub ?? null; // Aquí se asume que el campo 'role' está en el token
    }
    return null;
  }

  // Obtener el rol del usuario desde el Token
  getToken_dni(): number | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.dni ?? null; // Aquí se asume que el campo 'role' está en el token
    }
    return null;
  }

  // Obtener el rol del usuario desde el Token
  getToken_Id_rol(): number | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.id_rol ?? null; // Aquí se asume que el campo 'role' está en el token
    }
    return null;
  }
}