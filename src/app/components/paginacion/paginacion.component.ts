import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.css']
})
export class PaginacionComponent implements OnInit {

  @Input() termino: string;
  @Input() pagina: number;
  @Input() paginas: any[];
  public paginasIniciales = [];
  public paginasFinales = [];
  public limite: number;

  constructor(private routes: Router) { 

  }

  ngOnInit(): void {
    
  }
  //Cargar paginas
  async cargarPaginas() {
    this.limite = this.paginas.length;
    let cont = this.pagina;
    for (let index = 0; index < 3; index++) {
      this.paginasIniciales[index] = await this.paginas[cont];
      cont++;
    }
    cont = 0;
    for (let index = this.paginas.length; index > this.paginas.length-3; index--) {
      
      this.paginasFinales[cont] = await this.paginas[index];
      
    }

    console.log('inicio: ', this.paginasIniciales);
    console.log('final', this.paginasFinales);
  }
 //Enivamos a la ruta de buscar
  buscarMercaderia(desde) {
    desde = String(desde);
    console.log(this.termino, desde);
    this.routes.navigate(['buscar', this.termino, desde]);
    this.subirInicio();
  }
  // Funcion para subir al inicio
  subirInicio(): void{
    window.scroll(0, 0);
  }
   
}
