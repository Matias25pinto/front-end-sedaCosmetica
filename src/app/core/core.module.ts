import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Importar angular material

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field'; //Para utilizar formularios de Angular Material
import { MAT_DATE_LOCALE } from '@angular/material/core';

//Shared Moduls
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    SharedModule,
  ],
  exports: [
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    SharedModule,
  ],
})
export class CoreModule {}
