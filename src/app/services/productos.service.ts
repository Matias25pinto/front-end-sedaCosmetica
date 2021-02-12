import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  //public url = 'http://localhost:3000';// servicio local
  public url = 'https://api-sedacosmetica.herokuapp.com'; //trabajar en el servidor

  constructor(private http: HttpClient) {}

  getProductos() {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.url + '/mercaderias', { headers });
  }
  getNovedades() {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.url + '/mercaderias/ultimas', { headers });
  }
  getDestacados() {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.url + '/mercaderias/masvendidas', { headers });
  }
  getBuscar(termino, desde) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.url + `/mercaderias/buscar/${termino}?desde=${desde}`, { headers });
  }
  getMarca(marca) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.url + `/mercaderias/marca/${marca}`, { headers });
  }
  
}
