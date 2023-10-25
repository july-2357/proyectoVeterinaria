import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarMascotasComponent } from './registrar-mascotas.component';

describe('RegistrarMascotasComponent', () => {
  let component: RegistrarMascotasComponent;
  let fixture: ComponentFixture<RegistrarMascotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarMascotasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarMascotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
