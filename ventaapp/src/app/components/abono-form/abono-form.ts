import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Abono } from '../../models/abono';
import { AbonoApi } from '../../services/abono-api';
import { Persona } from '../../models/persona';
import { PersonaApi } from '../../services/persona-api';
import { ToastService } from '../../services/toast';
import { DetalleMovimiento } from '../../models/detalle-movimiento';
import { DetalleMovimientoApi } from '../../services/detalle-movimiento-api';

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
	detallesMovimiento: DetalleMovimiento[] = [];
	rutaRetorno = '/abono-list';

	constructor(
		private abonoApi: AbonoApi,
		private personaApi: PersonaApi,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toast: ToastService,
		private cd: ChangeDetectorRef,
		private detalleMovimientoApi: DetalleMovimientoApi
	) {}

	ngOnInit() {
		this.rutaRetorno = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/abono-list';
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
					this.abono.personaId = this.abono.persona?.id || 0;
					this.abono.detallesMovimiento = (this.abono as any).detallesMovimiento?.map((detalle: any) => ({
						detalleMovimientoId: detalle.id,
						montoAplicado: Number(detalle.AbonoDetalleMovimiento?.montoAplicado || 0)
					})) || [];
					this.cargarDetallesMovimiento(this.abono.personaId);
					this.abono.fecha = this.toInputDate(this.abono.fecha);
					this.cd.detectChanges();
				},
				error: () => this.toast.show('No se pudo cargar el abono', 'error')
			});
		} else {
			if (personaId > 0) {
				this.abono.personaId = personaId;
				this.cargarDetallesMovimiento(personaId);
			}
			if (detalleMovimientoId > 0) {
				this.abono.detallesMovimiento = [{ detalleMovimientoId, montoAplicado: this.abono.monto }];
			}
			if (!this.abono.detallesMovimiento.length) {
				this.agregarDetalle();
			}
			this.abono.fecha = this.toInputDate(this.abono.fecha);
		}
	}

	cargarDetallesMovimiento(personaId: number, conservarAplicaciones = true) {
		if (!personaId) {
			this.detallesMovimiento = [];
			return;
		}

		this.detalleMovimientoApi.getDetallesMovimientoPersona(personaId).subscribe({
			next: detalles => {
				const detallesRecibidos = detalles as DetalleMovimiento[];
				this.detallesMovimiento = detallesRecibidos.filter(detalle =>
					detalle.persona?.id === personaId || (detalle as any).personaId === personaId
				);
				if (!this.detallesMovimiento.length && detallesRecibidos.length &&
					detallesRecibidos.every(detalle => !detalle.persona && !(detalle as any).personaId)) {
					this.detallesMovimiento = detallesRecibidos;
				}
				if (!conservarAplicaciones) {
					this.abono.detallesMovimiento = [];
					this.agregarDetalle();
				}
				this.cd.detectChanges();
			},
			error: () => this.toast.show('No se pudieron cargar los detalles de movimiento', 'error')
		});
	}

	seleccionarPersona(personaId: number | string) {
		this.abono.personaId = Number(personaId);
		this.cargarDetallesMovimiento(this.abono.personaId, false);
	}

	agregarDetalle() {
		this.abono.detallesMovimiento.push({ detalleMovimientoId: 0, montoAplicado: 0 });
	}

	quitarDetalle(indice: number) {
		if (this.abono.detallesMovimiento.length > 1) {
			this.abono.detallesMovimiento.splice(indice, 1);
		}
	}

	totalAplicado() {
		return this.abono.detallesMovimiento.reduce((total, detalle) => total + Number(detalle.montoAplicado || 0), 0);
	}

	totalAplicadoValido() {
		return Math.abs(this.totalAplicado() - Number(this.abono.monto)) <= 0.01;
	}

	actualizarMonto(monto: number) {
		this.abono.monto = Number(monto) || 0;
		if (this.abono.detallesMovimiento.length === 1 &&
			(!this.abono.detallesMovimiento[0].montoAplicado ||
			this.abono.detallesMovimiento[0].montoAplicado === 0)) {
			this.abono.detallesMovimiento[0].montoAplicado = this.abono.monto;
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
		this.router.navigateByUrl(this.rutaRetorno);
	}

	irAlInicio() {
		this.router.navigateByUrl('/home');
	}

	private toInputDate(value: string): string {
		return value ? new Date(value).toISOString().slice(0, 16) : '';
	}
}
