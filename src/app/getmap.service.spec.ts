import { TestBed } from '@angular/core/testing';

import { GetmapService } from './getmap.service';

describe('GetmapService', () => {
  let service: GetmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
