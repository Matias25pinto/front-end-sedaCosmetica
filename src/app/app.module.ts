import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Importar modulo http
import { HttpClientModule } from '@angular/common/http';

//Importar formulario reactivo
import { ReactiveFormsModule } from '@angular/forms';

// Import pdfmake-wrapper and the fonts to use
import { PdfMakeWrapper } from 'pdfmake-wrapper';
// De esta forma se importa en Angular la forma de la documentación no funciona en Angular 10
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

//Importar angular material

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field'; //Para utilizar formularios de Angular Material
import { MAT_DATE_LOCALE } from '@angular/material/core';

//La localidad de la app
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localEs from '@angular/common/locales/es';
registerLocaleData(localEs);

//Modulos propios
import { StoreModule } from '@ngrx/store';
//ngrx
import { usuarioReducer } from './usuario.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    StoreModule.forRoot({ usuario: usuarioReducer }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
