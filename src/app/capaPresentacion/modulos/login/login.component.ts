import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RegistroUsuariosService } from '../../../Service/registro-usuarios.service';
import { Usuario } from '../../../Model/Usuario';
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
    private registroUsuarioService: RegistroUsuariosService, 
    private route: Router,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    
  }

  onLogin(){
    this.registroUsuarioService.login(this.correo, this.contrasenia).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.route.navigate(['/muro-usuario']);
        alert("Bienvenido")   
      },
      error: (error) => {
        console.error('Error durante el login', error);
        alert('Credenciales inválidas');
      }
    });
  }

}
