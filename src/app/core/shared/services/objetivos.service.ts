import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ObjetivosService {
  private url = environment.servidorAPI;

  constructor(private http: HttpClient) {}

  getObjetivos(token: string, sucursal: string, mes: number, year: number) {
    const headers = new HttpHeaders({ token });
    return this.http.get<any[]>(
      `${this.url}/objetivos?sucursal=${sucursal}&mes=${mes}&year=${year}`,
      { headers }
    );
  }

  crearObjetivo(token: string, body: any) {
    const headers = new HttpHeaders({ token });
    return this.http.post<any>(`${this.url}/objetivos`, body, { headers });
  }

  actualizarIncremento(token: string, id: string, body: any) {
    const headers = new HttpHeaders({ token });
    return this.http.put<any>(`${this.url}/objetivos/${id}`, body, {headers});
  }
}
