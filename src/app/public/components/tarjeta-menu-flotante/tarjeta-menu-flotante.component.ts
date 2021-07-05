import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjeta-menu-flotante',
  templateUrl: './tarjeta-menu-flotante.component.html',
  styleUrls: ['./tarjeta-menu-flotante.component.css'],
})
export class TarjetaMenuFlotanteComponent {

  @Input() fijarMenu: boolean;

  constructor(private routes: Router) {}

}
