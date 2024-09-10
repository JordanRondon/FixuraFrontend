import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from './capaPresentacion/modulos/landing-page/landing-page.component';
import LoginComponent from "./capaPresentacion/modulos/login/login.component";
import RegisterComponent from "./capaPresentacion/modulos/register/register.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingPageComponent, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fixuraFrontend';
}
