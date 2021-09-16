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
    return this.http.post(`${this.url}/usuarios/login`, body);
  }

  getUsuario(id, token) {
    let headers = new HttpHeaders({ token }).set(
      'Content-Type',
      'application/json'
    );
    return this.http.get(`${this.url}/usuarios/usuario/${id}`, { headers });
  }

  //cerrar sesión
  cerrarLogin() {
    // Remover el tokena
    console.log('remover token');
    localStorage.removeItem('token');
  }
}
