import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductoApi } from '../../services/producto-api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css',
})
export class ProductoList {
  productos: Array<any> = [];

  constructor(private productoApi: ProductoApi,
              private router: Router,
              private cd: ChangeDetectorRef) {
                this.getProductos();
              }

  getProductos() {
    this.productoApi.getProductos().subscribe((data) => {
      this.productos = data;
      this.cd.detectChanges();
    });
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
}
