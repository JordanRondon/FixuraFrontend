import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminModeratorGuard } from './admin-moderator.guard';

describe('adminModeratorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminModeratorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
