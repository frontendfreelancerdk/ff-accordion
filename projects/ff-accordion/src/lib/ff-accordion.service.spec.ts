import { TestBed } from '@angular/core/testing';

import { FFResizeService } from './ff-resize.service';

describe('FfAccordionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FFResizeService = TestBed.get(FFResizeService);
    expect(service).toBeTruthy();
  });
});
