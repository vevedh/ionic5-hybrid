import { TestBed } from '@angular/core/testing';

import { VvService } from './vv.service';

describe('VvService', () => {
  let service: VvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
