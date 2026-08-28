import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Abono } from '../../models/abono';
import { AbonoApi } from '../../services/abono-api';
import { Persona } from '../../models/persona';
import { PersonaApi } from '../../services/persona-api';
import { ToastService } from '../../services/toast';

@Component({
	selector: 'app-abono-form',
	imports: [CommonModule, FormsModule],
	templateUrl: './abono-form.html',
	styleUrl: './abono-form.css'
})
export class AbonoForm {
	accion = 'Agregar';
	abono = new Abono();
	personas: Persona[] = [];

	constructor(
		private abonoApi: AbonoApi,
		private personaApi: PersonaApi,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toast: ToastService,
		private cd: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.personaApi.getPersonas().subscribe({
			next: personas => {
				this.personas = personas;
				this.cd.detectChanges();
			},
			error: () => this.toast.show('No se pudieron cargar las personas', 'error')
		});

		const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
		const personaId = Number(this.activatedRoute.snapshot.queryParamMap.get('personaId'));
		const detalleMovimientoId = Number(this.activatedRoute.snapshot.queryParamMap.get('detalleMovimientoId'));

		if (id > 0) {
			this.accion = 'Modificar';
			this.abonoApi.getAbono(id).subscribe({
				next: data => {
					this.abono = data as Abono;
					this.abono.detalleMovimientoId = this.abono.detalleMovimiento?.id || 0;
					this.abono.personaId = this.abono.persona?.id || 0;
					this.abono.fecha = this.toInputDate(this.abono.fecha);
					this.cd.detectChanges();
				},
				error: () => this.toast.show('No se pudo cargar el abono', 'error')
			});
		} else {
			if (personaId > 0) {
				this.abono.personaId = personaId;
			}
			if (detalleMovimientoId > 0) {
				this.abono.detalleMovimientoId = detalleMovimientoId;
			}
			this.abono.fecha = this.toInputDate(this.abono.fecha);
		}
	}

	guardar() {
		const operacion = this.accion === 'Agregar'
			? this.abonoApi.createAbono(this.abono)
			: this.abonoApi.updateAbono(this.abono);

		operacion.subscribe({
			next: (response: any) => {
				if (response.status === '1') {
					this.toast.show(`Abono ${this.accion === 'Agregar' ? 'agregado' : 'modificado'} exitosamente`, 'success');
					this.salir();
				} else {
					this.toast.show(response.msg || 'No se pudo guardar el abono', 'error');
				}
			},
			error: () => this.toast.show('No se pudo guardar el abono', 'error')
		});
	}

	salir() {
		this.router.navigateByUrl('/abono-list');
	}

	irAlInicio() {
		this.router.navigateByUrl('/home');
	}

	private toInputDate(value: string): string {
		return value ? new Date(value).toISOString().slice(0, 16) : '';
	}
}
