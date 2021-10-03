import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Cuenta } from '../models/cuenta.interface';

@Injectable({
  providedIn: 'root',
})
export class CuentasService {
  private url = environment.servidorAPI;
  constructor(private http: HttpClient) {}

  cuentas(token: string, banco: string) {
    let headers = new HttpHeaders({ token, banco });
    return this.http.get<Array<Cuenta>>(`${this.url}/cuentas/`, { headers });
  }
  crearCuenta(token: string, body: Cuenta) {
    let headers = new HttpHeaders({ token });
    return this.http.post<Cuenta>(`${this.url}/cuentas/`, body, { headers });
  }

  getCuenta(token: string, id: string) {
    let headers = new HttpHeaders({ token });
    return this.http.get<Cuenta>(`${this.url}/cuentas/${id}`, { headers });
  }

  editarCuenta(token: string, body: Cuenta, id: string) {
    let headers = new HttpHeaders({ token });
    return this.http.put<Cuenta>(`${this.url}/cuentas/${id}`, body, {
      headers,
    });
  }

  eliminarCuenta(token: string, id: string) {
    let headers = new HttpHeaders({ token });
    return this.http.delete<Cuenta>(`${this.url}/cuentas/${id}`, { headers });
  }
}
