import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-cuenta',
  templateUrl: './editar-cuenta.component.html',
})
export class EditarCuentaComponent implements OnInit {
  public banco: string = '';
  public idCuenta: string = '';
  constructor(private routes: ActivatedRoute) {
    this.routes.params.subscribe((params) => {
      this.banco = params['banco'];
      this.idCuenta = params['cuenta'];
    });
  }

  ngOnInit(): void {}
}
