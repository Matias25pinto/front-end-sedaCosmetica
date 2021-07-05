import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Importar angular material

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field'; //Para utilizar formularios de Angular Material
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatFormFieldModule,
  ],
  exports: [
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatFormFieldModule,
  ],
})
export class CoreModule {}
