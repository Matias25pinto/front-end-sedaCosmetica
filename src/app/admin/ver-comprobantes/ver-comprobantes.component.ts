import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComprobantesService } from 'src/app/core/shared/services/comprobantes.service';
import { UsuariosService } from 'src/app/core/shared/services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-comprobantes',
  templateUrl: './ver-comprobantes.component.html',
})
export class VerComprobantesComponent implements OnInit {

  public branchOffices: any[] = [];
  public isSelectBranchOffice: boolean[] = [];
  public form: FormGroup;

  public usuario: any;
  public clientRole = false;
  public vendedorRole = false;

  public start: string;
  public end: string;

  public nombreDeSucursales: string[] = [];

  public comprobantes = [];
  public montoComprobante;
  public adminRole: Boolean = false;
  public userRole: Boolean = false;
  private id;
  public noExisteComprobantes = false;

  public listaComprobantes = ["DEPOSITO","RETIRO","TARJETA","CHEQUE","SALARIO","INSUMOS","SERVICIOS","ANDE","IMPUESTO","DESCUENTO"];
  public desde:string = "0";
  public cantidadComprobantes:number;
  constructor(
    private router: Router,
    private usuarioService: UsuariosService,
    private comprobantesServices: ComprobantesService,
    private sucursales: SucursalesService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    //verificar el login del usuario
    let loginToken = localStorage.getItem('token');
    this.crearFormulaio();
    this.cargatSucursales();
    this.subirInicio();
    this.usuarioService.verificarLogin(loginToken).subscribe((data) => {
      if (data['usuario'].role == 'USER_ROLE') {
        this.userRole = true;
      }
      if (data['usuario'].role == 'ADMIN_ROLE') {
        this.adminRole = true;
      }
    });
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
      comprobante:[''],
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }
   //Verificar si el usuario esta logueado
   login() {
    let loginToken = localStorage.getItem('token');
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
          localStorage.removeItem('token');
          //vamos a recargar la pagina 3 segundos despues
          setTimeout(() => {
            //Recargar la pagina para que actualice el estado del usuario
            window.location.reload();
          }, 1000);
        }
      );
    }
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
    let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.asignarFechaStartAndEnd(primerDia, ultimoDia);
    //asignamos las fechas start al formulario
    this.form.reset({
      sucursal: '',
      comprobante:'',
      start: primerDia,
      end: ultimoDia,
    });
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
    if(this.cantidadComprobantes > parseInt(this.desde)+10){
      this.desde = (parseInt(this.desde) + 10).toString();
      console.log(this.desde);
      this.recargarDatos();
    }else{
      console.log("No hay siguiente");
    }
  }

  anterior() {
    this.desde = (parseInt(this.desde) - 10).toString();
    if (parseInt(this.desde) >= 0) {
      this.recargarDatos();
    }else{
      this.desde = "0";
    }
  }
  formatearFecha(data){
    let fecha = new Date(data);
    let yyyy = fecha.getFullYear().toString();
    let mm = "";
    let dd = "";
    if(fecha.getDate() < 10){
      dd = "0"+ fecha.getDate().toString();
    }else{
      dd = fecha.getDate().toString();
    }
    if(fecha.getMonth() < 10){
      mm = "0" + (fecha.getMonth()+1).toString();
    }else{
      mm = (fecha.getMonth()+1).toString();
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
    
    let fechaDesde = this.formatearFecha(this.form.get("start").value);
 
    let fechaHasta = this.formatearFecha(this.form.get("end").value);
    
    let desde = this.desde;
    this.comprobantesServices
      .getComprobantes(token, sucursal, comprobante, fechaDesde, fechaHasta, desde)
      .subscribe(
        (data) => {
          this.comprobantes = [];
          this.comprobantes = data['comprobantes'];
          this.cantidadComprobantes = 0;
          this.cantidadComprobantes = data['cantidadComprobantes'];
          if(this.comprobantes.length == 0){
            this.noExisteComprobantes=true;
            this.anterior();
          }else{
            this.noExisteComprobantes = false;
          }
        },
        (err) => {
          console.log('ERROR!!!');
          this.comprobantes = [];
          this.cantidadComprobantes = 0;
          this.noExisteComprobantes=true;
        }
      );
  }

  eliminarComprobante(idComprobante) {
    let token = localStorage.getItem('token');

    Swal.fire({
      title: '¿Eliminar el comprobante?',
      text: 'Si esta seguro de eliminar el comprobante presione Sí',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
    }).then((result) => {
      if (result.isConfirmed) {
        this.comprobantesServices.eliminarComprobante(idComprobante, token).subscribe(data=>{
          console.log("Se elimino el comprobante");
          this.recargarDatos();
        },err=>{
          console.log("ERROR!!! no se pudo eliminar el comprobante");
        });
      }
    });
  }
}
