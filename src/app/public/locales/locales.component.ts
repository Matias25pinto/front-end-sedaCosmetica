import { Component, OnInit } from '@angular/core';
import { getMaxListeners } from 'process';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';

@Component({
  selector: 'app-locales',
  templateUrl: './locales.component.html',
  styles: [],
})
export class LocalesComponent implements OnInit {
  public locales = [];
  constructor(private sucursalesService:SucursalesService) {}

  ngOnInit(): void {

    this.sucursalesService.getSucursales().subscribe(resp=>{

      this.locales = resp.filter(sucursal => {
        let noScursales =["615f38f8d64e311ca72348e6","60e0ab1a70ddf62f246b510c"];
        if(!noScursales.includes(sucursal._id)){
          return sucursal;
        }
      });
    });
  }
}
