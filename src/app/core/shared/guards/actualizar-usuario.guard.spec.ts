import { TestBed } from '@angular/core/testing';

import { ActualizarUsuarioGuard } from './actualizar-usuario.guard';

describe('ActualizarUsuarioGuard', () => {
  let guard: ActualizarUsuarioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ActualizarUsuarioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
