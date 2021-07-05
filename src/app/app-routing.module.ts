import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogoPdfComponent } from './components/catalogo-pdf/catalogo-pdf.component';
import { AuthGuard } from './guards/auth.guard';
import { ArqueoComponent } from './pages/arqueo/arqueo.component';
import { ArqueosComponent } from './pages/arqueos/arqueos.component';
import { ComprobantesComponent } from './pages/comprobantes/comprobantes.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { CrearComprobanteComponent } from './pages/crear-comprobante/crear-comprobante.component';
import { HomeComponent } from './pages/home/home.component';
import { LocalesComponent } from './pages/locales/locales.component';
import { ReporteGeneralComponent } from './pages/reporte-general/reporte-general.component';
import { ReportesCuentasComponent } from './pages/reportes-cuentas/reportes-cuentas.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
//Componentes
import { MenuInicioComponent } from './dashboard/pages/menu-inicio/menu-inicio.component';
import { PublicModule } from './public/public.module';
import { AdminModule } from './admin/admin.module';

const routes: Routes = [
  { path: 'contacto', component: ContactoComponent },
  { path: 'locales', component: LocalesComponent },
  { path: 'catalogo', component: CatalogoPdfComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'arqueo', component: ArqueoComponent },
  { path: 'arqueo/:id', component: ArqueoComponent },
  { path: 'arqueos', component: ArqueosComponent },
  {
    path: 'comprobantes/:id',
    component: ComprobantesComponent,
  },
  {
    path: 'crear/comprobante/:id',
    component: CrearComprobanteComponent,
  },
  { path: 'reportes', component: ReportesComponent },
  {
    path: 'reporte/general',
    component: ReporteGeneralComponent,
  },
  {
    path: 'reportes/cuentas',
    component: ReportesCuentasComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./public/public.module').then((module) => PublicModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((module) => AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
