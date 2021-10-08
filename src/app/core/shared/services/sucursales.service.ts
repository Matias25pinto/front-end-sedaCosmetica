import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sucursal } from 'src/app/core/shared/models/sucursal.interface';

@Injectable({
  providedIn: 'root',
})
export class SucursalesService {
  private url = environment.servidorAPI;

  constructor(private http: HttpClient) {}

  getSucursales() {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Array<Sucursal>>(this.url + '/sucursales', {
      headers,
    });
  }
  getSucursal(id: string) {
    return this.http.get<Sucursal>(`${this.url}/sucursales/${id}`);
  }
  crearSucursal(token: string, body: Sucursal) {
    const headers = new HttpHeaders({ token });
    return this.http.post<Sucursal>(`${this.url}/sucursales`, body, {
      headers,
    });
  }
  modificarSucursal(token: string, id: string, body: Sucursal) {
    const headers = new HttpHeaders({ token });
    return this.http.put<Sucursal>(`${this.url}/sucursales/${id}`, body, {
      headers,
    });
  }

  eliminarSucursal(token: string, id: string) {
    const headers = new HttpHeaders({ token });
    return this.http.delete<Sucursal>(`${this.url}/sucursales/${id}`, { headers });
  }
}
