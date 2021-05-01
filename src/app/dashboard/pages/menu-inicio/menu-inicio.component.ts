import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArqueoService } from 'src/app/services/arqueo.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-menu-inicio',
  templateUrl: './menu-inicio.component.html',
  styleUrls: ['./menu-inicio.component.css'],
})
export class MenuInicioComponent implements OnInit {
  public branchOffices: any[] = [];
  public isSelectBranchOffice: boolean[] = [];
  public form: FormGroup;

  public usuario: any;
  public clientRole = false;
  public vendedorRole = false;
  public adminRole = false;

  public reportes: any[] = [];
  public cantidadDeInformes: number = 0;

  public start: string;
  public end: string;

  public totalVentasNetas: number = 0;
  public totalCosto: number = 0;
  public totalGasto: number = 0;
  public totalUtilidad: number = 0;
  public totalGanancia: number = 0;
  public totalRetiro: number = 0;
  public totalTarjeta: number = 0;
  public totalCheque: number = 0;
  public totalDeposito: number = 0;

  public reporteDeGasto: any[] = [];
  public totalMontoDeGasto: number = 0;

  public bancos = new Set(); //usamos un set de esta forma no se guardan los datos repetidos
  public depositoPorBanco: number[] = [];
  public totalDepositoPorBanco: number = 0;

  public cuentasBancarias = new Set();
  public cuentasBanco: string[] = [];
  public depositoPorCuenta: number[] = [];
  public totalDepositoPorCuenta: number = 0;

  public nombreDeSucursales: string[] = [];
  public ventasNetaDeSucursales: number[] = [];

  constructor(
    private sucursales: SucursalesService,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private arqueoService: ArqueoService
  ) {}

  ngOnInit(): void {
    this.crearFormulaio();
    this.cargatSucursales();
    this.subirInicio();
  }
  cargatSucursales() {
    this.sucursales.getSucursales().subscribe(
      (resp) => {
        this.branchOffices = resp['sucursalesBD'];
        this.login();
      },
      (err) => console.warn(err)
    );
  }

  crearFormulaio() {
    this.form = this.fb.group({
      sucursal: [''],
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

  // Funcion para subir al inicio
  subirInicio(): void {
    window.scroll(0, 0);
  }
  //Verificar si el usuario esta logueado
  login() {
    let loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      this.usuarioService.verificarLogin(loginToken).subscribe(
        (data) => {
          this.usuario = data['usuario'];
          if (this.usuario.role == 'CLIENT_ROLE') {
            this.clientRole = true;
          } else if (this.usuario.role == 'ADMIN_ROLE') {
            this.adminRole = true;
          } else if (this.usuario.role == 'USER_ROLE') {
            this.vendedorRole = true;
          }
          //como el login del usuario es asincrono esperamos a tener el usuario para cargar el formulario

          this.seleccionarFechaDeInicio();
        },
        (err) => {
          console.warn(err);
          // Remover el token
          localStorage.removeItem('loginToken');
          //vamos a recargar la pagina 3 segundos despues
          setTimeout(() => {
            //Recargar la pagina para que actualice el estado del usuario
            window.location.reload();
          }, 1000);
        }
      );
    }
  }
  //establecer la fecha de inicio
  seleccionarFechaDeInicio() {
    let date = new Date();
    //new Date(año, mes, día); indicamos el año y mes actual, usamos 1 como día porque todos los meses empiezan en 1
    //let primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
    let primerDia = new Date(date.getFullYear(), 2, 1);

    //new Date(año, mes, día); indicamos el año actual, al mes le sumamos + 1 de esta forma indicamos un mes superior,
    //la particularidad esta en día indicamos día 0, de esta forma el día 0 del siguiente mes es el ultimo día del mes actual.
    /*let ultimoDia = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );*/
    let ultimoDia = new Date(date.getFullYear(), 2 + 1, 0);
    this.asignarFechaStartAndEnd(primerDia, ultimoDia);
    //asignamos las fechas start al formulario
    this.form.reset({
      sucursal: '',
      start: primerDia,
      end: ultimoDia,
    });
    this.enviarFormulario();
  }

  selectBranchOffice(index: number) {
    for (let i = 0; i < this.isSelectBranchOffice.length; i++) {
      if (i == index) {
        this.isSelectBranchOffice[i] = true;
      } else {
        this.isSelectBranchOffice[i] = false;
      }
    }
  }
  asignarFechaStartAndEnd(fechaStart: Date, fechaEnd: Date) {
    try {
      this.start = `${fechaStart.getFullYear()}-${
        fechaStart.getMonth() + 1
      }-${fechaStart.getDate()}`;
      this.end = `${fechaEnd.getFullYear()}-${
        fechaEnd.getMonth() + 1
      }-${fechaEnd.getDate()}`;
    } catch {
      //Si la fecha no son validas salta error

      Swal.fire({
        allowOutsideClick: false, //false, no puede dar click en otro lugar
        title: 'Error!',
        text: 'Las dos fechas son obligatorias',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }

  enviarFormulario() {
    let loginToken = localStorage.getItem('loginToken');
    if (this.form.controls.sucursal.value != '') {
      this.asignarFechaStartAndEnd(
        this.form.controls.start.value,
        this.form.controls.end.value
      );
    }
    if (this.form.valid) {
      for (const sucursal of this.branchOffices) {
        this.arqueoService
          .getReporte(sucursal._id, loginToken, this.start, this.end)
          .subscribe(
            (data) => {
              this.cargarData(data);
            },
            (err) => {
              let data = {
                ok: true,
                sucursal: sucursal.titulo,
                desde: this.start,
                hasta: this.end,
                ventaNeta: 0,
                costo: 0,
                totalUtilidad: 0,
                totalGasto: 0,
                totalDeposito: 0,
                montoComprobantes: 0,
                ganancia: 0,
                comprobantesGasto: [],
              };
              this.cargarData(data);
            }
          );
      }
    }
  }

  //CargarData se encarga de cargar todos los informes de las sucursales en un arreglo reportes
  cargarData(data) {
    let cantidadSucursales = this.branchOffices.length;
    if (this.form.controls.sucursal.value != '') {
      if (this.form.controls.sucursal.value == data.sucursal) {
        //Cargar los reportes

        this.cargarReporteGeneral(data);

        this.cargarReporteDeGastos(data.comprobantesGasto, data.totalGasto);

        this.cargarReporteDeDepositoPorBanco(data.comprobantesDeposito);

        this.cargarReporteDeDepositoPorCuenta(data.comprobantesDeposito);
      }
    } else {
      if (data.ventaNeta > 0) {
        //Cargar los reportes
        this.cargarReporteGeneral(data);
      }
    }

    this.cantidadDeInformes++;
    if (this.cantidadDeInformes === cantidadSucursales) {
      this.generarReporte();
    }
  }
  cargarReporteGeneral(data: any) {
    //cargar el reporte general
    this.reportes.push(data);
  }
  cargarReporteDeGastos(comprobantesDeGasto: any, totalDeGasto: number) {
    //cargar el reporte de gastos
    this.reporteDeGasto = comprobantesDeGasto;
    this.totalMontoDeGasto = totalDeGasto;
  }
  cargarReporteDeDepositoPorBanco(comprobantesDeposito: any) {
    //cargar los bancos
    for (let deposito of comprobantesDeposito) {
      this.bancos.add(deposito.banco);
      //sumar el total
      this.totalDepositoPorBanco += parseInt(deposito.monto);
    }
    //cargar los montos de deposito por banco
    let indiceDeBanco: number = 0;
    for (let banco of this.bancos) {
      this.depositoPorBanco[indiceDeBanco] = 0;
      for (let deposito of comprobantesDeposito) {
        if (banco === deposito.banco) {
          this.depositoPorBanco[indiceDeBanco] += parseInt(deposito.monto);
        }
      }
      ++indiceDeBanco;
    }
  }
  cargarReporteDeDepositoPorCuenta(comprobantesDeposito: any) {
    //cargar las cuentas bancarias
    for (let deposito of comprobantesDeposito) {
      this.cuentasBancarias.add(deposito.cuentaBancaria);
      //sumar el total
      this.totalDepositoPorCuenta += parseInt(deposito.monto);
    }
    //cargar los montos de deposito por cuenta
    let indiceDeCuenta: number = 0;
    for (let cuenta of this.cuentasBancarias) {
      this.depositoPorCuenta[indiceDeCuenta] = 0;
      for (let deposito of comprobantesDeposito) {
        if (cuenta === deposito.cuentaBancaria) {
          this.depositoPorCuenta[indiceDeCuenta] += parseInt(deposito.monto);
          this.cuentasBanco[indiceDeCuenta] = deposito.banco;
        }
      }
      ++indiceDeCuenta;
    }
  }

  recargarDatos() {
    this.limpiarReporte();
    if (
      this.form.controls.start.value != '' &&
      this.form.controls.end.value != ''
    ) {
      this.enviarFormulario();
    }
  }
  limpiarReporte() {
    this.reportes = [];
    this.totalVentasNetas = 0;
    this.totalCosto = 0;
    this.totalGasto = 0;
    this.totalUtilidad = 0;
    this.totalGanancia = 0;
    this.totalRetiro = 0;
    this.totalTarjeta = 0;
    this.totalCheque = 0;
    this.totalDeposito = 0;

    this.reporteDeGasto = [];
    this.totalMontoDeGasto = 0;

    this.bancos = new Set(); //usamos un set de esta forma no se guardan los datos repetidos
    this.depositoPorBanco = [];
    this.totalDepositoPorBanco = 0;

    this.cuentasBancarias = new Set();
    this.cuentasBanco = [];
    this.depositoPorCuenta = [];
    this.totalDepositoPorCuenta = 0;

    this.cantidadDeInformes = 0;

    this.nombreDeSucursales = [];
    this.ventasNetaDeSucursales = [];
  }
  generarReporte() {
    let nombreDeSucursales: string[] = [];
    let ventasNetaDeSucursales: number[] = [];

    this.reportes.map((ventas) => {
      this.totalVentasNetas += ventas.ventaNeta;
      nombreDeSucursales.push(ventas.sucursal);
      ventasNetaDeSucursales.push(ventas.ventaNeta);
      this.totalCosto += ventas.costo;
      this.totalGasto += ventas.totalGasto;
      this.totalUtilidad += ventas.totalUtilidad;
      this.totalGanancia += ventas.ganancia;
      this.totalRetiro += ventas.totalRetiro;
      this.totalTarjeta += ventas.totalTarjeta;
      this.totalCheque += ventas.totalCheque;
      this.totalDeposito += ventas.totalDeposito;
    });
    //cargar los datos para el grafico
    this.nombreDeSucursales = nombreDeSucursales;
    this.ventasNetaDeSucursales = ventasNetaDeSucursales;
  }
  borrarFormulario() {}
}
