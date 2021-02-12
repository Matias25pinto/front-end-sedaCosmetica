import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ArqueoService } from 'src/app/services/arqueo.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'
import { PdfMakeWrapper, Table, Txt, Img } from 'pdfmake-wrapper';//para poder utilizar pdfMake-wrapper

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  public formulario: FormGroup;
  public usuario: any;
  public clientRole = false;
  public vendedorRole = false;
  public adminRole = false;
  public informePDF = false;
  public sucursales = [];
  constructor(private fb: FormBuilder, private usuarioService: UsuarioService,
    private sucursalesService: SucursalesService, private arqueoService:ArqueoService) { }
  ngOnInit(): void {
    this.subirInicio();
    this.sucursalesService.getSucursales().subscribe(data => {
      this.sucursales = data['sucursalesBD'];
    });
    this.login(); 
  }
  // Funcion para subir al inicio
  subirInicio(): void{
    window.scroll(0, 0);
  }
  //Verificar si el usuario esta logueado
  login() {
    let loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      this.usuarioService.verificarLogin(loginToken).subscribe(data => {
        
        this.usuario = data['usuario'];
        if (this.usuario.role == 'CLIENT_ROLE') {
          this.clientRole = true;
        } else if (this.usuario.role == 'ADMIN_ROLE') {
          this.adminRole = true;
        } else if (this.usuario.role == 'USER_ROLE') {
          this.vendedorRole = true;
        }
        this.crearFormulaio();
      }, err => {
          console.warn(err);
          // Remover el token
          localStorage.removeItem('loginToken');
          //vamos a recargar la pagina 3 segundos despues
          setTimeout(() => {
          //Recargar la pagina para que actualice el estado del usuario
          window.location.reload(); 
          }, 1000);
      });
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
    let start = `${fehcaStart.getFullYear()}-${fehcaStart.getMonth()+1}-${fehcaStart.getDate()}`;
    let end = `${fechaEnd.getFullYear()}-${fechaEnd.getMonth()+1}-${fechaEnd.getDate()}`;
    if (this.formulario.valid) {
      if (this.usuario.role == 'ADMIN_ROLE') {
        this.arqueoService.getReporte(sucursal, loginToken, start,end ).subscribe(data => {
          //imprimir mensaje
          Swal.fire({
            allowOutsideClick: false,//false, no puede dar click en otro lugar
            title: 'Reporte Comercial',
            text: 'Reporte generado con Exito!!!',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          //vaciar formulario
          this.borrarFormulario();
          this.generarPdf(data);
        }, err => {
          Swal.fire({
            allowOutsideClick: false,//false, no puede dar click en otro lugar
            title: 'Error!',
            text: 'El reporte no pudo ser generado',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
            console.warn(err);
        });
      }
    }    
  }
  borrarFormulario() {
    if (this.usuario.role == 'ADMIN_ROLE') {
      this.formulario.reset({
        sucursal: this.usuario.sucursal,
        start: '',
        end: '',
      })
    }
  }
  async generarPdf(informe) {
    this.informePDF = true;
    let datos = [];
    let ventaNeta = new Txt(`VENTA NETA: ${this.number_format(informe.ventaNeta, 0)} Gs.`)
                      .bold()
                      .decorationStyle('dotted')
                      .fontSize(12)
                      .alignment('center').end;
    let costo = new Txt(`COSTO: ${this.number_format(informe.costo, 0)} Gs.`)
                      .bold()
                      .decorationStyle('dotted')
                      .fontSize(12)
                      .alignment('center').end;
    let gasto = new Txt(`GASTO: ${this.number_format(informe.totalGasto, 0)} Gs.`)
                .bold()
                .decorationStyle('dotted')
                .fontSize(12)
                .alignment('center').end;
    let utilidad = new Txt(`UTILIDAD ${this.number_format(informe.totalUtilidad, 0)} Gs.`)
                      .bold()
                      .decorationStyle('dotted')
                      .fontSize(12)
                      .alignment('center').end;
    let ganancia = new Txt(`GANANCIA: ${this.number_format(informe.ganancia, 0)} Gs.`)
                      .bold()
                      .decorationStyle('dotted')
                      .fontSize(12)
      .alignment('center').end;
    //Cargar al arreglo
    datos.push(ventaNeta)
    datos.push(costo);
    datos.push(utilidad);
    datos.push(gasto);
    datos.push(ganancia);
    let datosTabla = [];
    //Encabezado de la tabla
    let encabezadoTabla = [];
    let comprobante = new Txt('Gasto')
                      .bold()
                      .decorationStyle('dotted')
                      .fontSize(12)
                      .alignment('center').end;
    let montoGasto = new Txt('Monto')
                      .bold()
                      .decorationStyle('dotted')
                      .fontSize(12)
                      .alignment('center').end;
    let fechaGasto = new Txt('Fecha')
                      .bold()
                      .decorationStyle('dotted')
                      .fontSize(12)
                      .alignment('center').end;
    encabezadoTabla.push(comprobante);
    encabezadoTabla.push(montoGasto);
    encabezadoTabla.push(fechaGasto);
    datosTabla.push(encabezadoTabla);
    let informeGasto = informe.comprobantesGasto;
    //Cargar JSON para la tabla
    for (const comprobante of informe.comprobantesGasto) {
      let comprobantes = [];
      comprobantes.push(comprobante.comprobante);
      comprobantes.push(`${this.number_format(comprobante.monto, 0)} Gs.`);
      let fechaPago = new Date(comprobante.fPago);
      let yyyyFp = fechaPago.getFullYear();
      let mmFp = fechaPago.getMonth();
      let ddFp = fechaPago.getDate();
      comprobantes.push(this.fecha_format(yyyyFp, mmFp, ddFp));
      datosTabla.push(comprobantes);
    }
    //Crear el objeto pdf
    const pdf = new PdfMakeWrapper();
    //Cargar los datos al pdf
    pdf.add(datos);
     //Crear tabla
    let tabla = new Table(datosTabla).relativePosition(250,22).alignment('center').layout('lightHorizontalLines').end;
    //Cargar la tabla al pdf
    pdf.add(tabla);
    //Generar estilos al pdf
    pdf.defaultStyle({
      bold: false,
      fontSize: 10,
    });
    //Tamaño de hoja
    //pdf.pageSize('EXECUTIVE');
    
    //Generar margenes
    pdf.pageMargins([30, 80, 30, 60]); //left, top, right, botton
    //Horientacion del documento
    pdf.pageOrientation('landscape'); // 'portrait'
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
    let arrayDesde = informe.desde.split('-');
    let arrayHasta = informe.hasta.split('-');
    let textoRango = new Txt(`Periodo desde el ${this.fecha_format(arrayDesde[0], arrayDesde[1]-1, arrayDesde[2])}, hasta el ${this.fecha_format(arrayHasta[0], arrayHasta[1]-1, arrayHasta[2])}`)
                      .bold()
                      .decorationStyle('dotted')
                      .fontSize(12)
                      .alignment('center').end;
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
    let infoFooter = `${this.fecha_format(yyyy,mm,dd)}`;
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
    if (isNaN(amount) || amount === 0) 
        return parseFloat('0').toFixed(decimals);
    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);
    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + '.' + '$2');
    return amount_parts.join(',');
  }
  fecha_format(yyyy, mm, dd) {
    if(dd<10) 
    {
      dd = '0'+dd;
    } 
    if(mm <10) 
    {
      mm ='0'+mm;
    } 
    let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    let fecha = new Date(yyyy, mm, dd);
    return fecha.toLocaleDateString("es-ES", options)
  }
}
