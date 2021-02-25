import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Importar componentes
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { BannerComponent } from './components/banner/banner.component';
import { TarjetaMenuFlotanteComponent } from './components/tarjeta-menu-flotante/tarjeta-menu-flotante.component';
import { ProductosComponent } from './components/productos/productos.component';
import { LineasComponent } from './components/lineas/lineas.component';
import { InformacionComponent } from './components/informacion/informacion.component';
import { ArqueoComponent } from './pages/arqueo/arqueo.component';
import { ArqueosComponent } from './pages/arqueos/arqueos.component';
import { ComprobantesComponent } from './pages/comprobantes/comprobantes.component';
import { CrearComprobanteComponent } from './pages/crear-comprobante/crear-comprobante.component';

//Importar modulo http
import { HttpClientModule } from '@angular/common/http';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LocalesComponent } from './pages/locales/locales.component';
import { LoginComponent } from './pages/login/login.component';

//Importar formulario reactivo
import { ReactiveFormsModule } from '@angular/forms'

// Import pdfmake-wrapper and the fonts to use
import { PdfMakeWrapper } from 'pdfmake-wrapper';
// De esta forma se importa en Angular la forma de la documentación no funciona en Angular 10
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { BuscarProductoComponent } from './pages/buscar-producto/buscar-producto.component';
import { PaginacionComponent } from './components/paginacion/paginacion.component';
import { CatalogoPdfComponent } from './components/catalogo-pdf/catalogo-pdf.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

//Importar angular material

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';//Para utilizar formularios de Angular Material
import {MAT_DATE_LOCALE} from '@angular/material/core';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { ReporteGeneralComponent } from './pages/reporte-general/reporte-general.component';
import { ReportesCuentasComponent } from './pages/reportes-cuentas/reportes-cuentas.component';//Para cambiar el lenguaje de DataPicker



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    BannerComponent,
    TarjetaMenuFlotanteComponent,
    ProductosComponent,
    LineasComponent,
    InformacionComponent,
    ContactoComponent,
    LocalesComponent,
    LoginComponent,
    BuscarProductoComponent,
    PaginacionComponent,
    CatalogoPdfComponent,
    UsuarioComponent,
    ArqueoComponent,
    ArqueosComponent,
    ComprobantesComponent,
    CrearComprobanteComponent,
    ReportesComponent,
    ReporteGeneralComponent,
    ReportesCuentasComponent,
  ],
  imports: [BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatFormFieldModule,
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'},],
  bootstrap: [AppComponent],
})
export class AppModule {}
