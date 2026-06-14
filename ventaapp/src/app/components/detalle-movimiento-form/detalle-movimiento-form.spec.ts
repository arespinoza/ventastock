import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMovimientoForm } from './detalle-movimiento-form';

describe('DetalleMovimientoForm', () => {
  let component: DetalleMovimientoForm;
  let fixture: ComponentFixture<DetalleMovimientoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMovimientoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleMovimientoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
