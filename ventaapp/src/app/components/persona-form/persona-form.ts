import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonaApi } from '../../services/persona-api';
import { Persona } from '../../models/persona';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast';
import { DetalleMovimiento } from '../../models/detalle-movimiento';
import { DetalleMovimientoApi } from '../../services/detalle-movimiento-api';
import { Abono } from '../../models/abono';
import { AbonoApi } from '../../services/abono-api';

@Component({
  selector: 'app-persona-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './persona-form.html',
  styleUrl: './persona-form.css',
})
export class PersonaForm {
  accion: string = 'Agregar';
  persona: Persona;
  rutaRetorno = '/persona-list';

  detallesMovimientos: Array<DetalleMovimiento> = [];
  abonos: Array<Abono> = [];


    constructor(private router: Router,
              private personaApi: PersonaApi,
              private activatedRoute: ActivatedRoute,
              private cd: ChangeDetectorRef,
              private toastService: ToastService,
              private detalleMovimientoApi: DetalleMovimientoApi,
              private abonoApi: AbonoApi) {
    this.persona = new Persona();
  }

  ngOnInit(){
    this.rutaRetorno = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/persona-list';
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id == 0) {
        this.accion = "agregar";
      }
      else {
        this.accion = "modificar";
        this.cargarPersona(id);
        this.getDetallesMovimientosPersona(id);
        this.getAbonosPersona(id);
      }
    })
  }
  agregarPersona() {
    this.personaApi.createPersona(this.persona).subscribe(
      response => {
        console.log('Cliente agregado:', response);
        if (response.status === '1') {
          this.toastService.show('Cliente agregado exitosamente', 'success')
          this.router.navigateByUrl(this.rutaRetorno);
        } else {
          this.toastService.show('Error al agregar el cliente', 'error')
        }
      },
      error => {
        console.error('Error al agregar el cliente:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );

  }

  modificarPersona() {
    this.personaApi.updatePersona(this.persona).subscribe(
      response => {
        console.log('Cliente modificado:', response);
        if (response.status === '1') {
          this.toastService.show('Cliente modificado exitosamente', 'success')
          this.router.navigateByUrl(this.rutaRetorno);
        } else {
          this.toastService.show('Error al modificar el cliente', 'error')
        }
      },
      error => {
        console.error('Error al modificar el cliente:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );
  }

  cargarPersona(id: number) {
    this.personaApi.getPersona(id).subscribe(
      response => {
        console.log('Cliente cargado:', response);
        this.persona = response;
        this.cd.detectChanges();
      },
      error => {
        console.error('Error al cargar el cliente:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );
  }


  getDetallesMovimientosPersona(id:number) {
    this.detalleMovimientoApi.getDetallesMovimientoPersona(id).subscribe((data) => {
      console.log(data);
      this.detallesMovimientos = data as Array<DetalleMovimiento>;
      this.cd.detectChanges();
    });
  }

  getAbonosPersona(id: number) {
    this.abonoApi.getAbonos(undefined, id).subscribe(
      data => {
        this.abonos = data as Array<Abono>;
        this.cd.detectChanges();
      },
      error => {
        console.error('Error al cargar los abonos de la persona:', error);
        this.toastService.show('No se pudieron cargar los abonos', 'error');
      }
    );
  }

  get totalAdeudado(): number {
    return this.detallesMovimientos
      .filter(detalle => detalle.estadopago === 'pendiente')
      .reduce((total, detalle) => {
        const subtotal = Number(detalle.subtotal);
        const importe = Number.isFinite(subtotal) && subtotal > 0
          ? subtotal
          : Number(detalle.cantidad || 0) * Number(detalle.precioventa || 0);
        const adelantos = this.abonos.reduce((totalAbonos, abono) =>
          totalAbonos + abono.detallesMovimiento
            .filter(aplicacion => (aplicacion.id || aplicacion.detalleMovimientoId) === detalle.id)
            .reduce((totalAplicado, aplicacion) =>
              totalAplicado + Number(aplicacion.montoAplicado || aplicacion.AbonoDetalleMovimiento?.montoAplicado || 0), 0), 0);

        return total + Math.max(importe - adelantos, 0);
      }, 0);
  }

  obtenerNombreProducto(detalle: Abono['detallesMovimiento'][number]): string {
    if (detalle.producto?.nombre) {
      return detalle.producto.nombre;
    }

    const detalleMovimiento = this.detallesMovimientos.find(item =>
      item.id === (detalle.id || detalle.detalleMovimientoId)
    );
    return detalleMovimiento?.producto?.nombre || 'Producto no disponible';
  }

  obtenerPrecioMovimiento(detalle: Abono['detallesMovimiento'][number]): number {
    const precioIncluido = detalle.tipo === 'compra'
      ? detalle.preciocompra
      : detalle.precioventa;
    if (precioIncluido !== undefined) {
      return precioIncluido;
    }

    const detalleMovimiento = this.detallesMovimientos.find(item =>
      item.id === (detalle.id || detalle.detalleMovimientoId)
    );
    return detalleMovimiento?.tipo === 'compra'
      ? detalleMovimiento.preciocompra
      : detalleMovimiento?.precioventa || 0;
  }

  abonoMenorQuePrecio(detalle: Abono['detallesMovimiento'][number]): boolean {
    const montoAplicado = detalle.montoAplicado ?? detalle.AbonoDetalleMovimiento?.montoAplicado ?? 0;
    return Number(montoAplicado) < this.obtenerPrecioMovimiento(detalle);
  }

  abonoCompleto(detalle: Abono['detallesMovimiento'][number]): boolean {
    const montoAplicado = detalle.montoAplicado ?? detalle.AbonoDetalleMovimiento?.montoAplicado ?? 0;
    return Number(montoAplicado) >= this.obtenerPrecioMovimiento(detalle);
  }

  editarAbono(id: number) {
    this.redirigir(`/abono-form/${id}?returnUrl=/persona-form/${this.persona.id}`);
  }

  eliminarAbono(id: number) {
    if (!confirm('¿Estás seguro de eliminar este abono?')) {
      return;
    }

    this.abonoApi.deleteAbono(id).subscribe({
      next: response => {
        if ((response as { status?: string }).status === '1') {
          this.toastService.show('Abono eliminado exitosamente', 'success');
          this.getAbonosPersona(this.persona.id);
        } else {
          this.toastService.show('No se pudo eliminar el abono', 'error');
        }
      },
      error: error => {
        console.error('Error al eliminar el abono:', error);
        this.toastService.show('No se pudo eliminar el abono', 'error');
      }
    });
  }

  deleteDetalleMovimiento(id: number) {
    if (confirm('¿Estás seguro de eliminar este detalle?')) {
      this.detalleMovimientoApi.deleteDetalleMovimiento(id).subscribe(() => {
        this.getDetallesMovimientosPersona(id);
        this.cd.detectChanges();
      });
    }
  }
  marcarDetalleMovimientoPagado(detalle: DetalleMovimiento) {
    if (detalle.estadopago === 'pagado') {
      return;
    }

    if (confirm('¿Confirmas marcar este detalle de movimiento como pagado?')) {
      this.detalleMovimientoApi.updateDetalleMovimiento({
        id: detalle.id,
        estadopago: 'pagado'
      }).subscribe({
        next: response => {
          if ((response as { status: string }).status === '1') {
            detalle.estadopago = 'pagado';
            this.toastService.show('Detalle marcado como pagado', 'success');
          } else {
            this.toastService.show('No se pudo marcar el detalle como pagado', 'error');
          }
        },
        error: error => {
          console.error('Error al marcar el detalle como pagado:', error);
          this.toastService.show('Error al marcar el detalle como pagado', 'error');
        }
      });
    }
  }
  salir() {
    this.router.navigateByUrl(this.rutaRetorno);
  }
  redirigir(path: string){
    console.log(path);
    this.router.navigateByUrl(path);
  }
}
