import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DetalleMovimiento } from '../../models/detalle-movimiento';
import { DetalleMovimientoApi } from '../../services/detalle-movimiento-api';

interface ResumenMensual {
  clave: string;
  mes: string;
  ventas: number;
  importeTotal: number;
  pagadas: number;
  importePagado: number;
  pendientes: number;
  importePendiente: number;
}

@Component({
  selector: 'app-estadistica',
  imports: [CommonModule],
  templateUrl: './estadistica.html',
  styleUrl: './estadistica.css'
})
export class Estadistica {
  resumenMensual: ResumenMensual[] = [];
  detallesPendientes: DetalleMovimiento[] = [];
  mostrarDetallesPendientes = false;
  cargandoResumen = true;
  mensajeError = '';

  get totalGeneral(): ResumenMensual {
    return this.resumenMensual.reduce((total, resumen) => ({
      clave: '',
      mes: 'Total general',
      ventas: total.ventas + resumen.ventas,
      importeTotal: total.importeTotal + resumen.importeTotal,
      pagadas: total.pagadas + resumen.pagadas,
      importePagado: total.importePagado + resumen.importePagado,
      pendientes: total.pendientes + resumen.pendientes,
      importePendiente: total.importePendiente + resumen.importePendiente
    }), {
      clave: '',
      mes: 'Total general',
      ventas: 0,
      importeTotal: 0,
      pagadas: 0,
      importePagado: 0,
      pendientes: 0,
      importePendiente: 0
    });
  }

  constructor(
    private router: Router,
    private detalleMovimientoApi: DetalleMovimientoApi,
    private cd: ChangeDetectorRef
  ) {
    this.cargarResumenMensual();
  }

  private cargarResumenMensual() {
    this.detalleMovimientoApi.getDetallesMovimiento().subscribe({
      next: data => {
        const detalles = Array.isArray(data) ? data as DetalleMovimiento[] : [];
        this.detallesPendientes = detalles
          .filter(detalle => detalle.tipo === 'venta' && detalle.estadopago === 'pendiente')
          .sort((a, b) => this.obtenerNombrePersona(a).localeCompare(this.obtenerNombrePersona(b), 'es'));
        this.resumenMensual = this.agruparVentas(detalles);
        this.cargandoResumen = false;
        this.cd.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.resumenMensual = [];
        this.cargandoResumen = false;
        this.mensajeError = error.status === 401
          ? 'La sesión expiró. Inicia sesión nuevamente para consultar las estadísticas.'
          : 'No se pudieron cargar las ventas. Intenta nuevamente.';
        this.cd.detectChanges();
      }
    });
  }

  private agruparVentas(detalles: DetalleMovimiento[]): ResumenMensual[] {
    const resumen = new Map<string, ResumenMensual>();

    detalles
      .filter(detalle => detalle.tipo === 'venta')
      .forEach(detalle => {
        const fecha = new Date(detalle.fecha);
        if (Number.isNaN(fecha.getTime())) {
          return;
        }

        const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        const importe = this.obtenerImporte(detalle);
        const pagada = detalle.estadopago === 'pagado';
        const actual = resumen.get(clave) || {
          clave,
          mes: this.formatearMes(fecha),
          ventas: 0,
          importeTotal: 0,
          pagadas: 0,
          importePagado: 0,
          pendientes: 0,
          importePendiente: 0
        };

        actual.ventas++;
        actual.importeTotal += importe;
        if (pagada) {
          actual.pagadas++;
          actual.importePagado += importe;
        } else if (detalle.estadopago === 'pendiente') {
          actual.pendientes++;
          actual.importePendiente += importe;
        }
        resumen.set(clave, actual);
      });

    return Array.from(resumen.values()).sort((a, b) => b.clave.localeCompare(a.clave));
  }

  obtenerImporte(detalle: DetalleMovimiento): number {
    const subtotal = Number(detalle.subtotal);
    if (Number.isFinite(subtotal) && subtotal >= 0) {
      return subtotal;
    }
    return Number(detalle.cantidad || 0) * Number(detalle.precioventa || 0);
  }

  private obtenerNombrePersona(detalle: DetalleMovimiento): string {
    return `${detalle.persona?.apellido || ''} ${detalle.persona?.nombres || ''}`.trim();
  }

  alternarDetallesPendientes() {
    this.mostrarDetallesPendientes = !this.mostrarDetallesPendientes;
  }

  private formatearMes(fecha: Date): string {
    const mes = new Intl.DateTimeFormat('es', { month: 'long' }).format(fecha);
    return `${mes.slice(0, 3)} - ${fecha.getFullYear()}`;
  }

  volverAlInicio() {
    this.router.navigate(['/home']);
  }
}
