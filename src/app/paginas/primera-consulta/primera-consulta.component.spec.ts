import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeraConsultaComponent } from './primera-consulta.component';

describe('PrimeraConsultaComponent', () => {
  let component: PrimeraConsultaComponent;
  let fixture: ComponentFixture<PrimeraConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimeraConsultaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeraConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
