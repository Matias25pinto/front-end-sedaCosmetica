import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private usuarioService: UsuariosService,
    private router: Router
  ) {}
  async canActivate(): Promise<boolean> {
    let loginToken = localStorage.getItem('token');
    let isLogin = false;
    await new Promise((resolve, reject) => {
      this.usuarioService.verificarLogin(loginToken).subscribe(
        (data) => {
          if (data['ok']) {
            return resolve(true);
          }
          return resolve(false);
        },
        (err) => {
          // Remover el token
          localStorage.removeItem('token');
          return resolve(false);
        }
      );
    }).then((resp: boolean) => {
      isLogin = resp;
    });
    if (isLogin) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
