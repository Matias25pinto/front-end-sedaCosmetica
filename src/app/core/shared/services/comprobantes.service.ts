import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ComprobantesService {
  private url = environment.servidorAPI;
  constructor(private http: HttpClient) {}

  getComprobantes(
    token: string,
    sucursal?: string,
    comprobante?: string,
    fechaDesde?: string,
    fechaHasta?: string,
    desde?: string,
    hasta?: string
  ) {
    let filtros = {};
    filtros['token'] = token;
    if (sucursal != "") {
      filtros['sucursal'] = sucursal;
    }
    if (comprobante != "") {
      filtros['comprobante'] = comprobante;
    }
    if (fechaDesde) {
      filtros['fechaDesde'] = fechaDesde;
    }
    if (fechaHasta) {
      filtros['fechaHasta'] = fechaHasta;
    }
    if (desde != "") {
      filtros['desde'] = desde;
    }
    if (hasta) {
      filtros['hasta'] = hasta;
    }
    let headers = new HttpHeaders(filtros);
    return this.http.get(`${this.url}/comprobantes`, { headers });
  }
  eliminarComprobante(idComprobante:string, token:string){
 
    let headers = new HttpHeaders({token});

    return this.http.delete(`${this.url}/comprobantes/${idComprobante}`,{headers});
  }
}
