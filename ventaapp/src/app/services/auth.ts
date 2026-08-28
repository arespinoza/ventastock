import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface RespuestaLogin {
  token: string;
  usuario: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly urlLogin = 'https://aplicaciones.fce.unju.edu.ar/ventasapi/api/usuario/login';
  private readonly claveToken = 'ventaapp_token';

  constructor(private http: HttpClient) {}

  login(usuario: string, clave: string): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(this.urlLogin, { usuario, clave }).pipe(
      tap(respuesta => localStorage.setItem(this.claveToken, respuesta.token))
    );
  }

  get token(): string | null {
    return localStorage.getItem(this.claveToken);
  }

  estaAutenticado(): boolean {
    const token = this.token;
    if (!token) {
      return false;
    }

    try {
      const payload = token.split('.')[1];
      const datos = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return typeof datos.exp === 'number' && datos.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.claveToken);
  }
}