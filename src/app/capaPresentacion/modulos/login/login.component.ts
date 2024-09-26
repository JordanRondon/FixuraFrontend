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
        
        const token = this.authService.getToken();
        alert("Bienvenido")
        if (token) {
          this.registroUsuarioService.getUserProfile().subscribe({
            next: (user: Usuario) => {
              
              this.route.navigate(['/muro-usuario'], { state: { user } });
            },
            error: (error) => {
              console.error('Error al obtener el perfil de usuario', error);
            }
          });
        } else console.error('TOKEN es null');
      },
      error: (error) => {
        console.error('Error durante el login', error);
        alert('Credenciales inválidas');
      }
    });
  }

}
