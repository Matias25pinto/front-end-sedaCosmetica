import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from '../../../core/shared/models/usuario.interface';

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

  getUsuarios(token: string) {
    const headers = new HttpHeaders({ token });
    return this.http.get<Array<Usuario>>(`${this.url}/usuarios`, { headers });
  }

  getUsuario(id: string, token: string) {
    let headers = new HttpHeaders({ token }).set(
      'Content-Type',
      'application/json'
    );
    return this.http.get<Usuario>(`${this.url}/usuarios/usuario/${id}`, {
      headers,
    });
  }

  crearUsuario(token: string, body: Usuario) {
    const headers = new HttpHeaders({ token });
    return this.http.post<Usuario>(`${this.url}/usuarios`, body, { headers });
  }

  editarUsuario(id: string, token: string, body: Usuario) {
    const headers = new HttpHeaders({ token });
    return this.http.put<Usuario>(`${this.url}/usuarios/${id}`, body, {
      headers,
    });
  }

  eliminarUsuario(id: string, token:string) {
    const headers = new HttpHeaders({ token });
    return this.http.delete<Usuario>(`${this.url}/usuarios/${id}`, { headers });
  }

  //cerrar sesión
  cerrarLogin() {
    // Remover el tokena
    console.log('remover token');
    localStorage.removeItem('token');
  }
}
