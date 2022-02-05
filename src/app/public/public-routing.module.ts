import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarProductoComponent } from './buscar-producto/buscar-producto.component';
//Guards
import { ActualizarUsuarioGuard } from '../core/shared/guards/actualizar-usuario.guard';
//Components
import { HomeComponent } from './home/containers/home.component';
import { LoginComponent } from './login/login.component';
import { PublicComponent } from './public.component';
import { LocalesComponent } from './locales/locales.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/home' },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [ActualizarUsuarioGuard],
      },
      {
        path: 'locales',
        component: LocalesComponent,
        canActivate: [ActualizarUsuarioGuard],
      },
      {
        path: 'buscar/:termino/:desde',
        component: BuscarProductoComponent,
        canActivate: [ActualizarUsuarioGuard],
      },
      { path: 'login', component: LoginComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
