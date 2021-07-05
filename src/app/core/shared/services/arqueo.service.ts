import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArqueoService {
  private url = environment.servidorAPI;

  constructor(private http: HttpClient) {}

  iniciarArqueo(loginToken, body) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders({
      token: loginToken,
    }).set('Content-Type', 'application/json');

    return this.http.post(this.url + '/arqueos', body, { headers });
  }

  getArqueos(loginToken) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders({
      token: loginToken,
    }).set('Content-Type', 'application/json');

    return this.http.get(this.url + '/arqueos', { headers });
  }

  getArqueo(loginToken, id) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders({
      token: loginToken,
    }).set('Content-Type', 'application/json');

    return this.http.get(this.url + `/arqueos/${id}`, { headers });
  }

  agregarComprobante(loginToken, id, body) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders({
      token: loginToken,
    }).set('Content-Type', 'application/json');

    return this.http.put(this.url + `/arqueos/comprobantes/${id}`, body, {
      headers,
    });
  }

  anularArqueo(loginToken, id) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders({
      token: loginToken,
    }).set('Content-Type', 'application/json');

    return this.http.delete(this.url + '/arqueos/' + id, { headers });
  }

  eliminarComprobante(loginToken, id, body) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders({
      token: loginToken,
    }).set('Content-Type', 'application/json');

    return this.http.put(
      this.url + `/arqueos/comprobantes/eliminar/${id}`,
      body,
      { headers }
    );
  }

  getReporte(sucursal, loginToken, start, end) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders({
      token: loginToken,
      start,
      end,
    }).set('Content-Type', 'application/json');
    return this.http.get(this.url + `/arqueos/reporte/ventas/${sucursal}`, {
      headers,
    });
  }
}
