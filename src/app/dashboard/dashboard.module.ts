import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Componentes
import { MenuInicioComponent } from './pages/menu-inicio/menu-inicio.component';

//Importar formulario reactivo
import { ReactiveFormsModule } from '@angular/forms';

//Angular Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

//Graficos ng2 Chart
// ng2-Charts
import { ChartsModule } from 'ng2-charts';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

@NgModule({
  declarations: [MenuInicioComponent, PieChartComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  exports: [MenuInicioComponent],
})
export class DashboardModule {}