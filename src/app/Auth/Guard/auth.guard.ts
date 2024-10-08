import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../CookiesConfig/AuthService';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router)

  if (authService.isAuthenticated()) {
      return true;
  } else {
    // Redirigir al login si no está autenticado
    router.navigate(['/login']);
    console.log("Usuario NO AUTENTICADO")
    return false;
  }

};