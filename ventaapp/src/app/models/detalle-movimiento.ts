import { Persona } from "./persona";
import { Producto } from "./producto";

export class DetalleMovimiento {
    id!: number;
    cantidad!: number;
    preciocompra!: number;
    precioventa!: number;
    subtotal!: number;
    tipo!: string;
    fecha!: Date;
    estado!: boolean;
    razonsocial!: string;
    producto!: Producto;
    persona!: Persona;


    constructor(){
        this.cantidad = 0;
        this.preciocompra = 0;
        this.subtotal = 0;
        this.tipo = "venta";
        this.fecha = new Date();
        this.estado = true;
        this.razonsocial = "";
        this.producto = new Producto();
        this.persona = new Persona();
    }
}
