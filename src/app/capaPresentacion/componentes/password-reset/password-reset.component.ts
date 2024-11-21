import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export default class PasswordResetComponent implements OnInit{

  email: string = '';

  constructor(private http: HttpClient){}

  ngOnInit(): void { }

  resetPassword(): void{
    console.log(this.email);
    this.http.post('https://fixurabackend.onrender.com/api/usuario/forgot-password', this.email).subscribe(
      () => {
        alert('El enlace para restablecer su contraseña fue enviado a su correo')
        this.email = '';
      }
    )
  }

}
