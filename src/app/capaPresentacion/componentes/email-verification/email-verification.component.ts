import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgIf} from '@angular/common'; 


@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [NgIf],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css'
})
export default class EmailVerificationComponent implements OnInit {
  message: string = '';
  success: boolean = false;

  private readonly API_URL = 'http://localhost:8080/api/usuario/verification';
  private readonly SUCCESS_MESSAGE = "Correo Verificado Correctamente";
  private readonly ERROR_MESSAGE = "Error al Verificar el correo";
  private readonly TOKEN_NOT_PROVIDED_MESSAGE = 'Token no proporcionado.';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router

  ){}

  ngOnInit(): void {
    const token = this.getTokenFromUrl();
    
    if (token) {
      this.verifyEmail(token);
    } else {
      this.message = this.TOKEN_NOT_PROVIDED_MESSAGE;
      this.success = false;
    }
  }

  private getTokenFromUrl(): string | null {
    return this.route.snapshot.queryParamMap.get('token');
  }

  private verifyEmail(token: string): void {
    this.http.get<any>(`${this.API_URL}?token=${token}`).subscribe({
      next: () => {
        this.message = this.SUCCESS_MESSAGE;
        this.success = true;
      },
      error: () => {
        this.message = this.ERROR_MESSAGE;
        this.success = false;
      }
    });
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

}
