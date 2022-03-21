import { TestBed } from '@angular/core/testing';

import { AddTicketService } from './add-ticket.service';

describe('AddTicketService', () => {
  let service: AddTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
