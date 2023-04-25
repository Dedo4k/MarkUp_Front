import { TestBed } from '@angular/core/testing';

import { DatasetStorageService } from './dataset-storage.service';

describe('DatasetStorageService', () => {
  let service: DatasetStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
