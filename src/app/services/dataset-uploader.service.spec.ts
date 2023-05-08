import { TestBed } from '@angular/core/testing';

import { DatasetUploaderService } from './dataset-uploader.service';

describe('DatasetUploaderService', () => {
  let service: DatasetUploaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetUploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
