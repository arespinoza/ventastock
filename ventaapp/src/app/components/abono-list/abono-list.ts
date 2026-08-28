import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Abono } from '../../models/abono';
import { AbonoApi } from '../../services/abono-api';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-abono-list',
  imports: [CommonModule],
  templateUrl: './abono-list.html',
  styleUrl: './abono-list.css'
})
export class AbonoList {
  abonos: Abono[] = [];

  constructor(
    private abonoApi: AbonoApi,
    private router: Router,
    private cd: ChangeDetectorRef,
    private toast: ToastService
  ) {
    this.cargarAbonos();
  }

  cargarAbonos() {
    this.abonoApi.getAbonos().subscribe({
      next: data => {
        this.abonos = data as Abono[];
        this.cd.detectChanges();
      },
      error: () => this.toast.show('No se pudieron cargar los abonos', 'error')
    });
  }

  eliminarAbono(id: number) {
    if (!confirm('¿Estás seguro de eliminar este abono?')) {
      return;
    }
    this.abonoApi.deleteAbono(id).subscribe({
      next: () => {
        this.toast.show('Abono eliminado exitosamente', 'success');
        this.cargarAbonos();
      },
      error: () => this.toast.show('No se pudo eliminar el abono', 'error')
    });
  }

  navegar(path: string) {
    this.router.navigateByUrl(path);
  }
}
