import { createReducer, on } from '@ngrx/store';
import * as states from './usuario.actions';

export const initial = {};

const _usuarioReducer = createReducer(
  initial,
  on(states.setUsuario, (state, { usuario }) => {
    return usuario;
  }),
  on(states.getUsuario, (state) => {
    return state;
  }),
  on(states.deleteUsuario, (state) => {
    state = {};
    return state;
  })
);

export function usuarioReducer(state, action) {
  return _usuarioReducer(state, action);
}
