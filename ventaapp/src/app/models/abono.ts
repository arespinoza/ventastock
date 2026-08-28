import { Persona } from './persona';

export class Abono {
  id!: number;
  monto!: number;
  fecha!: string;
  metodopago!: string;
  comentario!: string;
  personaId!: number;
  detallesMovimiento: Array<{
    detalleMovimientoId: number;
    montoAplicado: number;
    id?: number;
    producto?: { nombre: string };
    persona?: Persona;
  }> = [];
  persona?: Persona;

  constructor() {
    this.monto = 0;
    this.fecha = new Date().toISOString();
    this.metodopago = 'Efectivo';
    this.comentario = '';
    this.personaId = 0;
  }
}
