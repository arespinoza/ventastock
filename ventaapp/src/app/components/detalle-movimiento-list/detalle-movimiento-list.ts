import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DetalleMovimientoApi } from '../../services/detalle-movimiento-api';
import { DetalleMovimiento } from '../../models/detalle-movimiento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-movimiento-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-movimiento-list.html',
  styleUrl: './detalle-movimiento-list.css',
})
export class DetalleMovimientoList {

  detallesMovimientos: Array<DetalleMovimiento> = [];

  constructor(private detalleMovimientoApi: DetalleMovimientoApi,
              private router: Router,
              private cd: ChangeDetectorRef) {
                this.getDetallesMovimientos();
              
              }

  getDetallesMovimientos() {
    this.detalleMovimientoApi.getDetallesMovimiento().subscribe((data) => {
      console.log(data);
      this.detallesMovimientos = data as Array<DetalleMovimiento>;
      this.cd.detectChanges();
    });
  }


  navigateTo(path: string) {
    console.log('Navegando a:', path);
    this.router.navigate([path]);
  }

  deleteDetalleMovimiento(id: number) {
    if (confirm('¿Estás seguro de eliminar este detalle?')) {
      this.detalleMovimientoApi.deleteDetalleMovimiento(id).subscribe(() => {
        this.getDetallesMovimientos();
        this.cd.detectChanges();
      });
    }
  }

    redirigir(path: string){
    this.router.navigate([path]);
  }
}