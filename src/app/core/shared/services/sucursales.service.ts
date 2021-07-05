import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SucursalesService {
  private url = environment.servidorAPI;

  constructor(private http: HttpClient) {}

  getSucursales() {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.url + '/sucursales', { headers });
  }
}
