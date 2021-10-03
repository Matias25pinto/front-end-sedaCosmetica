import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
})
export class CrearCuentaComponent implements OnInit {

  public idBanco = '';

  constructor(private route:ActivatedRoute) {
    this.route.params.subscribe(params => {
	this.idBanco = params['banco'];
    });
  }

  ngOnInit(): void {
  }

}
