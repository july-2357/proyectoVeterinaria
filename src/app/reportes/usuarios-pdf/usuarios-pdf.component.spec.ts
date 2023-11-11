import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosPdfComponent } from './usuarios-pdf.component';

describe('UsuariosPdfComponent', () => {
  let component: UsuariosPdfComponent;
  let fixture: ComponentFixture<UsuariosPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
