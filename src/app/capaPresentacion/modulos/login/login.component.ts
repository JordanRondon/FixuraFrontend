import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RegistroUsuariosService } from '../../../Service/registro-usuarios.service';
import { Usuario } from '../../../Model/Usuario';

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
    private route: Router
  ){}

  ngOnInit(): void {
    
  }

  onLogin(){
    this.registroUsuarioService.login(this.correo, this.contrasenia).subscribe(
      user => {
        alert("Bienvenido")
        this.route.navigate(['/muro-usuario'], {state: {user}});
      },
      error => {
        console.error('Error durante el inicio de sesión', error);
        alert('Credenciales inválidas');
      }
    );
  }

}
