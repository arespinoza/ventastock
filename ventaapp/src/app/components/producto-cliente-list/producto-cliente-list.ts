import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoApi } from '../../services/producto-api';

@Component({
  selector: 'app-producto-cliente-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-cliente-list.html',
  styleUrl: './producto-cliente-list.css',
})
export class ProductoClienteList {
  productos: Array<any> = [];
  nombreFiltro = '';
  cargando = true;
  error = false;
  private solicitudActual = 0;

  constructor(private productoApi: ProductoApi,
              private cd: ChangeDetectorRef) {
    this.buscarProductos();
  }

  buscarProductos() {
    const solicitud = ++this.solicitudActual;
    this.cargando = true;
    this.error = false;

    this.productoApi.getProductos(this.nombreFiltro).subscribe({
      next: (data) => {
        if (solicitud !== this.solicitudActual) {
          return;
        }

        this.productos = data;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: () => {
        if (solicitud !== this.solicitudActual) {
          return;
        }

        this.cargando = false;
        this.error = true;
        this.cd.detectChanges();
      }
    });
  }

  limpiarFiltro() {
    this.nombreFiltro = '';
    this.buscarProductos();
  }
}
