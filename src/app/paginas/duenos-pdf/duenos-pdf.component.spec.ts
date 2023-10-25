import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuenosPdfComponent } from './duenos-pdf.component';

describe('DuenosPdfComponent', () => {
  let component: DuenosPdfComponent;
  let fixture: ComponentFixture<DuenosPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuenosPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuenosPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
