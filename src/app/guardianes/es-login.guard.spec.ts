import { TestBed } from '@angular/core/testing';

import { EsLoginGuard } from './es-login.guard';

describe('EsLoginGuard', () => {
  let guard: EsLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EsLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
