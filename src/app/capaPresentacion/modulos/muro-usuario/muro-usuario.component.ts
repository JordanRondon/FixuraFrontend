import { Component } from '@angular/core';
import { NavbarUsuarioComponent } from '../../componentes/navbar-usuario/navbar-usuario.component';

@Component({
  selector: 'app-muro-usuario',
  standalone: true,
  imports: [NavbarUsuarioComponent],
  templateUrl: './muro-usuario.component.html',
  styleUrl: './muro-usuario.component.css'
})
export class MuroUsuarioComponent {

}
