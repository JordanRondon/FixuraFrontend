import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuroAdministradorComponent } from './muro-administrador.component';

describe('MuroAdministradorComponent', () => {
  let component: MuroAdministradorComponent;
  let fixture: ComponentFixture<MuroAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuroAdministradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuroAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
