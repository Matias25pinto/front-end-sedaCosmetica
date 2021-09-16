import { createAction, props } from '@ngrx/store';

export const setUsuario = createAction(
  'SetUsuario',
  props<{ usuario: any }>()
);
export const getUsuario = createAction('GetUsuario');
export const deleteUsuario = createAction('DeleteUsuario');
