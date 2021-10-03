import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-banco',
  templateUrl: './editar-banco.component.html',
})
export class EditarBancoComponent implements OnInit {
  public idBanco: string;

  constructor(private routes: ActivatedRoute) {
    this.routes.params.subscribe((params) => {
      this.idBanco = params['id'];
    });
  }

  ngOnInit(): void {}
}
