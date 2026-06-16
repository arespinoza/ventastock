import { Persona } from "./persona";
import { Producto } from "./producto";

export class DetalleMovimiento {
    id!: number;
    cantidad!: number;
    preciocompra!: number;
    precioventa!: number;
    subtotal!: number;
    tipo!: string;
    fecha!: string;
    convalidado!: boolean;
    razonsocial!: string;
    producto!: Producto;
    persona!: Persona;
    estadopago: string;


    constructor(){
        this.cantidad = 0;
        this.preciocompra = 0;
        this.subtotal = 0;
        this.tipo = "venta";
        this.fecha = "";
        this.convalidado = true;
        this.razonsocial = "";
        this.producto = new Producto();
        this.persona = new Persona();
        this.estadopago = "pendiente";
    }
}
