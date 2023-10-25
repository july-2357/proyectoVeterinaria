import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMascotasPdfComponent } from './lista-mascotas-pdf.component';

describe('ListaMascotasPdfComponent', () => {
  let component: ListaMascotasPdfComponent;
  let fixture: ComponentFixture<ListaMascotasPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaMascotasPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaMascotasPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
