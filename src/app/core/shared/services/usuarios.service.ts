import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private url = environment.servidorAPI;
  constructor(private http: HttpClient) {}

  loginUsuario(email: string, password: string) {
    let body = { email, password };
    return this.http.post(`${this.url}/login/iniciar-sesion`, body);
  }

  verificarLogin(loginToken) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders({ token: loginToken }).set(
      'Content-Type',
      'application/json'
    );
    return this.http.get(this.url + '/login/verificar', { headers });
  }
  //cerrar sesión
  cerrarLogin() {
    // Remover el tokena
    console.log('remover token');
    //localStorage.removeItem('token');
  }
}
