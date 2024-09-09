import { Routes } from '@angular/router';
import { LandingPageComponent } from './capaPresentacion/modulos/landing-page/landing-page.component';
import { MuroUsuarioComponent } from './capaPresentacion/modulos/muro-usuario/muro-usuario.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path:'muro-usuario', component:MuroUsuarioComponent },
    { path:'login', loadComponent: () => import('./capaPresentacion/modulos/login/login.component')}
];
