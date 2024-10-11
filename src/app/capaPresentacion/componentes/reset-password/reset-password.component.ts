import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export default class ResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private http: HttpClient
  ) { }

  ngOnInit(): void { }

  private getTokenFromUrl(): string | null {
    return this.route.snapshot.queryParamMap.get('token');
  }

  updatePassword(): void{
    if(this.newPassword === this.confirmPassword){
      this.http.post('http://localhost:8080/api/usuario/reset-password', {
        token: this.getTokenFromUrl(),
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      })
      .subscribe(() => {
        alert('Contraseña Cambiada')
        this.router.navigate(['/login']);
      });

    }else{
      alert('Las contraseñas no coinciden');
    }
  }
}
