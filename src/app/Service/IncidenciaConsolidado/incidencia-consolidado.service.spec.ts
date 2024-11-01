import { TestBed } from '@angular/core/testing';

import { IncidenciaConsolidadoService } from './incidencia-consolidado.service';

describe('IncidenciaConsolidadoService', () => {
  let service: IncidenciaConsolidadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidenciaConsolidadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
