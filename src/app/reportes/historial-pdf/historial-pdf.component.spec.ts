import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPdfComponent } from './historial-pdf.component';

describe('HistorialPdfComponent', () => {
  let component: HistorialPdfComponent;
  let fixture: ComponentFixture<HistorialPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
