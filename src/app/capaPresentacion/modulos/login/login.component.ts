import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {UsuariosService}  from '../../../Service/Usuarios/usuarios.service';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent implements OnInit{
  
  correo: string = '';
  contrasenia: string = '';

  constructor(
    private registroUsuarioService: UsuariosService, 
    private route: Router,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    
  }

  onLogin(){
    this.registroUsuarioService.login(this.correo, this.contrasenia).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        
        const userRole = this.authService.getToken_Id_rol();
        var url: string = ''

        switch (userRole) {
          case 1: 
          case 2: url = '/muro-administrador'; break;
          case 3: url = '/muro-entidad'; break;
          default: url = '/login';
        }

        this.route.navigate([url]);
      },
      error: (error) => {
        console.error('Error durante el login', error);
        alert('Credenciales inválidas');
      }
    });
  }

}
