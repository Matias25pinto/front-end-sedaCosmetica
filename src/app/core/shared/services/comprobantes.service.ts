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
    if (sucursal != '') {
      filtros['sucursal'] = sucursal;
    }
    if (comprobante != '') {
      filtros['comprobante'] = comprobante;
    }
    if (fechaDesde) {
      filtros['fechaDesde'] = fechaDesde;
    }
    if (fechaHasta) {
      filtros['fechaHasta'] = fechaHasta;
    }
    if (desde != '') {
      filtros['desde'] = desde;
    }
    if (hasta) {
      filtros['hasta'] = hasta;
    }
    let headers = new HttpHeaders(filtros);
  
    return this.http.get(`${this.url}/comprobantes`, { headers });
  }
  agregarComprobante(loginToken: string, body: any) {
    // con headers indicamos como vamos a enviar la información
    let headers = new HttpHeaders({
      token: loginToken,
    });

    return this.http.post(this.url + `/comprobantes`, body, {
      headers,
    });
  }

  actualizarImg(token: string, id: string, body: any) {
    let headers = new HttpHeaders({
      token,
    });

    return this.http.put(
      this.url + `/comprobantes/actualizar-img/${id}`,
      body,
      {
        headers,
      }
    );
  }

  eliminarComprobante(idComprobante: string, token: string) {
    let headers = new HttpHeaders({ token });

    return this.http.delete(`${this.url}/comprobantes/${idComprobante}`, {
      headers,
    });
  }
}
