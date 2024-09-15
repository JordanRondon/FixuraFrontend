import { TestBed } from '@angular/core/testing';

import { RegistroIncidentesService } from './registro-incidentes.service';

describe('RegistroIncidentesService', () => {
  let service: RegistroIncidentesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroIncidentesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
