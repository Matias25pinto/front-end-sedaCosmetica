import { Component, OnInit } from '@angular/core';
import { ComprobantesService } from 'src/app/core/shared/services/comprobantes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as action from 'src/app/usuario.actions';

import { Sucursal } from 'src/app/core/shared/models/sucursal.interface';

@Component({
  selector: 'app-ver-comprobantes',
  templateUrl: './ver-comprobantes.component.html',
})
export class VerComprobantesComponent implements OnInit {
  public urlImg = './assets/img/noimage.png';
  public isLoadingIMG = false;
  public urlTitulo = 'no-image';
  public btnSiguiente = true;

  public usuario$: Observable<any>;
  public usuario: any;

  public branchOffices: Sucursal[] = [];
  public isSelectBranchOffice: boolean[] = [];
  public form: FormGroup;

  public start: string;
  public end: string;

  public nombreDeSucursales: string[] = [];

  public comprobantes = [];
  public montoComprobante;
  public adminRole: Boolean = false;
  public userRole: Boolean = false;
  private id;
  public noExisteComprobantes = false;

  public listaComprobantes = [
    'DEPOSITO',
    'RETIRO',
    'TARJETA',
    'CHEQUE',
    'SALARIO',
    'INSUMOS',
    'SERVICIOS',
    'ANDE',
    'IMPUESTO',
    'DESCUENTO',
  ];
  public desde: string = '0';
  public cantidadComprobantes: number;

  constructor(
    private store: Store<{ usuario: any }>,
    private sucursalesService: SucursalesService,
    private comprobantesServices: ComprobantesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.subirInicio();
    this.crearFormulaio();
    this.autenticarUsuario();
    this.seleccionarFechaDeInicio();
  }
  autenticarUsuario() {
    this.usuario$ = this.store.select('usuario');

    this.store.dispatch(action.getUsuario());

    this.usuario$.subscribe((data) => {
      this.usuario = data;
      this.sucursalesService.getSucursales().subscribe(async (sucursales) => {
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
        this.recargarDatos();
      });
    });
  }

  crearFormulaio() {
    this.form = this.fb.group({
      sucursal: [''],
      comprobante: [''],
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

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
    if (this.usuario.role == 'ADMIN_ROLE') {
      this.form.reset({
        sucursal: '',
        comprobante: '',
        start: primerDia,
        end: ultimoDia,
      });
    } else {
      this.form.reset({
        sucursal: this.usuario['sucursal'],
        comprobante: '',
        start: primerDia,
        end: ultimoDia,
      });
    }
    this.enviarFormulario();
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
  siguiente() {
    if (this.cantidadComprobantes > parseInt(this.desde) + 10) {
      this.desde = (parseInt(this.desde) + 10).toString();
      this.recargarDatos();
    } else {
      this.btnSiguiente = false;
    }
  }

  anterior() {
    this.desde = (parseInt(this.desde) - 10).toString();
    if (parseInt(this.desde) >= 0) {
      this.recargarDatos();
    } else {
      this.desde = '0';
    }
  }
  formatearFecha(data) {
    let fecha = new Date(data);
    let yyyy = fecha.getFullYear().toString();
    let mm = '';
    let dd = '';
    if (fecha.getDate() <= 10) {
      dd = '0' + fecha.getDate().toString();
    } else {
      dd = fecha.getDate().toString();
    }
    //en javascript 9 ya es octubre por eso hacemos solo hasta el 9
    if (fecha.getMonth() < 9) {
      mm = '0' + (fecha.getMonth() + 1).toString();
    } else {
      mm = (fecha.getMonth() + 1).toString();
    }

    return `${yyyy}-${mm}-${dd}T03:00:00.000Z`;
  }
  enviarFormulario() {
    if (this.form.controls.sucursal.value != '') {
      this.asignarFechaStartAndEnd(
        this.form.controls.start.value,
        this.form.controls.end.value
      );
    }
    if (this.form.valid) {
      this.cargarComprobante();
    }
  }
  recargarDatos() {
    if (
      this.form.controls.start.value != '' &&
      this.form.controls.end.value != ''
    ) {
      this.comprobantes = [];
      this.enviarFormulario();
    }
  }
  // Funcion para subir al inicio
  subirInicio(): void {
    window.scroll(0, 0);
  }

  cargarComprobante() {
    let token = localStorage.getItem('token');
    let sucursal = this.form.controls.sucursal.value;

    let comprobante = this.form.controls.comprobante.value;

    let fechaDesde = this.formatearFecha(this.form.get('start').value);

    let fechaHasta = this.formatearFecha(this.form.get('end').value);

    let desde = this.desde;
    this.comprobantesServices
      .getComprobantes(
        token,
        sucursal,
        comprobante,
        fechaDesde,
        fechaHasta,
        desde
      )
      .subscribe(
        (data) => {
          this.comprobantes = [];
          this.comprobantes = data['comprobantes'];
          this.cantidadComprobantes = 0;
          this.cantidadComprobantes = data['cantidadComprobantes'];
          if (this.comprobantes.length == 0) {
            this.noExisteComprobantes = true;
            this.anterior();
          } else {
            this.noExisteComprobantes = false;
          }
        },
        (err) => {
          console.log('ERROR!!!');
          this.comprobantes = [];
          this.cantidadComprobantes = 0;
          this.noExisteComprobantes = true;
        }
      );
  }

  eliminarComprobante(idComprobante) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `¿Está usted seguro de que desea eliminar el comprobante`,
        text: 'Si está seguro presione el botón Sí',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Eliminar.',
        cancelButtonText: 'No, Cancelar.',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let token = localStorage.getItem('token');
          this.comprobantesServices
            .eliminarComprobante(idComprobante, token)
            .subscribe(
              (resp) => {
                swalWithBootstrapButtons.fire(
                  'Eliminado',
                  `Se elimino el comprobante`,
                  'success'
                );
                this.cargarComprobante();
              },
              (err) => {
                console.warn(err);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: `No es posible eliminar el comprobante`,
                  footer:
                    'Verificar su conexión a internet, y recuerde que los comprobantes solo pueden ser eliminados en el mes al que pertenecen',
                });
              }
            );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            `No se elimino el comprobante`,
            'error'
          );
        }
      });
  }

  handleFileInput(id: string, files: any) {
    this.isLoadingIMG = true;
    let formData = new FormData();
    formData.append('img', files[0]);
    const body = formData;
    const token = localStorage.getItem('token');
    this.comprobantesServices.actualizarImg(token, id, body).subscribe(
      (resp) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Comprobante actualizado con Exito!!!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.isLoadingIMG = false;
        this.cargarComprobante();
      },
      (err) => {
        console.warn(err);
        this.isLoadingIMG = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible actualizar el comprobante',
          footer: '<p>verificar su conexión a internet</p>',
        });
      }
    );
  }

  mostrarImage(
    imageUrl: string = './assets/img/noimage.png',
    comprobante: string,
    fecha: string,
    monto: number
  ) {
    Swal.fire({
      title: `${comprobante}`,
      html: `<p>Fecha: ${new Date(
        fecha
      ).toLocaleDateString()}</p><p>Monto: ${monto} Gs.</p> `,
      imageUrl,
      imageWidth: 400,
      imageHeight: 400,
      imageAlt: 'Custom image',
    });
  }
}
