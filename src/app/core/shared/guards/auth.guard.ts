import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as action from 'src/app/usuario.actions';
import { map } from 'rxjs/operators';
import { UsuariosService } from 'src/app/core/shared/services/usuarios.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public usuario$: Observable<any>;
  constructor(
    private store: Store<{ usuario: any }>,
    private router: Router,
    private usuarioService: UsuariosService
  ) {
    this.usuario$ = this.store.select('usuario');
  }
  canActivate(): Promise<boolean> | Observable<boolean> {
    try {
      let token = '';
      let id = '';
      try {
        token = localStorage.getItem('token');
      } catch (e) {
        token = '';
      }

      if (token != '') {
        const decoded = jwt_decode(token);
        id = decoded['_id'];
        const date = new Date(0);
        date.setUTCSeconds(decoded['exp']);
        if (date < new Date()) {
          this.store.dispatch(action.deleteUsuario());
          throw new Error('Ya expiro el token');
        }
      } else {
        this.store.dispatch(action.deleteUsuario());
        throw new Error('No existe token');
      }
      return this.usuarioService.getUsuario(id, token).pipe(
        map((data) => {
          this.store.dispatch(action.setUsuario({ usuario: data }));
          return true;
        })
      );
    } catch (err) {
      console.log(err);
      this.store.dispatch(action.deleteUsuario());
      this.router.navigate(['login']);
      return new Observable<boolean>((observable) => {
        setTimeout((data) => {
          return false;
        }, 1000);
      });
    }
  }
}
