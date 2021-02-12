import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogoPdfComponent } from './components/catalogo-pdf/catalogo-pdf.component';
import { AuthGuard } from './guards/auth.guard';
import { ArqueoComponent } from './pages/arqueo/arqueo.component';
import { ArqueosComponent } from './pages/arqueos/arqueos.component';
import { BuscarProductoComponent } from './pages/buscar-producto/buscar-producto.component';
import { ComprobantesComponent } from './pages/comprobantes/comprobantes.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { CrearComprobanteComponent } from './pages/crear-comprobante/crear-comprobante.component';
import { HomeComponent } from './pages/home/home.component';
import { LocalesComponent } from './pages/locales/locales.component';
import { LoginComponent } from './pages/login/login.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'locales', component: LocalesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'buscar/:termino/:desde', component: BuscarProductoComponent },
  { path: 'catalogo', component: CatalogoPdfComponent },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
  { path: 'arqueo', component: ArqueoComponent, canActivate: [AuthGuard] },
  { path: 'arqueo/:id', component: ArqueoComponent, canActivate: [AuthGuard] },
  { path: 'arqueos', component:ArqueosComponent, canActivate:[AuthGuard]},
  { path: 'comprobantes/:id', component: ComprobantesComponent, canActivate: [AuthGuard] },
  { path: 'crear/comprobante/:id', component: CrearComprobanteComponent, canActivate: [AuthGuard] },
  { path: 'reportes', component:ReportesComponent, canActivate:[AuthGuard]},
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
