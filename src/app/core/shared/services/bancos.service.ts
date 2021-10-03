import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Banco } from '../models/banco.interface';

@Injectable({
  providedIn: 'root',
})
export class BancosService {
  private url = environment.servidorAPI;

  constructor(private http: HttpClient) {}

  bancos(token: string) {
    let headers = new HttpHeaders({ token });
    return this.http.get<Array<Banco>>(`${this.url}/bancos`, { headers });
  }

  buscarBanco(token: string, nombre: string) {
    let headers = new HttpHeaders({ token });
    return this.http.get<Array<Banco>>(
      `${this.url}/bancos?nombre=${nombre.toUpperCase()}`,
      { headers }
    );
  }
  crearBanco(token: string, body: Banco) {
    let headers = new HttpHeaders({ token });
    return this.http.post<Banco>(`${this.url}/bancos/`, body, { headers });
  }
  editarBanco(token: string, body: Banco, id: string) {
    let headers = new HttpHeaders({ token });
    return this.http.put<Banco>(`${this.url}/bancos/${id}`, body, { headers });
  }
  getBanco(token: string, id: string) {
    let headers = new HttpHeaders({ token });
    return this.http.get<Banco>(`${this.url}/bancos/${id}`, { headers });
  }
  eliminarBanco(token: string, id: string) {
    let headers = new HttpHeaders({ token });
    return this.http.delete<Banco>(`${this.url}/bancos/${id}`, { headers });
  }
}
