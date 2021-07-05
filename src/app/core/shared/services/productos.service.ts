import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from '../models/producto.interface';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private url = environment.servidorAPI;
  constructor(private http: HttpClient) {}

  productosMasVendidos() {
    return this.http.get<Array<Producto>>(`${this.url}/productos/mas-vendidos`);
  }

  nuevosProductos() {
    return this.http.get<Array<Producto>>(
      `${this.url}/productos/nuevos-productos`
    );
  }

  buscarProducto(termino: string, desde: string) {
    let token = localStorage.getItem('token');
    if (!token) {
      token = '';
    }
    let headers = new HttpHeaders({ token });
    return this.http.get<Array<Producto>>(
      `${this.url}/productos/buscar?termino=${termino}&desde=${desde}`,
      { headers }
    );
  }
}
