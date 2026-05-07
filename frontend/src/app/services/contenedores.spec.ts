import { TestBed } from '@angular/core/testing';

import { Contenedores } from './contenedores';

describe('Contenedores', () => {
  let service: Contenedores;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Contenedores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
