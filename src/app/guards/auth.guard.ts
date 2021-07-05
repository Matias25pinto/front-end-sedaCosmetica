import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}
  canActivate(): boolean {
    let loginToken = localStorage.getItem('token');

    //verificamos si el token es valido si no lo eliminamos
    this.usuarioService.verificarLogin(loginToken).subscribe(
      (data) => {},
      (err) => {
        // Remover el token
        //localStorage.removeItem('token');
      }
    );
    //como removimos el loginToken en caso de que el token no sea valido y devuelva un error
    //solo devolvera true, si existe el loginToken
    //en caso del que token no fuera valido ya fue removido,
    //un error que se puede presentar es que si el internet es lento y tarda mucho en devolver la respuesta, el canActive va devolver 	true
    if (loginToken) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
