import { Routes } from '@angular/router';
import { LandingPageComponent } from './capaPresentacion/modulos/landing-page/landing-page.component';
import { authGuard } from './Auth/Guard/auth.guard';
import { adminModeratorGuard } from './Auth/Guard/admin-moderator.guard';
import { commonUserGuard } from './Auth/Guard/common-user.guard';

export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    { 
        path: 'register',
        loadComponent: () => import('./capaPresentacion/modulos/register/register.component')
    },
    {
        path: 'login',
        loadComponent: () => import('./capaPresentacion/modulos/login/login.component')
    },
    {
        path: 'muro-administrador',
        loadComponent: () => import('./capaPresentacion/modulos/muro-administrador/muro-administrador.component'),
        canActivate: [authGuard, adminModeratorGuard]
    },
    {
        path: 'muro-usuario',
        loadComponent: () => import('./capaPresentacion/modulos/muro-usuario/muro-usuario.component'),
        canActivate: [authGuard, commonUserGuard],
    },
    {
        path: 'verify-email',
        loadComponent: () => import('./capaPresentacion/componentes/email-verification/email-verification.component'),
    },
    {
        path: 'password-reset',
        loadComponent: () => import('./capaPresentacion/componentes/password-reset/password-reset.component'),
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./capaPresentacion/componentes/reset-password/reset-password.component'),
    }
];
