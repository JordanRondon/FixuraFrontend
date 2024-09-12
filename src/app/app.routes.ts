import { Routes } from '@angular/router';
import { LandingPageComponent } from './capaPresentacion/modulos/landing-page/landing-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path:'login', loadComponent: () => import('./capaPresentacion/modulos/login/login.component')},
    { path:'register', loadComponent: () => import('./capaPresentacion/modulos/register/register.component')},
    // { path:'muro-usuario', loadComponent: () => import('./capaPresentacion/modulos/muro-usuario/muro-usuario.component') }
];
