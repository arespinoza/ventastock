import { Persona } from './persona';

export class Abono {
  id!: number;
  monto!: number;
  fecha!: string;
  metodopago!: string;
  comentario!: string;
  detalleMovimientoId!: number;
  personaId!: number;
  detalleMovimiento?: { id: number; fecha?: string; tipo?: string };
  persona?: Persona;

  constructor() {
    this.monto = 0;
    this.fecha = new Date().toISOString();
    this.metodopago = 'Efectivo';
    this.comentario = '';
    this.detalleMovimientoId = 0;
    this.personaId = 0;
  }
}
