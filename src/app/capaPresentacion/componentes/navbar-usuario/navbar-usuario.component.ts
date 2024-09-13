import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-usuario.component.html',
  styleUrls: ['./navbar-usuario.component.css']
})

export class NavbarUsuarioComponent {
  isDropdownVisible: boolean = false;

  toggleDropdown(): void {
    //habilita la visualizacion del menu desplegable
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  closeDropdown(): void {
    //dehabilita la visualizacion del menu desplegable
    this.isDropdownVisible = false;
  }
}
