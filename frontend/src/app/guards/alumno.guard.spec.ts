import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { alumnoGuard } from './alumno.guard';

describe('alumnoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => alumnoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
