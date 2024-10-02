import { TestBed } from '@angular/core/testing';

import { IncidenciaLikeService } from './incidencia-like.service';

describe('IncidenciaLikeService', () => {
  let service: IncidenciaLikeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidenciaLikeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
