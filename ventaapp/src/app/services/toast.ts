import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Usamos Signals de Angular para un rendimiento óptimo
  mensaje = signal<string | null>(null);
  tipo = signal<'success' | 'error'>('success');

  show(msg: string, type: 'success' | 'error' = 'success') {
    this.mensaje.set(msg);
    this.tipo.set(type);
    setTimeout(() => this.mensaje.set(null), 3000); // Se oculta a los 3 segundos
  }
}
