import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from './capaPresentacion/modulos/landing-page/landing-page.component';
import { MuroUsuarioComponent } from './capaPresentacion/modulos/muro-usuario/muro-usuario.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingPageComponent, MuroUsuarioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fixuraFrontend';
}
