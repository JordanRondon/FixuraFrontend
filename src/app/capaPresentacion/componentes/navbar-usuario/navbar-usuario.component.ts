import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule  } from '@angular/router';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';
import { CommonUserDirective } from 'app/Auth/Directive/common-user.directive';

@Component({
  selector: 'app-navbar-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, CommonUserDirective],
  templateUrl: './navbar-usuario.component.html',
  styleUrls: ['./navbar-usuario.component.css']
})

export class NavbarUsuarioComponent {
  isDropdownVisible: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  toggleDropdown(): void {
    //habilita la visualizacion del menu desplegable
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  closeDropdown(): void {
    //dehabilita la visualizacion del menu desplegable
    this.isDropdownVisible = false;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout():void {
    this.authService.deleteToken();
  }
}
