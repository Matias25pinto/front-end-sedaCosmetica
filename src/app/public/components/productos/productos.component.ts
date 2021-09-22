import { Component, OnInit, Input } from '@angular/core';
import { Producto } from 'src/app/core/shared/models/producto.interface';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as action from 'src/app/usuario.actions';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  @Input() productos: Array<Producto> = [];

  @Input() titulo: string = '';

  public usuario$: Observable<any>;
  public usuario: any;
  public isLogin: boolean = false;

  public detalle: Producto = {
    producto: 'Producto de prueba',
    codigoBarra: '123456',
    existencia: 0,
    precios: [],
  };
  constructor(private store: Store<{ usuario: any }>) {}

  ngOnInit(): void {
    this.autenticarUsuario();
  }

  cargarModal(producto: Producto) {
    this.detalle = producto;
  }

  autenticarUsuario() {
    this.usuario$ = this.store.select('usuario');

    this.store.dispatch(action.getUsuario());

    this.usuario$.subscribe((data) => {
        this.usuario = data;
      if (this.usuario.role !== undefined) {
        this.isLogin = true;
      }
    });
  }
}
