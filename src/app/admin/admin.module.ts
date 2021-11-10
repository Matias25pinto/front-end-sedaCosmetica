import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Moduls
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

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

//Import Pulbic Module
import { PublicModule } from '../public/public.module';
import { BancosComponent } from './bancos/bancos.component';
import { CrearBancoComponent } from './crear-banco/crear-banco.component';
import { FormularioBancoComponent } from './components/formulario-banco/formulario-banco.component';
import { EditarBancoComponent } from './editar-banco/editar-banco.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component';
import { EditarCuentaComponent } from './editar-cuenta/editar-cuenta.component';
import { FormularioCuentaComponent } from './components/formulario-cuenta/formulario-cuenta.component';
import { SucursalComponent } from './sucursal/sucursal.component';
import { CrearSucursalComponent } from './crear-sucursal/crear-sucursal.component';
import { ModificarSucursalComponent } from './modificar-sucursal/modificar-sucursal.component';
import { FormularioSucursalComponent } from './components/formulario-sucursal/formulario-sucursal.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { PasswordUsuarioComponent } from './password-usuario/password-usuario.component';
import { ObjetivosComponent } from './objetivos/objetivos.component';
import { CrearObjetivoComponent } from './crear-objetivo/crear-objetivo.component';
import { EditarObjetivoComponent } from './editar-objetivo/editar-objetivo.component';

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
    BancosComponent,
    CrearBancoComponent,
    FormularioBancoComponent,
    EditarBancoComponent,
    CuentasComponent,
    CrearCuentaComponent,
    EditarCuentaComponent,
    FormularioCuentaComponent,
    SucursalComponent,
    CrearSucursalComponent,
    ModificarSucursalComponent,
    FormularioSucursalComponent,
    UsuariosComponent,
    CrearUsuarioComponent,
    EditarUsuarioComponent,
    PasswordUsuarioComponent,
    ObjetivosComponent,
    CrearObjetivoComponent,
    EditarObjetivoComponent,
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
    PublicModule,
  ],
})
export class AdminModule {}
