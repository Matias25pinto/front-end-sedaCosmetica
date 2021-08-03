import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Guards
import { AuthGuard } from '../core/shared/guards/auth.guard';
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
      { path: '', component: MenuComponent, canActivate: [AuthGuard] },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'iniciar-arqueo',
        component: IniciarArqueoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'arqueos',
        component: ArqueosComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ver-comprobantes',
        component: VerComprobantesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'crear-comprobante',
        component: CrearComprobanteComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
