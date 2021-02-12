import { Component, OnInit, Input } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  @Input() mercaderias: any[];
  @Input() titulo: string;

  constructor(private productos: ProductosService) {
    
  }

  ngOnInit(): void {
  }
  
}
