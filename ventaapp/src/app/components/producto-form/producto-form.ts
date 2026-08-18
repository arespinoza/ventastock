import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoApi } from '../../services/producto-api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast';
import { SupabaseStorageService } from '../../services/supabase-storage';

@Component({
  selector: 'app-producto-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm {
  accion: string = 'Agregar';
  producto: Producto;
  fotoSeleccionada?: File;
  subiendoImagen = false;

  constructor(private router: Router,
              private productoApi: ProductoApi,
              private activatedRoute: ActivatedRoute,
              private cd: ChangeDetectorRef,
              private toastService: ToastService,
              private supabaseStorageService: SupabaseStorageService) {
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

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.fotoSeleccionada = file;
    this.subiendoImagen = true;

    try {
      const imageUrl = await this.supabaseStorageService.uploadProductImage(file);
      this.producto.foto = imageUrl;
      this.toastService.show('Foto subida correctamente', 'success');
    } catch (error: any) {
      console.error('Error al subir foto:', error);
      this.toastService.show(error?.message || 'Error al subir la foto', 'error');
    } finally {
      this.subiendoImagen = false;
      this.cd.detectChanges();
    }
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
        this.toastService.show('Error al agregar el producto', 'error');
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
        this.toastService.show('Error al modificar el producto', 'error');
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
        this.toastService.show('Error al cargar el producto', 'error');
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
