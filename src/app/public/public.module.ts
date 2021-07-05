import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Modules
import { PublicRoutingModule } from './public-routing.module';
//Components
import { PublicComponent } from './public.component';
import { HomeComponent } from './home/containers/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TarjetaMenuFlotanteComponent } from './components/tarjeta-menu-flotante/tarjeta-menu-flotante.component';
import { FooterComponent } from './components/footer/footer.component';
import { BannerComponent } from './home/components/banner/banner.component';
import { ProductosComponent } from './components/productos/productos.component';
import {BuscarProductoComponent} from './buscar-producto/buscar-producto.component';
import {LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent,
    NavbarComponent,
    TarjetaMenuFlotanteComponent,
    FooterComponent,
    BannerComponent,
    ProductosComponent,
    BuscarProductoComponent,
    LoginComponent
  ],
  imports: [CommonModule, PublicRoutingModule, ReactiveFormsModule],
})
export class PublicModule {}
