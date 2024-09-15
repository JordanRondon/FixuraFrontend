import { TestBed } from '@angular/core/testing';

import { ObtenerIncidentesService } from './obtener-incidentes.service';

describe('ObtenerIncidentesService', () => {
  let service: ObtenerIncidentesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObtenerIncidentesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
