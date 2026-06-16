import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoApi } from '../../services/producto-api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-producto-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm {
  accion: string = 'Agregar';
  producto: Producto;
  constructor(private router: Router,
              private productoApi: ProductoApi,
              private activatedRoute: ActivatedRoute,
              private cd: ChangeDetectorRef,
              private toastService: ToastService) {
    this.producto = new Producto();
  }
  ngOnInit(){
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id == 0) {
        this.accion = "agregar";
      }
      else {
        this.accion = "modificar";
        this.cargarProducto(id);
      }
    })
  }
  agregarProducto() {
    this.productoApi.createProducto(this.producto).subscribe(
      response => {
        console.log('Producto agregado:', response);
        if (response.status === '1') {
          this.toastService.show('Producto agregado exitosamente', 'success');
          this.router.navigate(['/producto-list']);
        } else {
          this.toastService.show('Error al agregar el producto', 'error');
        }
      },
      error => {
        console.error('Error al agregar el producto:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );

  }

  modificarProducto() {
    this.productoApi.updateProducto(this.producto).subscribe(
      response => {
        console.log('Producto modificado:', response);
        if (response.status === '1') {
          this.toastService.show('Producto modificado exitosamente', 'success');
          this.router.navigate(['/producto-list']);
        } else {
          this.toastService.show('Error al modificar el producto', 'error');
        }
      },
      error => {
        console.error('Error al modificar el producto:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );
  }

  cargarProducto(id: number) {
    this.productoApi.getProducto(id).subscribe(
      response => {
        console.log('Producto cargado:', response);
        this.producto = response;
        this.cd.detectChanges();
      },
      error => {
        console.error('Error al cargar el producto:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );
  }
  salir() {
    this.router.navigate(['/producto-list']);
  }

  redirigir(path: string){
    this.router.navigate([path]);
  }
}
