import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarUsuarioComponent } from './capaPresentacion/componentes/navbar-usuario/navbar-usuario.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarUsuarioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fixuraFrontend';
}
