import { Component, OnInit, Input } from '@angular/core';
import { Producto } from 'src/app/core/shared/models/producto.interface';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  @Input() productos: Array<Producto> = [];

  @Input() titulo: string = '';

  public detalle: Producto = {
    producto: 'Producto de prueba',
    codigoBarra: '123456',
    existencia: 0,
    precios: [],
  };
  public verMas: boolean = false;
  constructor() {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (token) {
      this.verMas = true;
    }
  }

  cargarModal(producto: Producto) {
    this.detalle = producto;
    console.log(this.detalle);
  }
}
