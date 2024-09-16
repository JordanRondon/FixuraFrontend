import { TestBed } from '@angular/core/testing';

import { DepartamentoServiceService } from './departamento-service.service';

describe('DepartamentoServiceService', () => {
  let service: DepartamentoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartamentoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
