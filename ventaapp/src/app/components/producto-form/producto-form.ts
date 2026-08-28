import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoApi } from '../../services/producto-api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast';
import { SupabaseStorageService } from '../../services/supabase-storage';
import { CategoriaApi } from '../../services/categoria-api';
import { firstValueFrom } from 'rxjs';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-producto-form',
  imports: [FormsModule, CommonModule, ImageCropperComponent],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm {
  accion: string = 'Agregar';
  producto: Producto;
  fotoSeleccionada?: File;
  private fotoOriginal = '';
  subiendoImagen = false;
  fotoRecortada: Blob | null = null;
  editorAbierto = false;
  imagenUrlParaEditar = '';
  brillo = 100;
  categorias: any[] = [];
  categoriaIds: number[] = [];
  nuevaCategoria = { nombre: '', descripcion: '' };

  constructor(private router: Router,
              private productoApi: ProductoApi,
              private activatedRoute: ActivatedRoute,
              private cd: ChangeDetectorRef,
              private toastService: ToastService,
              private supabaseStorageService: SupabaseStorageService,
              private categoriaApi: CategoriaApi) {
    this.producto = new Producto();
  }

  ngOnInit(){
    this.categoriaApi.getCategorias().subscribe({
      next: categorias => this.categorias = categorias,
      error: () => this.toastService.show('No se pudieron cargar las categorías', 'error')
    });
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.fotoSeleccionada = file;
    this.imagenUrlParaEditar = '';
    this.fotoRecortada = null;
    if (this.producto.foto.startsWith('blob:')) {
      URL.revokeObjectURL(this.producto.foto);
    }
    this.producto.foto = URL.createObjectURL(file);
    this.cd.detectChanges();
  }

  abrirEditor(): void {
    if (!this.fotoSeleccionada && !this.producto.foto) {
      this.toastService.show('Primero selecciona o toma una foto', 'error');
      return;
    }
    this.brillo = 100;
    this.fotoRecortada = null;
    this.imagenUrlParaEditar = this.fotoSeleccionada ? '' : this.producto.foto;
    this.editorAbierto = true;
  }

  imagenRecortada(event: ImageCroppedEvent): void {
    this.fotoRecortada = event.blob ?? null;
  }

  async aplicarEdicion(): Promise<void> {
    if (!this.fotoRecortada) {
      return;
    }

    const fotoEditada = await this.aplicarBrillo(this.fotoRecortada);
    const nombre = this.fotoSeleccionada?.name.replace(/\.[^.]+$/, '') || 'producto';
    const tipo = fotoEditada.type || 'image/jpeg';
    this.fotoSeleccionada = new File([fotoEditada], `${nombre}.jpg`, { type: tipo });
    this.reemplazarPrevisualizacion(URL.createObjectURL(this.fotoSeleccionada));
    this.editorAbierto = false;
    this.imagenUrlParaEditar = '';
    this.fotoRecortada = null;
  }

  cerrarEditor(): void {
    this.editorAbierto = false;
    this.imagenUrlParaEditar = '';
    this.fotoRecortada = null;
  }

  private reemplazarPrevisualizacion(url: string): void {
    if (this.producto.foto.startsWith('blob:')) {
      URL.revokeObjectURL(this.producto.foto);
    }
    this.producto.foto = url;
  }

  private aplicarBrillo(foto: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(foto);
      const imagen = new Image();
      imagen.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = imagen.naturalWidth;
        canvas.height = imagen.naturalHeight;
        const contexto = canvas.getContext('2d');
        if (!contexto) {
          URL.revokeObjectURL(url);
          reject(new Error('No se pudo preparar la imagen'));
          return;
        }
        contexto.filter = `brightness(${this.brillo}%)`;
        contexto.drawImage(imagen, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob(resultado => {
          if (resultado) {
            resolve(resultado);
          } else {
            reject(new Error('No se pudo generar la imagen editada'));
          }
        }, 'image/jpeg', 0.9);
      };
      imagen.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('No se pudo leer la imagen'));
      };
      imagen.src = url;
    });
  }

  async agregarProducto() {
    let fotoSubida = '';
    const fotoPrevisualizada = this.producto.foto;

    try {
      this.subiendoImagen = true;
      if (this.fotoSeleccionada) {
        fotoSubida = await this.supabaseStorageService.uploadProductImage(this.fotoSeleccionada);
        this.producto.foto = fotoSubida;
      }

      const response = await firstValueFrom(this.productoApi.createProducto(this.productoConCategorias()));
      this.subiendoImagen = false;
      if (fotoPrevisualizada.startsWith('blob:')) {
        URL.revokeObjectURL(fotoPrevisualizada);
      }

        console.log('Producto agregado:', response);
        if (response.status === '1') {
          this.toastService.show('Producto agregado exitosamente', 'success');
          this.router.navigate(['/producto-list']);
        } else {
          await this.eliminarFotoSiFueSubida(fotoSubida);
          this.toastService.show('Error al agregar el producto', 'error');
        }
    } catch (error) {
      this.subiendoImagen = false;
      await this.eliminarFotoSiFueSubida(fotoSubida);
      console.error('Error al agregar el producto:', error);
      this.toastService.show('Error al agregar el producto', 'error');
    } finally {
      this.cd.detectChanges();
    }
  }

  private async eliminarFotoSiFueSubida(foto: string): Promise<void> {
    if (foto) {
      await this.supabaseStorageService.deleteProductImage(foto);
    }
  }

  async modificarProducto() {
    let fotoNueva = '';
    const fotoPrevisualizada = this.producto.foto;

    try {
      this.subiendoImagen = true;
      if (this.fotoSeleccionada) {
        fotoNueva = await this.supabaseStorageService.uploadProductImage(this.fotoSeleccionada);
        this.producto.foto = fotoNueva;
      }

      const response = await firstValueFrom(this.productoApi.updateProducto(this.productoConCategorias()));
      if (response.status === '1') {
        if (fotoNueva && this.fotoOriginal && this.fotoOriginal !== fotoNueva) {
          await this.supabaseStorageService.deleteProductImage(this.fotoOriginal);
        }
        this.liberarFotoPrevisualizada(fotoPrevisualizada);
        this.toastService.show('Producto modificado exitosamente', 'success');
        this.router.navigate(['/producto-list']);
      } else {
        await this.eliminarFotoSiFueSubida(fotoNueva);
        this.producto.foto = this.fotoOriginal;
        this.toastService.show('Error al modificar el producto', 'error');
      }
    } catch (error) {
      await this.eliminarFotoSiFueSubida(fotoNueva);
      this.producto.foto = this.fotoOriginal;
      this.liberarFotoPrevisualizada(fotoPrevisualizada);
      console.error('Error al modificar el producto:', error);
      this.toastService.show('Error al modificar el producto', 'error');
    } finally {
      this.subiendoImagen = false;
      this.cd.detectChanges();
    }
  }

  private liberarFotoPrevisualizada(foto: string): void {
    if (foto.startsWith('blob:')) {
      URL.revokeObjectURL(foto);
    }
  }

  private cargarFotoOriginal(foto: string): void {
    this.fotoOriginal = foto;
  }

  cargarProducto(id: number) {
    this.productoApi.getProducto(id).subscribe(
      response => {
        console.log('Producto cargado:', response);
        this.producto = response;
        this.cargarFotoOriginal(response.foto || '');
        this.categoriaIds = response.categorias?.map((categoria: any) => categoria.id) || [];
        this.cd.detectChanges();
      },
      error => {
        console.error('Error al cargar el producto:', error);
        this.toastService.show('Error al cargar el producto', 'error');
      }
    );
  }

  productoConCategorias(): Producto {
    return {
      ...this.producto,
      categoriaIds: this.categoriaIds
    };
  }

  alternarCategoria(id: number, event: Event): void {
    const seleccionado = (event.target as HTMLInputElement).checked;
    this.categoriaIds = seleccionado
      ? [...new Set([...this.categoriaIds, id])]
      : this.categoriaIds.filter(categoriaId => categoriaId !== id);
  }

  crearCategoria(): void {
    const nombre = this.nuevaCategoria.nombre.trim();
    if (!nombre) {
      return;
    }

    this.categoriaApi.createCategoria({ nombre, descripcion: this.nuevaCategoria.descripcion.trim() })
      .subscribe({
        next: categoria => {
          this.categorias = [...this.categorias, categoria]
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
          this.categoriaIds = [...this.categoriaIds, categoria.id];
          this.nuevaCategoria = { nombre: '', descripcion: '' };
          this.toastService.show('Categoría creada correctamente', 'success');
        },
        error: () => this.toastService.show('No se pudo crear la categoría', 'error')
      });
  }
  salir() {
    this.router.navigate(['/producto-list']);
  }

  redirigir(path: string){
    this.router.navigate([path]);
  }
}
