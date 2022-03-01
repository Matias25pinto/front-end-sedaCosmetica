import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/core/shared/models/producto.interface';
import { ProductosService } from 'src/app/core/shared/services/productos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public productosMasVendidos: Array<Producto> = [];
  public nuevosProductos: Array<Producto> = [];
  constructor(private productosServices: ProductosService) {
    this.productosServices.productosMasVendidos().subscribe((resp) => {
      this.productosMasVendidos = resp;
      console.log("productosMasVendidos:",this.productosMasVendidos);
    });

    this.productosServices.nuevosProductos().subscribe((resp) => {
      this.nuevosProductos = resp;
      console.log("nuevosProductos:",this.nuevosProductos);
    });
  }

  ngOnInit(): void {}
}
