import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../CookiesConfig/AuthService';
import { Router } from '@angular/router';

export const adminModeratorGuard: CanActivateFn = (route, state) => {
    
  const authService = inject(AuthService);
  const router = inject(Router)

  const ADMIN_ROLE = 1;
  const MODERATOR_ROLE = 2;

  const userId_rol = authService.getToken_Id_rol();

  if (userId_rol === ADMIN_ROLE || userId_rol === MODERATOR_ROLE) {
      return true;
  } else {
    // Redirigir al login si no tiene los permisos de 1: Administrador o 2: Moderador
    router.navigate(['/login']);
    console.log("Usuario SIN PERMISOS de Administrador o Moderador")
    return false;
  }

};
