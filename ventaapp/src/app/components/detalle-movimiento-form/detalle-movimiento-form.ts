import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductoApi } from '../../services/producto-api';
import { Producto } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleMovimiento } from '../../models/detalle-movimiento';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaApi } from '../../services/persona-api';
import { Persona } from '../../models/persona';
import { DetalleMovimientoApi } from '../../services/detalle-movimiento-api';

@Component({
  selector: 'app-detalle-movimiento-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './detalle-movimiento-form.html',
  styleUrl: './detalle-movimiento-form.css',
})
export class DetalleMovimientoForm {
  accion: string = '';
  productos: Array<Producto>;
  personas: Array<Persona>;
  detalleMovimiento: DetalleMovimiento;
  // Variable temporal para enlazar el texto del input
  productoSeleccionadoTexto: string = '';
  personaSeleccionadaTexto: string = '';

  constructor(private router:Router,
              private productoApi: ProductoApi,
              private personaApi: PersonaApi,
              private detalleMovimientoApi: DetalleMovimientoApi,
              private activatedRoute: ActivatedRoute,
              private cd:ChangeDetectorRef) {
    this.productos = new Array<Producto>();
    this.personas = new Array<Persona>();
    this.detalleMovimiento = new DetalleMovimiento();
    this.getProductos();
    this.getPersonas();
  }
  ngOnInit(){
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id == 0) {
        this.accion = "agregar";
      }
      else {
        this.accion = "modificar";
        this.getDetalleMovimiento(id);
      }
    })
  }

  getDetalleMovimiento(id: number) {
    this.detalleMovimientoApi.getDetalleMovimiento(id).subscribe(
      data => {
        this.detalleMovimiento = data as DetalleMovimiento;
        this.productoSeleccionadoTexto = this.detalleMovimiento.producto.nombre;
        this.personaSeleccionadaTexto = `${this.detalleMovimiento.persona.apellido} ${this.detalleMovimiento.persona.nombres}`;
        this.cd.detectChanges();
      },
      error => {
        console.log(error);
      }
    )
  }

  getProductos() {
    this.productoApi.getProductos().subscribe(
      data => {
        this.productos = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getPersonas() {
    this.personaApi.getPersonas().subscribe(
      data => {
        this.personas = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  guardarDetalleMovimiento() {
    this.detalleMovimientoApi.createDetalleMovimiento(this.detalleMovimiento).subscribe(
      (response:any)=>{
            if (response.status === '1') {
              alert('Detalle agregado exitosamente');
              this.router.navigate(['/detalle-movimiento-list']);
            } else {
              alert('Error al agregar el Detalle');
            }
      },
      error=>{
        console.log(error);
      }
    )
  }

  actualizarDetalleMovimiento() {
    console.log(this.detalleMovimiento)
    this.detalleMovimientoApi.updateDetalleMovimiento(this.detalleMovimiento).subscribe(
      (response:any)=>{
        if (response.status === '1') {
          alert('Detalle actualizado')
        } else {
          alert('Error al actualizar el Detalle');
        }
        this.router.navigate(['/detalle-movimiento-list']);
      },
      error=>{
        console.log(error);
      }
    )
  }


  calcularSubtotal() {
    if (this.detalleMovimiento.tipo == 'venta') {
      this.detalleMovimiento.subtotal = this.detalleMovimiento.cantidad * this.detalleMovimiento.precioventa;
    } else if (this.detalleMovimiento.tipo == 'compra') {
      this.detalleMovimiento.subtotal = this.detalleMovimiento.cantidad * this.detalleMovimiento.preciocompra;
    }
  }

  onProductoSeleccionado() {
    // Buscamos en el arreglo el objeto que coincida exactamente con el texto del input
    const encontrado = this.productos.find(
      p => p.nombre === this.productoSeleccionadoTexto
    );

    if (encontrado) {
      // Guardamos el objeto completo en tu variable del controlador
      this.detalleMovimiento.producto = encontrado;

      // Opcional: Si quieres auto-llenar el precio de venta al elegir el producto
      this.detalleMovimiento.precioventa = encontrado.precioventa;
      this.detalleMovimiento.preciocompra = encontrado.preciocompra;
    } else {
      // Si el usuario escribe algo que no existe en la lista
      //this.detalleMovimiento.producto = null;
    }
  }

  onPersonaSeleccionada() {
    const encontrado = this.personas.find(
      p => `${p.apellido} ${p.nombres}` === this.personaSeleccionadaTexto
    );

    if (encontrado) {
      this.detalleMovimiento.persona = encontrado;
    } else {
      //this.detalleMovimiento.persona = null;
    }
  }

  redirigir(path: string){
    this.router.navigate([path]);
  }
}
