import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonaApi } from '../../services/persona-api';
import { Persona } from '../../models/persona';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast';
import { DetalleMovimiento } from '../../models/detalle-movimiento';
import { DetalleMovimientoApi } from '../../services/detalle-movimiento-api';

@Component({
  selector: 'app-persona-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './persona-form.html',
  styleUrl: './persona-form.css',
})
export class PersonaForm {
  accion: string = 'Agregar';
  persona: Persona;
  totalVentas: number = 0;

  detallesMovimientos: Array<DetalleMovimiento> = [];


    constructor(private router: Router,
              private personaApi: PersonaApi,
              private activatedRoute: ActivatedRoute,
              private cd: ChangeDetectorRef,
              private toastService: ToastService,
              private detalleMovimientoApi: DetalleMovimientoApi) {
    this.persona = new Persona();
  }

  ngOnInit(){
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id == 0) {
        this.accion = "agregar";
      }
      else {
        this.accion = "modificar";
        this.cargarPersona(id);
        this.getDetallesMovimientosPersona(id);
      }
    })
  }
  agregarPersona() {
    this.personaApi.createPersona(this.persona).subscribe(
      response => {
        console.log('Cliente agregado:', response);
        if (response.status === '1') {
          this.toastService.show('Cliente agregado exitosamente', 'success')
          this.router.navigate(['/persona-list']);
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
          this.router.navigate(['/persona-list']);
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

      //totalizar cuanto se vendio a la persona
      let total = 0;
      for (let i = 0; i < this.detallesMovimientos.length; i++) {
        total += this.detallesMovimientos[i].precioventa;
      }
      this.totalVentas = total;
      this.cd.detectChanges();
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
  salir() {
    this.router.navigate(['persona-list']);
  }
  redirigir(path: string){
    console.log(path);
    this.router.navigate([path]);
  }
}
