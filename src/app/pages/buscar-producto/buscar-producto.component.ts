import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-buscar-producto',
  templateUrl: './buscar-producto.component.html',
  styleUrls: ['./buscar-producto.component.css']
})
export class BuscarProductoComponent implements OnInit {

  public termino: string;
  public desde: string;
  public pagina: number;
  public paginas: any[] = [];
  public mercaderias: any[] = [];
  public sinMercaderias = false;

  constructor(private ruta: ActivatedRoute, private http: ProductosService) { 
    
  }

  ngOnInit(): void {
    this.ruta.params.subscribe(termino => {
      this.termino = termino.termino || 'el término de búsqueda';
      this.desde = termino.desde;
      this.http.getBuscar(this.termino,this.desde).subscribe(data => {
        this.mercaderias = data['mercaderias'];
        this.pagina = data['pagina'];
        this.paginas = [];
        for (let index = 0; index < data['paginas']; index++) {
          this.paginas[index] = index;
        }

        if (this.mercaderias.length == 0) {
          this.sinMercaderias = true;
        }
      }, err => {
          console.log(`No hay resultados para ${this.termino}`)
      });
    })
  }
}
