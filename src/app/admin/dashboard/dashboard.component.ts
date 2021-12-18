import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArqueoService } from 'src/app/core/shared/services/arqueo.service';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';

import Swal from 'sweetalert2';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; // Todavía no lo usamos

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as action from 'src/app/usuario.actions';

import { Sucursal } from 'src/app/core/shared/models/sucursal.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public branchOffices: Sucursal[] = [];
  public isSelectBranchOffice: boolean[] = [];
  public form: FormGroup;
  public loading: boolean = false;

  public clientRole = false;
  public vendedorRole = false;
  public adminRole = false;

  public isDownloadPDF: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

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
  public reporteDeDepositos: any[] = [];

  public cuentasBancarias = new Set();
  public cuentasBanco: string[] = [];
  public depositoPorCuenta: number[] = [];
  public totalDepositoPorCuenta: number = 0;

  public nombreDeSucursales: string[] = [];
  public ventasNetaDeSucursales: number[] = [];

  public comprobantesRetiro: any[] = [];
  public totalComprobantesRetiro: number = 0;

  public comprobantesTarjeta: any[] = [];
  public totalComprobantesTarjeta: number = 0;

  public usuario$: Observable<any>;
  public usuario: any;

  constructor(
    private sucursales: SucursalesService,
    private fb: FormBuilder,
    private arqueoService: ArqueoService,
    private store: Store<{ usuario: any }>
  ) {}

  ngOnInit(): void {
    this.subirInicio();
    this.crearFormulaio();
    this.autenticarUsuario();
  }

  autenticarUsuario() {
    this.usuario$ = this.store.select('usuario');

    this.store.dispatch(action.getUsuario());

    this.usuario$.subscribe((data) => {
      this.usuario = data;
      this.sucursales.getSucursales().subscribe(async (sucursales) => {
        if (this.usuario.role !== 'ADMIN_ROLE') {
          sucursales.filter((sucursal) => {
            if (sucursal._id == this.usuario.sucursal) {
              this.branchOffices.push(sucursal);
              return sucursal;
            }
            return;
          });
        } else {
          this.branchOffices = sucursales;
        }
        this.seleccionarFechaDeInicio();
        this.recargarDatos();
      });
    });
  }

  async downloadPDF(
    idElemento: string,
    cantRows: number = 1,
    titulo: string = 'sin_titulo',
    isDownloadPDFid: number
  ) {
    let usuarioImpresor = `${this.usuario.nombre} ${this.usuario.apellido} - ${this.usuario.email}`;
    this.isDownloadPDF[isDownloadPDFid] = true;
    let fecha = new Date().toLocaleString('es-PY', {
      timeZone: 'America/Asuncion',
    });
    const doc = new jsPDF('p', 'pt', 'a4');

    // Extraemos el elemento
    const options = {
      background: 'white',
      scale: 3,
    };
    let pageHeight = doc.internal.pageSize.getHeight() - 30;
    let DATA: any[] = [];
    if (
      this.usuario['role'] === 'ADMIN_ROLE' &&
      idElemento === 'reporte-general'
    ) {
      DATA.push(document.getElementById('pie-graphic'));
    }
    DATA.push(document.getElementById(`${idElemento}-titulo`));
    DATA.push(document.getElementById(`${idElemento}-header`));
    for (let i = 0; i < cantRows; i++) {
      DATA.push(document.getElementById(`${idElemento}-${i}`));
    }
    DATA.push(document.getElementById(`${idElemento}-footer`));
    let bufferY = 15; //La posición horizontal de la hijamen

    for await (let elemento of DATA) {
      //Creamos la imgaen canvas
      await html2canvas(elemento, options).then((canvas) => {
        const img = canvas.toDataURL('image/PNG');
        // Add image Canvas to PDF
        const bufferX = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        //agregamos al doc la img
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        //aumentamos la posición del eje y
        bufferY = bufferY + pdfHeight;
        if (bufferY >= pageHeight) {
          doc.addPage();
          bufferY = 15;
        }
      });
    }
    //Agregamos pie de página
    doc.setFontSize(8);
    doc.setFont('courier');
    doc.text(
      `${fecha}\n ${usuarioImpresor}\n www.sedacosmetica.com`,
      doc.internal.pageSize.width / 2,
      pageHeight,
      {
        align: 'center',
      }
    );

    //Creamos el pdf y descargamos
    doc.save(`${fecha}_${titulo}_sedacosmetica.pdf`);
    //Cambiamos el estado de Download
    this.isDownloadPDF[isDownloadPDFid] = false;
  }

  cargatSucursales() {
    this.sucursales.getSucursales().subscribe(
      (sucursales) => {
        this.branchOffices = sucursales;
        this.recargarDatos();
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
  //establecer la fecha de inicio
  seleccionarFechaDeInicio() {
    let date = new Date();
    //new Date(año, mes, día); indicamos el año y mes actual, usamos 1 como día porque todos los meses empiezan en 1
    //let primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
    let primerDia = new Date(date.getFullYear(), date.getMonth(), 1);

    //new Date(año, mes, día); indicamos el año actual, al mes le sumamos + 1 de esta forma indicamos un mes superior,
    //la particularidad esta en día indicamos día 0, de esta forma el día 0 del siguiente mes es el ultimo día del mes actual.
    /*let ultimoDia = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );*/
    //date.getMonth() < 11 ? date.getMonth() + 1 : 11 => la formula funciona del 1 al 10 pero en 11 diciembre debemos válidar para que no explote el código
    let ultimoDia = new Date(
      date.getFullYear(),
      date.getMonth() < 11 ? date.getMonth() + 1 : 11,
      date.getMonth() < 11 ? 0 : 31
    );

    this.asignarFechaStartAndEnd(primerDia, ultimoDia);
    //asignamos las fechas start al formulario
    if (this.usuario.role != 'ADMIN_ROLE') {
      this.form.reset({
        sucursal: this.branchOffices[0].titulo,
        start: primerDia,
        end: ultimoDia,
      });
    } else {
      this.form.reset({
        sucursal: '',
        start: primerDia,
        end: ultimoDia,
      });
    }
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
    let loginToken = localStorage.getItem('token');
    //this.form.controls.sucursal.value != ''
    if (
      this.form.controls.start.value != '' &&
      this.form.controls.end.value != ''
    ) {
      this.asignarFechaStartAndEnd(
        this.form.controls.start.value,
        this.form.controls.end.value
      );
    }
    if (this.form.valid) {
      for (const sucursal of this.branchOffices) {
        this.loading = true;
        this.arqueoService
          .getReporte(sucursal._id, loginToken, `${this.start}`, `${this.end}`)
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

        this.cargarReporteDeDepositos(data.comprobantesDeposito);

        this.cargarReporteDeDepositoPorCuenta(data.comprobantesDeposito);

        this.cargarReporteDeRetiro(data.comprobanteRetiro);

        this.cargarReporteDeTarjeta(data.comprobanteTarjeta);
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
    let existe = false;
    this.reportes.map((reporte) => {
      if (reporte.sucursal === data.sucursal) {
        existe = true;
      }
    });
    if (!existe) {
      this.reportes.push(data);
    }
    this.loading = false;
  }
  cargarReporteDeGastos(comprobantesDeGasto: any, totalDeGasto: number) {
    //cargar el reporte de gastos
    this.reporteDeGasto = comprobantesDeGasto;
    this.totalMontoDeGasto = totalDeGasto;
  }
  cargarReporteDeDepositoPorBanco(comprobantesDeposito: any) {
    //cargar los bancos
    for (let deposito of comprobantesDeposito) {
      this.bancos.add(deposito.banco.nombre);
      //sumar el total
      this.totalDepositoPorBanco += parseInt(deposito.monto);
    }
    //cargar los montos de deposito por banco
    let indiceDeBanco: number = 0;
    for (let banco of this.bancos) {
      this.depositoPorBanco[indiceDeBanco] = 0;
      for (let deposito of comprobantesDeposito) {
        if (banco === deposito.banco.nombre) {
          this.depositoPorBanco[indiceDeBanco] += parseInt(deposito.monto);
        }
      }
      ++indiceDeBanco;
    }
  }

  cargarReporteDeDepositos(comprobantesDeposito) {
    for (let deposito of comprobantesDeposito) {
      this.reporteDeDepositos.push(deposito);
    }
  }

  cargarReporteDeDepositoPorCuenta(comprobantesDeposito: any) {
    //cargar las cuentas bancarias
    for (let deposito of comprobantesDeposito) {
      this.cuentasBancarias.add(
        deposito.cuentaBancaria.titular +
          ' - ' +
          deposito.cuentaBancaria.nroCuenta
      );
      //sumar el total
      this.totalDepositoPorCuenta += parseInt(deposito.monto);
    }
    //cargar los montos de deposito por cuenta
    let indiceDeCuenta: number = 0;
    for (let cuenta of this.cuentasBancarias) {
      this.depositoPorCuenta[indiceDeCuenta] = 0;
      for (let deposito of comprobantesDeposito) {
        if (
          cuenta ===
          deposito.cuentaBancaria.titular +
            ' - ' +
            deposito.cuentaBancaria.nroCuenta
        ) {
          this.depositoPorCuenta[indiceDeCuenta] += parseInt(deposito.monto);
          this.cuentasBanco[indiceDeCuenta] = deposito.banco.nombre;
        }
      }
      ++indiceDeCuenta;
    }
  }
  cargarReporteDeRetiro(comprobantesRetiro: any) {
    this.comprobantesRetiro = comprobantesRetiro;
    this.comprobantesRetiro.map((comprobante) => {
      this.totalComprobantesRetiro += parseInt(comprobante.monto);
    });
  }
  cargarReporteDeTarjeta(comprobantesTarjeta: any) {
    this.comprobantesTarjeta = comprobantesTarjeta;
    this.comprobantesTarjeta.map((comprobante) => {
      this.totalComprobantesTarjeta = parseInt(comprobante.monto);
    });
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
    this.reporteDeDepositos = [];

    this.cantidadDeInformes = 0;

    this.nombreDeSucursales = [];
    this.ventasNetaDeSucursales = [];

    this.comprobantesRetiro = [];
    this.totalComprobantesRetiro = 0;

    this.comprobantesTarjeta = [];
    this.totalComprobantesTarjeta = 0;
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
