import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastService } from './services/toast';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ventaapp');

  constructor(public toastService: ToastService,
              private authService: AuthService,
              private router: Router){}

  get mostrarHeader(): boolean {
    const ruta = this.router.url.split('?')[0];
    return ruta !== '/catalogo' && ruta !== '/login';
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
