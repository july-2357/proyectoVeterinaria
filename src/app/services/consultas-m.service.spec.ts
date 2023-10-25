import { TestBed } from '@angular/core/testing';

import { ConsultasMService } from './consultas-m.service';

describe('ConsultasMService', () => {
  let service: ConsultasMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultasMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
