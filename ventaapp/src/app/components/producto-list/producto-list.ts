import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ProductoApi } from '../../services/producto-api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-producto-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css',
})
export class ProductoList {
  productos: Array<any> = [];
  nombreFiltro = '';
  fotoAmpliada: string | null = null;
  private solicitudProductos = 0;

  constructor(private productoApi: ProductoApi,
              private router: Router,
              private cd: ChangeDetectorRef) {
                this.getProductos();
              }

  getProductos(nombre = this.nombreFiltro) {
    const solicitudActual = ++this.solicitudProductos;

    this.productoApi.getProductos(nombre).subscribe((data) => {
      if (solicitudActual !== this.solicitudProductos) {
        return;
      }

      this.productos = data;
      this.cd.detectChanges();
    });
  }

  filtrarProductos() {
    this.getProductos();
  }

  limpiarFiltro() {
    this.nombreFiltro = '';
    this.getProductos();
  }

  ampliarFoto(foto: string) {
    this.fotoAmpliada = foto;
  }

  cerrarFoto() {
    this.fotoAmpliada = null;
  }

  @HostListener('document:keydown.escape')
  cerrarFotoConEscape() {
    this.cerrarFoto();
  }


  navigateTo(path: string) {
    console.log('Navegando a:', path);
    this.router.navigate([path]);
  }

  deleteProducto(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoApi.deleteProducto(id).subscribe(() => {
        this.getProductos();
        this.cd.detectChanges();
      });
    }
  }

  redirigir(path: string){
    this.router.navigate([path]);
  }
}
