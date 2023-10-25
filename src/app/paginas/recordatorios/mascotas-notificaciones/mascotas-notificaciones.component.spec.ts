import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotasNotificacionesComponent } from './mascotas-notificaciones.component';

describe('MascotasNotificacionesComponent', () => {
  let component: MascotasNotificacionesComponent;
  let fixture: ComponentFixture<MascotasNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MascotasNotificacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotasNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
