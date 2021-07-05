import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ArqueoService {
  //public url = 'http://localhost:3000'; // servicio local
  //public url = 'https://api-sedacosmetica.herokuapp.com'; //trabajar en el servidor
  public url = 'http://localhost:3000/api'; //nueva API

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
    console.log(`Esta es mi sucursal: ${sucursal}`);
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
