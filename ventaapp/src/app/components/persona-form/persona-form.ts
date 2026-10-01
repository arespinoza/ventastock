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
    console.log('obtenerPrecioMovimiento - detalle:', detalle);
    const detalleMovimiento = this.detallesMovimientos.find(item =>
      item.id === (detalle.id || detalle.detalleMovimientoId)
    );
    return detalle.subtotal ?? detalleMovimiento?.subtotal ?? 0;
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

  async exportarPdf() {
    const fechaIngresada = window.prompt('Ingrese la fecha desde la que desea mostrar ventas y pagos (DD-MM-AAAA):');
    if (fechaIngresada === null) {
      return;
    }

    const fechaTexto = fechaIngresada.trim();
    const fechaDesde = fechaTexto ? this.convertirFechaDesde(fechaTexto) : null;
    if (fechaTexto && !fechaDesde) {
      window.alert('Ingrese una fecha válida con el formato DD-MM-AAAA.');
      return;
    }

    const ventas = fechaDesde
      ? this.detallesMovimientos.filter(detalle => this.esFechaDesde(detalle.fecha, fechaDesde))
      : this.detallesMovimientos;
    const abonos = fechaDesde
      ? this.abonos.filter(abono => this.esFechaDesde(abono.fecha, fechaDesde))
      : this.abonos;

    const { jsPDF } = await import('jspdf');
    const documento = new jsPDF();
    const margenIzquierdo = 15;
    const anchoTexto = 180;
    let posicionY = 15;

    const agregarTexto = (texto: string, espacioDespues = 5) => {
      const lineas = documento.splitTextToSize(texto, anchoTexto) as string[];

      if (posicionY + lineas.length * 5 > 282) {
        documento.addPage();
        posicionY = 15;
      }

      documento.text(lineas, margenIzquierdo, posicionY);
      posicionY += lineas.length * 5 + espacioDespues;
    };

    documento.setFontSize(14);
    agregarTexto('INFORMACION DEL CLIENTE', 8);
    documento.setFontSize(10);
    documento.setFont('helvetica', 'bold');
    agregarTexto([
      `Apellido: ${this.persona.apellido || '-'}`,
      `Nombres: ${this.persona.nombres || '-'}`,
      `DNI: ${this.persona.dni || '-'}`,
      `Saldo Total: ${this.formatearImporte(this.totalAdeudado)}`
    ].join(' | '), 8);
    documento.setFont('helvetica', 'normal');

    documento.setFontSize(12);
    agregarTexto(fechaDesde ? `VENTAS DESDE ${fechaTexto}` : 'VENTAS', 5);
    documento.setFontSize(10);
    if (ventas.length) {
      ventas.forEach(detalle => {
        agregarTexto([
          `ID: ${detalle.id} . `,
          `${detalle.estadopago || '-'}`,
          `${detalle.cantidad} ${detalle.producto?.nombre || '-'}`,
          `Venta: ${this.formatearImporte(detalle.precioventa)}`,
          `${this.formatearFecha(detalle.fecha)}`
        ].join(' | '), 4);
      });
    } else {
      agregarTexto('Sin ventas registradas.', 8);
    }

    documento.setFontSize(12);
    agregarTexto(fechaDesde ? `ABONOS DESDE ${fechaTexto}` : 'ABONOS', 5);
    documento.setFontSize(10);
    if (abonos.length) {
      abonos.forEach(abono => {
        agregarTexto([
          `ID: ${abono.id}`,
          `Monto: ${this.formatearImporte(abono.monto)}`,
          `Fecha: ${this.formatearFecha(abono.fecha)}`,
          `Pago: ${abono.metodopago || '-'}`
        ].join(' | '), 2);

        (abono.detallesMovimiento || []).forEach(detalle => {
          agregarTexto([
            `  #${detalle.id || detalle.detalleMovimientoId}`,
            this.obtenerNombreProducto(detalle),
            this.formatearImporte(this.obtenerPrecioMovimiento(detalle)),
            `Abona: ${this.formatearImporte(detalle.montoAplicado ?? detalle.AbonoDetalleMovimiento?.montoAplicado)}`
          ].join(' - '), 4);
        });
      });
    } else {
      agregarTexto('Sin abonos registrados.');
    }

    documento.save(`cliente-${this.persona.id || 'nuevo'}.pdf`);
  }

  private convertirFechaDesde(fecha: string): string | null {
    const partes = /^(\d{2})-(\d{2})-(\d{4})$/.exec(fecha);
    if (!partes) {
      return null;
    }

    const [, dia, mes, anio] = partes;
    const fechaConvertida = new Date(`${anio}-${mes}-${dia}T00:00:00`);
    return !Number.isNaN(fechaConvertida.getTime())
      && fechaConvertida.toISOString().slice(0, 10) === `${anio}-${mes}-${dia}`
      ? `${anio}-${mes}-${dia}`
      : null;
  }

  private esFechaDesde(fecha: string, fechaDesde: string): boolean {
    if (!fecha) {
      return false;
    }

    const fechaRegistro = new Date(fecha);
    const fechaInicial = new Date(`${fechaDesde}T00:00:00`);
    return !Number.isNaN(fechaRegistro.getTime())
      && fechaRegistro >= fechaInicial;
  }

  private formatearImporte(valor: number | undefined): string {
    return `$${Number(valor || 0).toFixed(2)}`;
  }

  formatearImporteTabla(valor: number | undefined): { principal: string; decimales: string } {
    const partes = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).formatToParts(Number(valor || 0));

    return {
      principal: partes
        .filter(parte => parte.type !== 'decimal' && parte.type !== 'fraction')
        .map(parte => parte.value)
        .join(''),
      decimales: partes.find(parte => parte.type === 'fraction')?.value || '00'
    };
  }

  private formatearFecha(fecha: string): string {
    if (!fecha) {
      return '-';
    }

    const fechaFormateada = new Date(fecha);
    if (Number.isNaN(fechaFormateada.getTime())) {
      return fecha;
    }

    return fechaFormateada.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  salir() {
    this.router.navigateByUrl(this.rutaRetorno);
  }
  redirigir(path: string){
    console.log(path);
    this.router.navigateByUrl(path);
  }
}
