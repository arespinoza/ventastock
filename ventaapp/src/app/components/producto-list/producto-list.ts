import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
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

  obtenerMiniatura(foto: string): string {
    /**
    const marcadorObjetoPublico = '/storage/v1/object/public/';

    if (!foto.includes(marcadorObjetoPublico)) {
      return foto;
    }

    return foto
      .replace(marcadorObjetoPublico, '/storage/v1/render/image/public/')
      + '?width=96&height=96&resize=cover&quality=65';
    **/
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


  navigateTo(path: string) {
    console.log('Navegando a:', path);
    this.router.navigate([path]);
  }

  deleteProducto(producto: any) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoApi.deleteProducto(producto.id).subscribe(() => {
        this.getProductos();
        this.cd.detectChanges();
      });
    }
  }

  async compartirPorWhatsApp(producto: any) {
    const informacionProducto = [
      `Producto: ${producto.nombre}`,
      `ID: ${producto.id}`,
      `Estado: ${producto.estado ? 'Vigente' : 'No vigente'}`,
      `Stock: ${producto.stock}`,
      `Precio de venta: $${producto.precioventa}`
    ].join('\n');

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
        // Usa WhatsApp Web como alternativa si se cancela o no se puede adjuntar.
      }
    }

    const mensajeWhatsApp = producto.foto
      ? `${informacionProducto}\nFoto: ${producto.foto}`
      : `${informacionProducto}\nFoto: Sin foto`;
    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensajeWhatsApp)}`;
    window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
  }

  redirigir(path: string){
    this.router.navigate([path]);
  }
}
