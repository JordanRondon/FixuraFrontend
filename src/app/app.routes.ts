import { Routes } from '@angular/router';
import { LandingPageComponent } from './capaPresentacion/modulos/landing-page/landing-page.component';
import { MuroAdministradorComponent } from './capaPresentacion/modulos/muro-administrador/muro-administrador.component';


export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path:'muro-administrador', component:MuroAdministradorComponent},
    { path:'login', loadComponent: () => import('./capaPresentacion/modulos/login/login.component')},
    { path:'register', loadComponent: () => import('./capaPresentacion/modulos/register/register.component')},
    { path:'muro-usuario', loadComponent: () => import('./capaPresentacion/modulos/muro-usuario/muro-usuario.component') }
];
