import { TestBed } from '@angular/core/testing';

import { DragNdropService } from './drag-ndrop.service';

describe('DragNdropService', () => {
  let service: DragNdropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DragNdropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
