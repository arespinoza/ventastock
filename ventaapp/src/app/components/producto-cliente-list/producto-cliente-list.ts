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
  categoriaFiltro = 'libreria';
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

  esCategoriaSeleccionada(categoria: string): boolean {
    return this.normalizarCategoria(this.categoriaFiltro) === this.normalizarCategoria(categoria);
  }

  private normalizarCategoria(categoria: string): string {
    return categoria.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

  async compartirPorWhatsApp(producto: any) {
    const precio = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(Number(producto.precioventa) || 0);
    const informacionProducto = `Producto: ${producto.nombre}\nPrecio: ${precio}`;

    if (producto.foto && navigator.share && navigator.canShare) {
      try {
        const respuesta = await fetch(producto.foto);
        const imagen = await respuesta.blob();
        const extension = imagen.type.split('/')[1] || 'jpg';
        const archivo = new File([imagen], `producto-${producto.id}.${extension}`, {
          type: imagen.type
        });

        if (navigator.canShare({ files: [archivo] })) {
          await navigator.share({
            files: [archivo],
            text: informacionProducto,
            title: producto.nombre
          });
          return;
        }
      } catch {
        // Continúa con el enlace de WhatsApp si no se puede adjuntar la imagen.
      }
    }

    const mensajeWhatsApp = producto.foto
      ? `${informacionProducto}\nFoto: ${producto.foto}`
      : informacionProducto;
    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensajeWhatsApp)}`;
    window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
  }

  cerrarFoto() {
    this.fotoAmpliada = null;
  }

  @HostListener('document:keydown.escape')
  cerrarFotoConEscape() {
    this.cerrarFoto();
  }
}
