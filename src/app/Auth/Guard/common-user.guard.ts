import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../CookiesConfig/AuthService';
import { Router } from '@angular/router';

export const commonUserGuard: CanActivateFn = (route, state) => {
      
  const authService = inject(AuthService);
  const router = inject(Router)
  
  const COMMON_USER = 3;

  const userId_rol = authService.getToken_Id_rol();

  if (userId_rol === COMMON_USER) {
      return true;
  } else {
    // Redirigir al login si no tiene los permisos de 3: usuario-commún
    router.navigate(['/login']);
    console.log("Usuario SIN PERMISOS")
    return false;
  }

};
