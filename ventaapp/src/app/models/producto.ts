export class Producto {
    id!: number;
    stock!: number;
    nombre: string;
    categoria: string;
    categoriaIds: number[];
    categorias: Array<{ id: number; nombre: string }>;
    preciocompra!: number;
    precioventa!: number;
    estado: boolean;
    foto: string;

    constructor(){
        //this.stock = 0;
        this.nombre = "";
        this.categoria = "";
        this.categoriaIds = [];
        this.categorias = [];
        //this.preciocompra = 0;
        //this.precioventa = 0;
        this.estado = true;
        this.foto = '';
    }
}
