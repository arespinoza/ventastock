export class Persona {
    id!: number;
    dni: string; 
    apellido: string;
    nombres: string;
    referencia: string;
    correo_electronico: string;
    nro_celular: string;
    constructor(){
        this.dni = "";
        this.apellido = "";
        this.nombres = "";
        this.referencia = "";
        this.correo_electronico = "";
        this.nro_celular = "";
    }
}
