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
import { CuentasComponent } from './cuentas/cuentas.component';
import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component';
import { EditarCuentaComponent } from './editar-cuenta/editar-cuenta.component';
import { SucursalComponent } from './sucursal/sucursal.component';
import { CrearSucursalComponent } from './crear-sucursal/crear-sucursal.component';
import { ModificarSucursalComponent } from './modificar-sucursal/modificar-sucursal.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { PasswordUsuarioComponent } from './password-usuario/password-usuario.component';
import { ObjetivosComponent } from './objetivos/objetivos.component';
import { CrearObjetivoComponent } from './crear-objetivo/crear-objetivo.component';
import { EditarObjetivoComponent } from './editar-objetivo/editar-objetivo.component';

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
      {
        path: 'editar-banco/:id',
        component: EditarBancoComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'cuentas/:banco',
        component: CuentasComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'crear-cuenta/:banco',
        component: CrearCuentaComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'editar-cuenta/:banco/:cuenta',
        component: EditarCuentaComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'sucursales',
        component: SucursalComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'crear-sucursal',
        component: CrearSucursalComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'editar-sucursal/:id',
        component: ModificarSucursalComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'crear-usuario',
        component: CrearUsuarioComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'editar-usuario/:id',
        component: EditarUsuarioComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'cambiar-password/:id',
        component: PasswordUsuarioComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'objetivos',
        component: ObjetivosComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'crear-objetivo',
        component: CrearObjetivoComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
	path: 'editar-objetivo/:id',
        component: EditarObjetivoComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
