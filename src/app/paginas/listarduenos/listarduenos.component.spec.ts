import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarduenosComponent } from './listarduenos.component';

describe('ListarduenosComponent', () => {
  let component: ListarduenosComponent;
  let fixture: ComponentFixture<ListarduenosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarduenosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarduenosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
