import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoApi } from '../../services/producto-api';
import { CategoriaApi } from '../../services/categoria-api';

@Component({
  selector: 'app-producto-cliente-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-cliente-list.html',
  styleUrl: './producto-cliente-list.css',
})
export class ProductoClienteList {
  productos: Array<any> = [];
  categorias: Array<any> = [];
  nombreFiltro = '';
  categoriaFiltro = '';
  cargando = true;
  error = false;
  fotoAmpliada: string | null = null;
  private solicitudActual = 0;

  constructor(private productoApi: ProductoApi,
              private categoriaApi: CategoriaApi,
              private cd: ChangeDetectorRef) {
    this.cargarCategorias();
    this.buscarProductos();
  }

  cargarCategorias() {
    this.categoriaApi.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cd.detectChanges();
      }
    });
  }

  buscarProductos() {
    const solicitud = ++this.solicitudActual;
    this.cargando = true;
    this.error = false;

    this.productoApi.getProductos(this.nombreFiltro, this.categoriaFiltro).subscribe({
      next: (data) => {
        if (solicitud !== this.solicitudActual) {
          return;
        }

        this.productos = data.filter((producto: any) => Number(producto.stock) >= 1);
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
    this.categoriaFiltro = '';
    this.buscarProductos();
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaFiltro = categoria;
    this.buscarProductos();
  }

  obtenerMiniatura(foto: string): string {
    //const marcadorObjetoPublico = '/storage/v1/object/public/';

    //if (!foto.includes(marcadorObjetoPublico)) {
    //  return foto;
    //}

    //return foto
    //  .replace(marcadorObjetoPublico, '/storage/v1/render/image/public/')
    //  + '?width=640&height=440&resize=cover&quality=70';

    return foto;
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
}
