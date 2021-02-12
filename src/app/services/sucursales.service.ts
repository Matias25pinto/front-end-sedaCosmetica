import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  //public url = 'http://localhost:3000';// servicio local
  public url = 'https://api-sedacosmetica.herokuapp.com'; //trabajar en el servidor

  constructor(private http: HttpClient) { }

  getSucursales() {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.url+'/sucursales', {headers});
  }
}
