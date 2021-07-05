import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/core/shared/models/producto.interface';
import { ProductosService } from 'src/app/core/shared/services/productos.service';

@Component({
  selector: 'app-buscar-producto',
  templateUrl: './buscar-producto.component.html',
  styleUrls: ['./buscar-producto.component.css'],
})
export class BuscarProductoComponent implements OnInit {
  public termino: string;
  public desde: string;
  public pagina: number;
  public paginas: any[] = [];
  public productos: Array<Producto> = [];
  public sinProductos = false;

  constructor(
    private ruta: ActivatedRoute,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.ruta.params.subscribe((parametros) => {
      this.termino = parametros.termino || 'el término de búsqueda';
      this.desde = parametros.desde;
      this.cargarProductos(this.termino, this.desde);
    });
  }
  cargarProductos(termino: string, desde: string) {
    this.productosService.buscarProducto(termino, desde).subscribe((resp) => {
      this.productos = resp;
      if (resp.length === 0) {
        this.sinProductos = true;
      } else {
        this.sinProductos = false;
      }
    });
  }
  siguiente() {
    this.desde = (parseInt(this.desde) + 10).toString();
    this.cargarProductos(this.termino, this.desde);
  }

  anterior() {
    this.desde = (parseInt(this.desde) - 10).toString();
    if (parseInt(this.desde) >= 0) {
      this.cargarProductos(this.termino, this.desde);
    }else{
      this.desde = "0";
    }
  }
}
