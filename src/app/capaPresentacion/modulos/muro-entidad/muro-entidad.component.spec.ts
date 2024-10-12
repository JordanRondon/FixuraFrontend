import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuroEntidadComponent } from './muro-entidad.component';

describe('MuroEntidadComponent', () => {
  let component: MuroEntidadComponent;
  let fixture: ComponentFixture<MuroEntidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuroEntidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuroEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
