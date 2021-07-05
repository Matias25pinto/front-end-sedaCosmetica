import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { AdminComponent } from './admin.component';
import { ArqueosComponent } from './arqueos/arqueos.component';
import { CrearComprobanteComponent } from './crear-comprobante/crear-comprobante.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IniciarArqueoComponent } from './iniciar-arqueo/iniciar-arqueo.component';
import { MenuComponent } from './menu/menu.component';
import { VerComprobantesComponent } from './ver-comprobantes/ver-comprobantes.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: MenuComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'iniciar-arqueo', component: IniciarArqueoComponent },
      { path: 'arqueos', component: ArqueosComponent },
      { path: 'ver-comprobantes/:id', component: VerComprobantesComponent },
      { path: 'crear-comprobante/:id', component: CrearComprobanteComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
