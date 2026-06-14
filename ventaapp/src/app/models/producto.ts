export class Producto {
    id!: number;
    stock: number;
    nombre: string;
    categoria: string;
    preciocompra: number;
    precioventa: number;
    estado: boolean;

    constructor(){
        this.stock = 0;
        this.nombre = "";
        this.categoria = "";
        this.preciocompra = 0;
        this.precioventa = 0;
        this.estado = true;
    }
}
