import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMovimientoList } from './detalle-movimiento-list';

describe('DetalleMovimientoList', () => {
  let component: DetalleMovimientoList;
  let fixture: ComponentFixture<DetalleMovimientoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMovimientoList],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleMovimientoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
