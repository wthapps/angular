import { TestBed, inject } from '@angular/core/testing';

import { NgxQuillService } from './ngx-quill.service';

describe('NgxQuillService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxQuillService]
    });
  });

  it('should be created', inject([NgxQuillService], (service: NgxQuillService) => {
    expect(service).toBeTruthy();
  }));
});
