import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaIncidenciasComponent } from './mapa-incidencias.component';

describe('MapaIncidenciasComponent', () => {
  let component: MapaIncidenciasComponent;
  let fixture: ComponentFixture<MapaIncidenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaIncidenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaIncidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
