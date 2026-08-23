import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  usuario = '';
  clave = '';
  error = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {}

  ingresar(): void {
    this.error = '';
    this.cargando = true;

    this.authService.login(this.usuario, this.clave).subscribe({
      next: () => this.router.navigate(['/home']),
      error: respuesta => {
        this.error = respuesta.error?.mensaje || 'No se pudo iniciar sesión';
        this.cargando = false;
      },
      complete: () => this.cargando = false
    });
  }
}