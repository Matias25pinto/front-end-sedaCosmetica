import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modificar-sucursal',
  templateUrl: './modificar-sucursal.component.html',
  styleUrls: ['./modificar-sucursal.component.css'],
})
export class ModificarSucursalComponent implements OnInit {

  public idSucursal;

  constructor(private routes: ActivatedRoute) {
    this.routes.params.subscribe((params) => {
      this.idSucursal = params['id'];
    });
  }

  ngOnInit(): void {}
}
