import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { Producto } from 'src/app/core/shared/models/producto.interface';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as action from 'src/app/usuario.actions';
import bootstrap from 'node_modules/bootstrap/dist/js/bootstrap.js';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit, DoCheck {
  @Input() productos: Array<Producto> = [];

  @Input() titulo: string = '';

  public usuario$: Observable<any>;
  public usuario: any;
  public isLogin: boolean = false;

  public detalle: Producto = {
    producto: '',
    codigoBarra: '',
    existencia: 0,
    precios: [],
  };
  constructor(private store: Store<{ usuario: any }>) {}

  ngOnInit(): void {
    this.autenticarUsuario();
  }

  ngDoCheck() {
    if (
      this.isLogin &&
      this.productos.length == 1 &&
      this.titulo == 'Productos:' &&
      this.detalle.codigoBarra != this.productos[0].codigoBarra
    ) {
      this.cargarModal(this.productos[0]);
      this.mostrarModal();
    }
  }

  cargarModal(producto: Producto) {
    this.detalle = producto;
  }
  mostrarModal() {
    let myModal = new bootstrap.Modal(
      document.getElementById('staticBackdrop'),
      {
        focus: true,
      }
    );
    myModal.show();
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
