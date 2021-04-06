import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ArqueoService } from 'src/app/services/arqueo.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { PdfMakeWrapper, Table, Txt, Img } from 'pdfmake-wrapper'; //para poder utilizar pdfMake-wrapper

@Component({
  selector: 'app-reportes-cuentas',
  templateUrl: './reportes-cuentas.component.html',
  styleUrls: ['./reportes-cuentas.component.css'],
})
export class ReportesCuentasComponent implements OnInit {
  public formulario: FormGroup;
  public usuario: any;
  public clientRole = false;
  public vendedorRole = false;
  public adminRole = false;
  public informePDF = false;
  public sucursales = [];
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private sucursalesService: SucursalesService,
    private arqueoService: ArqueoService
  ) {}
  ngOnInit(): void {
    this.subirInicio();
    this.sucursalesService.getSucursales().subscribe((data) => {
      this.sucursales = data['sucursalesBD'];
    });
    this.login();
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
          this.crearFormulaio();
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
  crearFormulaio() {
    if (this.usuario.role == 'ADMIN_ROLE') {
      this.formulario = this.fb.group({
        sucursal: ['', Validators.required],
        start: ['', Validators.required],
        end: ['', Validators.required],
      });
    }
  }
  async enviarFormulario() {
    let loginToken = localStorage.getItem('loginToken');
    let sucursal = this.formulario.controls.sucursal.value;
    let fehcaStart = this.formulario.controls.start.value;
    let fechaEnd = this.formulario.controls.end.value;
    let start = `${fehcaStart.getFullYear()}-${
      fehcaStart.getMonth() + 1
    }-${fehcaStart.getDate()}`;
    let end = `${fechaEnd.getFullYear()}-${
      fechaEnd.getMonth() + 1
    }-${fechaEnd.getDate()}`;
    if (this.formulario.valid) {
      if (this.usuario.role == 'ADMIN_ROLE') {
        this.arqueoService
          .getReporte(sucursal, loginToken, start, end)
          .subscribe(
            (data) => {
              //imprimir mensaje
              Swal.fire({
                allowOutsideClick: false, //false, no puede dar click en otro lugar
                title: 'Reporte Comercial',
                text: 'Reporte generado con Exito!!!',
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              //vaciar formulario
              this.borrarFormulario();
              this.generarPdf(data);
            },
            (err) => {
              Swal.fire({
                allowOutsideClick: false, //false, no puede dar click en otro lugar
                title: 'Error!',
                text: 'El reporte no pudo ser generado',
                icon: 'error',
                confirmButtonText: 'Ok',
              });
              console.warn(err);
            }
          );
      }
    }
  }
  borrarFormulario() {
    if (this.usuario.role == 'ADMIN_ROLE') {
      this.formulario.reset({
        sucursal: this.usuario.sucursal,
        start: '',
        end: '',
      });
    }
  }
  async generarPdf(informe) {
    this.informePDF = true;
    let datos = [];
    let ventaNeta = new Txt(
      `VENTA NETA: ${this.number_format(informe.ventaNeta, 0)} Gs.`
    )
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    let costo = new Txt(`COSTO: ${this.number_format(informe.costo, 0)} Gs.`)
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    let gasto = new Txt(
      `GASTO: ${this.number_format(informe.totalGasto, 0)} Gs.`
    )
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    let utilidad = new Txt(
      `UTILIDAD ${this.number_format(informe.totalUtilidad, 0)} Gs.`
    )
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    let ganancia = new Txt(
      `GANANCIA: ${this.number_format(informe.ganancia, 0)} Gs.`
    )
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    let deposito = new Txt(
      `TOTAL DEPOSITO: ${this.number_format(informe.totalDeposito, 0)} Gs.`
    )
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    let divisor = new Txt(
      `===========================================================================`
    )
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    //Cargar al arreglo
    datos.push(ventaNeta);
    datos.push(costo);
    datos.push(utilidad);
    datos.push(gasto);
    datos.push(ganancia);
    datos.push(deposito);
    datos.push(divisor);

    //Calcular las cuentas cuentas bancarias
    let cuentasbancos = new Set();
    //obtener todos los bancos y su cuenta en una colección set
    for (const comprobante of informe.comprobantesDeposito) {
      cuentasbancos.add(comprobante.cuentaBancaria);
    }
    let cuentaMonto = [];
    let indexCuentaMonto = 0;
    for (const cuenta of cuentasbancos) {
      cuentaMonto[indexCuentaMonto] = 0;
      for (const comprobante of informe.comprobantesDeposito) {
        if (comprobante.cuentaBancaria === cuenta) {
          cuentaMonto[indexCuentaMonto] =
            cuentaMonto[indexCuentaMonto] + Number(comprobante.monto);
        }
      }
      indexCuentaMonto++;
    }
    //imprimir los reportes por bancoDeposito
    indexCuentaMonto = 0;
    for (const banco of cuentasbancos) {
      let bancoReporteDepositoCuenta = new Txt(
        `CUENTA: ${banco} = ${this.number_format(
          cuentaMonto[indexCuentaMonto],
          0
        )} Gs.`
      )
        .bold()
        .decorationStyle('dotted')
        .fontSize(12)
        .alignment('left').end;
      datos.push(bancoReporteDepositoCuenta);
      indexCuentaMonto++;
    }

    //Encabezado de la tabla de comprobanteDeposito CUENTAS BANCO
    let datosTablaDepositoCuenta = [];
    let encabezadoTablaDepositoCuenta = [];
    let bancoDepositoCuenta = new Txt('Banco')
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    let montoDepositoCuenta = new Txt('Monto')
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    let fechaDepositoCuenta = new Txt('Fecha')
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    let cuentaDepositoCuenta = new Txt('Cuenta')
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    encabezadoTablaDepositoCuenta.push(bancoDepositoCuenta);
    encabezadoTablaDepositoCuenta.push(montoDepositoCuenta);
    encabezadoTablaDepositoCuenta.push(fechaDepositoCuenta);
    encabezadoTablaDepositoCuenta.push(cuentaDepositoCuenta);
    datosTablaDepositoCuenta.push(encabezadoTablaDepositoCuenta);
    //Cargar JSON para la tabla de comprobanteDeposito CUENTAS BANCO
    for (const comprobante of informe.comprobantesDeposito) {
      let comprobantes = [];
      comprobantes.push(comprobante.banco);
      comprobantes.push(`${this.number_format(comprobante.monto, 0)} Gs.`);
      let fechaPago = new Date(comprobante.fPago);
      let yyyyFp = fechaPago.getFullYear();
      let mmFp = fechaPago.getMonth();
      let ddFp = fechaPago.getDate();
      comprobantes.push(this.fecha_format(yyyyFp, mmFp, ddFp));
      comprobantes.push(comprobante.cuentaBancaria);
      datosTablaDepositoCuenta.push(comprobantes);
    }

    //Crear el objeto pdf
    const pdf = new PdfMakeWrapper();
    //Cargar los datos al pdf
    pdf.add(datos);
    //Crear tabla comprobanteDeposito
    let tablaDeposito = new Table(datosTablaDepositoCuenta)
      .relativePosition(70, 3)
      .alignment('center')
      .layout('lightHorizontalLines').end;
    //Cargar la tabla de comprobanteDeposito al pdf
    pdf.add(tablaDeposito);
    //Generar estilos al pdf
    pdf.defaultStyle({
      bold: false,
      fontSize: 10,
    });
    //Tamaño de hoja
    //pdf.pageSize('EXECUTIVE');

    //Generar margenes
    pdf.pageMargins([30, 80, 30, 50]); //left, top, right, botton
    //Horientacion del documento
    pdf.pageOrientation('landscape'); // 'portrait' o 'landscape'
    //Generar el Encabezado
    let encabezado = new Txt(`Seda Cosmética`)
      .bold()
      .decorationStyle('dotted')
      .fontSize(14)
      .alignment('center').end;
    let head = [];
    let textoSucursal = new Txt(`Informe de la ${informe.sucursal}`)
      .bold()
      .decorationStyle('dotted')
      .fontSize(12)
      .alignment('center').end;
    let fechaDesde = this.generarFecha(informe.desde);
    let fechaHasta = this.generarFecha(informe.hasta);
    let textoRango;
    if (informe.desde === informe.hasta) {
      textoRango = new Txt(
        `Informe diario, ${this.fecha_format(
          fechaDesde.getFullYear(),
          fechaDesde.getMonth(),
          fechaDesde.getDate()
        )}`
      )
        .bold()
        .decorationStyle('dotted')
        .fontSize(12)
        .alignment('center').end;
    } else {
      textoRango = new Txt(
        `Periodo desde el ${this.fecha_format(
          fechaDesde.getFullYear(),
          fechaDesde.getMonth(),
          fechaDesde.getDate()
        )}, hasta el ${this.fecha_format(
          fechaHasta.getFullYear(),
          fechaHasta.getMonth(),
          fechaHasta.getDate()
        )}`
      )
        .bold()
        .decorationStyle('dotted')
        .fontSize(12)
        .alignment('center').end;
    }
    head.push(encabezado);
    head.push(textoSucursal);
    head.push(textoRango);
    pdf.header(head);
    // ============= Simple watermark ============= la marca de agua
    //pdf.watermark('MXVX Paraguay 2020');
    //Generar el footer
    let fecha = new Date();
    let yyyy = fecha.getFullYear();
    let mm = fecha.getMonth();
    let dd = fecha.getDate();
    let infoFooter = `${this.fecha_format(yyyy, mm, dd)}`;
    let year = fecha.getFullYear();
    let footer = new Txt(
      `${infoFooter} \n Seda Cosmética ${year} \n www.sedacosmetica.com`
    )
      .bold()
      .alignment('center').end;
    pdf.footer(footer);
    //Crear e imprimir pdf
    pdf.create().download(`Informe de la ${informe.sucursal} ${infoFooter}`);
    setTimeout(() => {
      this.informePDF = false;
    }, 10000);
  }
  number_format(amount, decimals) {
    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
    decimals = decimals || 0; // por si la variable no fue fue pasada
    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0) return parseFloat('0').toFixed(decimals);
    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);
    var amount_parts = amount.split('.'),
      regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
      amount_parts[0] = amount_parts[0].replace(regexp, '$1' + '.' + '$2');
    return amount_parts.join(',');
  }
  //la zona horaria del servidor es T03 y acutalmente Paraguay tiene la zona horaria T04, por eso vamos a extraer la zona horaria del string
  generarFecha(fecha: string) {
    //con esta funcion extraemos la zona horaria que hicia con T
    let indice: number = fecha.indexOf('T');
    if (indice > -1) {
      //si es correcto la fecha, formateamos la fecha restando -1 al mes porque en JS los meses van de 0 a 11
      let fechaSinZonaHoraria = fecha.substr(0, indice);
      indice = fechaSinZonaHoraria.indexOf('-');
      let year: number = parseInt(fechaSinZonaHoraria.substr(0, indice));
      let fechaSinYear = fechaSinZonaHoraria.substr(indice + 1);
      indice = fechaSinYear.indexOf('-');
      let month = parseInt(fechaSinYear.substr(0, indice));
      let day = parseInt(fechaSinYear.substr(indice + 1));
      return new Date(year, month - 1, day);
    } else {
      return new Date();
    }
  }
  fecha_format(yyyy, mm, dd) {
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    let options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    let fecha = new Date(yyyy, mm, dd);
    return fecha.toLocaleDateString('es-ES', options);
  }
}
