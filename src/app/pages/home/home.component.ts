import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public novedades: any[];
  public destacados: any[];
  constructor(private productos: ProductosService) {
   
  }

  ngOnInit(): void { 

    
    this.subirInicio();
  
    this.productos.getNovedades().subscribe((data) => {
      this.novedades = data['mercaderias'];
    });
    this.productos.getDestacados().subscribe((data) => {
      this.destacados = data['mercaderias'];
    });
  }
   // Funcion para subir al inicio
   subirInicio(): void{
    window.scroll(0, 0);
  }
}
