import { TestBed } from '@angular/core/testing';

import { StatsServiceService } from './stats-service.service';

describe('StatsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatsServiceService = TestBed.get(StatsServiceService);
    expect(service).toBeTruthy();
  });
});
