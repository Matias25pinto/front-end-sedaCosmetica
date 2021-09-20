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

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {path:'', pathMatch: 'full', redirectTo: '/menu'},
      { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard, AdminGuard],
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
