import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //public url = 'http://localhost:3000';// servicio local
  public url = 'https://api-sedacosmetica.herokuapp.com'; //trabajar en el servidor

  constructor(private http: HttpClient) {
    
  }
  login(email, password) {
    return this.http.post(this.url + `/login`, { email, password });
  }
  verificarLogin(loginToken) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders({token:loginToken}).set('Content-Type', 'application/json');
    return this.http.get(this.url + '/login/verificar', { headers });
  }
   //cerrar sesión
   cerrarLogin() {
    // Remover el token
    localStorage.removeItem('loginToken');
   }

  
}
