import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Abono } from '../../models/abono';
import { DetalleMovimiento } from '../../models/detalle-movimiento';
import { AbonoApi } from '../../services/abono-api';
import { DetalleMovimientoApi } from '../../services/detalle-movimiento-api';

interface PeriodoCaja {
  clave: string;
  etiqueta: string;
  dias: number;
}

@Component({
  selector: 'app-caja',
  imports: [CommonModule],
  templateUrl: './caja.html',
  styleUrl: './caja.css'
})
export class Caja {
  readonly periodos: PeriodoCaja[] = [
    { clave: 'hoy', etiqueta: 'Hoy', dias: 0 },
    { clave: '3dias', etiqueta: '3 días', dias: 3 },
    { clave: '1semana', etiqueta: '1 semana', dias: 7 },
    { clave: '1mes', etiqueta: '1 mes', dias: 30 },
    { clave: '1anio', etiqueta: '1 año', dias: 365 }
  ];
  periodoSeleccionado = 'hoy';
  ventas: DetalleMovimiento[] = [];
  abonos: Abono[] = [];
  cargando = true;
  mensajeError = '';

  get periodoActual(): PeriodoCaja {
    return this.periodos.find(periodo => periodo.clave === this.periodoSeleccionado) || this.periodos[0];
  }

  get totalVentas(): number {
    return this.ventas.reduce((total, venta) => total + this.obtenerImporteVenta(venta), 0);
  }

  get totalAbonos(): number {
    return this.abonos.reduce((total, abono) => total + Number(abono.monto || 0), 0);
  }

  constructor(
    private detalleMovimientoApi: DetalleMovimientoApi,
    private abonoApi: AbonoApi,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.cargarDatos();
  }

  cambiarPeriodo(periodo: string) {
    this.periodoSeleccionado = periodo;
    this.cargarDatos();
  }

  private cargarDatos() {
    this.cargando = true;
    this.mensajeError = '';
    const fechaDesde = this.obtenerFechaDesde(this.periodoActual.dias);

    this.detalleMovimientoApi.getDetallesMovimiento().subscribe({
      next: data => {
        const detalles = Array.isArray(data) ? data as DetalleMovimiento[] : [];
        this.ventas = detalles
          .filter(detalle => detalle.tipo === 'venta' && this.esDesdeFecha(detalle.fecha, fechaDesde))
          .sort((a, b) => this.obtenerTiempo(b.fecha) - this.obtenerTiempo(a.fecha));
        this.cargarAbonos(fechaDesde);
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'No se pudieron cargar las ventas.';
        this.cd.detectChanges();
      }
    });
  }

  private cargarAbonos(fechaDesde: Date) {
    this.abonoApi.getAbonos().subscribe({
      next: data => {
        const abonos = Array.isArray(data) ? data as Abono[] : [];
        this.abonos = abonos
          .filter(abono => this.esDesdeFecha(abono.fecha, fechaDesde))
          .sort((a, b) => this.obtenerTiempo(b.fecha) - this.obtenerTiempo(a.fecha));
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'No se pudieron cargar los abonos.';
        this.cd.detectChanges();
      }
    });
  }

  obtenerImporteVenta(venta: DetalleMovimiento): number {
    const subtotal = Number(venta.subtotal);
    return Number.isFinite(subtotal) && subtotal >= 0
      ? subtotal
      : Number(venta.cantidad || 0) * Number(venta.precioventa || 0);
  }

  obtenerNombrePersona(registro: { persona?: { apellido?: string; nombres?: string } }): string {
    const persona = registro.persona;
    return `${persona?.apellido || ''} ${persona?.nombres || ''}`.trim() || 'Sin cliente';
  }

  private obtenerFechaDesde(dias: number): Date {
    const fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    if (dias > 0) {
      fecha.setDate(fecha.getDate() - (dias - 1));
    }
    return fecha;
  }

  private esDesdeFecha(fecha: string, fechaDesde: Date): boolean {
    const fechaRegistro = new Date(fecha);
    return !Number.isNaN(fechaRegistro.getTime()) && fechaRegistro >= fechaDesde;
  }

  private obtenerTiempo(fecha: string): number {
    const tiempo = new Date(fecha).getTime();
    return Number.isNaN(tiempo) ? 0 : tiempo;
  }

  volverAlInicio() {
    this.router.navigate(['/home']);
  }
}
