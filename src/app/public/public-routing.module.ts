import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarProductoComponent } from './buscar-producto/buscar-producto.component';
//Guards
import { AuthGuard} from '../core/shared/guards/auth.guard';
//Components
import { HomeComponent } from './home/containers/home.component';
import { LoginComponent } from './login/login.component';
import { PublicComponent } from './public.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/home' },
      { path: 'home', component: HomeComponent},
      { path: 'buscar/:termino/:desde', component: BuscarProductoComponent },
      { path: 'login', component: LoginComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
