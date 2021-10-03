import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Guards
import { AuthGuard } from '../core/shared/guards/auth.guard';
import { AdminGuard } from '../core/shared/guards/admin.guard';

//Components
import { AdminComponent } from './admin.component';
import { CrearComprobanteComponent } from './crear-comprobante/crear-comprobante.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { VerComprobantesComponent } from './ver-comprobantes/ver-comprobantes.component';
import { BancosComponent } from './bancos/bancos.component';
import { CrearBancoComponent } from './crear-banco/crear-banco.component';
import { EditarBancoComponent } from './editar-banco/editar-banco.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/menu' },
      { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
      {
        path: 'dashboard',
        component: DashboardComponent,
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
      {
        path: 'bancos',
        component: BancosComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'crear-banco',
        component: CrearBancoComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {path:'editar-banco/:id', component:EditarBancoComponent, canActivate:[AuthGuard, AdminGuard]}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
