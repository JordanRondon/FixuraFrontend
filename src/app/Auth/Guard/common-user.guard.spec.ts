import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { commonUserGuard } from './common-user.guard';

describe('commonUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => commonUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
