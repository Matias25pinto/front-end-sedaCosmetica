import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Moduls
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';

//Components
import { AdminComponent } from './admin.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

//Angular Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

//Graficos ng2 Chart
// ng2-Charts
import { ChartsModule } from 'ng2-charts';
import { IniciarArqueoComponent } from './iniciar-arqueo/iniciar-arqueo.component';
import { ArqueosComponent } from './arqueos/arqueos.component';
import { VerComprobantesComponent } from './ver-comprobantes/ver-comprobantes.component';
import { CrearComprobanteComponent } from './crear-comprobante/crear-comprobante.component';

@NgModule({
  declarations: [
    AdminComponent,
    MenuComponent,
    DashboardComponent,
    PieChartComponent,
    IniciarArqueoComponent,
    ArqueosComponent,
    VerComprobantesComponent,
    CrearComprobanteComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    ChartsModule,
  ],
})
export class AdminModule {}
