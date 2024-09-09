import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MuroUsuarioComponent } from "./capaPresentacion/modulos/muro-usuario/muro-usuario.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MuroUsuarioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fixuraFrontend';
}
