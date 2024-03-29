import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as action from 'src/app/usuario.actions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  public usuario$: Observable<any>;
  public usuario: any;

  public sucursales = [];

  constructor(
    private store: Store<{ usuario: any }>,
    private sucursalesService: SucursalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subirInicio();

    this.sucursalesService.getSucursales().subscribe((data) => {
      this.sucursales = data['sucursalesBD'];
    });

    this.autenticarUsuario();
  }
  autenticarUsuario() {
    this.usuario$ = this.store.select('usuario');

    this.store.dispatch(action.getUsuario());

    this.usuario$.subscribe((data) => {
      this.usuario = data;
    });
  }
  // Funcion para subir al inicio
  subirInicio(): void {
    window.scroll(0, 0);
  }

  dashboard() {
    this.router.navigate(['admin', 'dashboard']);
  }

  cargarComprobante() {
    this.router.navigate(['admin', 'crear-comprobante']);
  }

  verComprobantes() {
    this.router.navigate(['admin', 'ver-comprobantes']);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.store.dispatch(action.deleteUsuario());
    this.router.navigate(['', 'login']);
  }
}
