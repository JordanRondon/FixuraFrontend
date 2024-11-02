import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuariosService }  from '../../../Service/Usuarios/usuarios.service';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';
import { CommonModule } from '@angular/common';
import { AlertComponent } from 'ngx-bootstrap/alert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent implements OnInit{
  
  correo: string = '';
  contrasenia: string = '';
  errorMessage: string | null = null;

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
        console.log("Error en el component: " + error);
        this.errorMessage = error;
      }
    });
  }

}
