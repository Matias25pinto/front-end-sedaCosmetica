import { TestBed } from '@angular/core/testing';

import { ArqueoService } from './arqueo.service';

describe('ArqueoService', () => {
  let service: ArqueoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArqueoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
