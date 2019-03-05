import { TestBed } from '@angular/core/testing';

import { DataRefreshRequiredService } from './data-refresh-required.service';

describe('DataRefreshRequiredService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataRefreshRequiredService = TestBed.get(DataRefreshRequiredService);
    expect(service).toBeTruthy();
  });
});
