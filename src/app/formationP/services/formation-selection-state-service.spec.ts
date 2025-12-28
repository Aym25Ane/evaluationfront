import { TestBed } from '@angular/core/testing';

import { FormationSelectionStateService } from './formation-selection-state-service';

describe('FormationSelectionStateService', () => {
  let service: FormationSelectionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormationSelectionStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
