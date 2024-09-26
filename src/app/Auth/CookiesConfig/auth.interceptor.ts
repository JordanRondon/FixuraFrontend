import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

// Función para interceptar solicitudes HTTP y agregar el encabezado de manera automática
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectar el servicio de CookieService
  const cookieService = inject(CookieService);

  // Obtener el token de la cookie
  const token = cookieService.get('token'); // 'token' es la clave que usa en authService para guardar el token

  // Si hay un token, se clonar la solicitud y configura el encabezado de autorización
  if (token) {
    const clonedRequest = req.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      })
    });
    return next(clonedRequest);
  }

  // Si no hay token, continuar con la solicitud original
  return next(req);
};
