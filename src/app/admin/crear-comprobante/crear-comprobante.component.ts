import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArqueoService } from 'src/app/core/shared/services/arqueo.service';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as action from 'src/app/usuario.actions';

import { Banco } from '../../core/shared/models/banco.interface';
import { Cuenta } from '../../core/shared/models/cuenta.interface';
import { BancosService } from '../../core/shared/services/bancos.service';
import { CuentasService } from '../../core/shared/services/cuentas.service';

import { ValidadoresService } from '../../core/shared/services/validadores.service';

import { Sucursal } from 'src/app/core/shared/models/sucursal.interface';

@Component({
  selector: 'app-crear-comprobante',
  templateUrl: './crear-comprobante.component.html',
})
export class CrearComprobanteComponent implements OnInit {
  public usuario$: Observable<any>;
  public usuario: any;

  public mostrar: string;

  public formularioComprobante: FormGroup;

  public banco: string;

  public creandoComprobante: Boolean = false;

  public sucursales: Sucursal[] = [];

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

  public bancos: Banco[] = [];
  public cuentas: Cuenta[] = [];

  constructor(
    private store: Store<{ usuario: any }>,
    private fb: FormBuilder,
    private arqueoService: ArqueoService,
    private sucursalesService: SucursalesService,
    private bancosService: BancosService,
    private cuentasService: CuentasService,
    private validadores: ValidadoresService
  ) {
    this.mostrar = '';
    this.banco = '';
  }

  ngOnInit(): void {
    this.subirInicio();
    this.autenticarUsuario();
  }
  cargarBancos() {
    let token = localStorage.getItem('token');
    this.bancosService.bancos(token).subscribe((bancos) => {
      this.bancos = bancos;
    });
  }
  cargarCuentas() {
    let idBanco = 'todo';
    let token = localStorage.getItem('token');
    this.cuentasService.cuentas(token, idBanco).subscribe((cuentas) => {
      this.cuentas = cuentas;
    });
  }
  // Funcion para subir al inicio
  subirInicio(): void {
    window.scroll(0, 0);
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
              this.sucursales.push(sucursal);
              return sucursal;
            }
            return;
          });
        } else {
          this.sucursales = sucursales;
        }
      });
    });
  }

  crearFormulario() {
    if (this.mostrar == 'ANDE') {
      this.formularioComprobante = this.fb.group({
        sucursal: ['', Validators.required],
        fArqueo: ['', [Validators.required, this.validadores.validarFecha]],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,9}$')]],
        comprobante: ['ANDE', Validators.required],
        nis: ['', Validators.required],
        vencimiento: ['', Validators.required],
        nroComprobante: ['', Validators.required],
      });
    }

    if (this.mostrar == 'SERVICIOS') {
      this.formularioComprobante = this.fb.group({
        sucursal: ['', Validators.required],
        fArqueo: ['', [Validators.required, this.validadores.validarFecha]],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,9}$')]],
        comprobante: ['SERVICIOS', Validators.required],
        servicio: ['', Validators.required],
        tipoComprobante: ['', Validators.required],
        nroComprobante: ['', Validators.required],
        observacion: ['', Validators.required],
      });
    }

    if (this.mostrar == 'IMPUESTO') {
      this.formularioComprobante = this.fb.group({
        sucursal: ['', Validators.required],
        fArqueo: ['', [Validators.required, this.validadores.validarFecha]],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,9}$')]],
        comprobante: ['IMPUESTO', Validators.required],
        impuesto: ['', Validators.required],
        tipoComprobante: ['', Validators.required],
        nroComprobante: ['', Validators.required],
        observacion: ['', Validators.required],
      });
    }

    if (this.mostrar == 'SALARIO') {
      this.formularioComprobante = this.fb.group({
        sucursal: ['', Validators.required],
        fArqueo: ['', [Validators.required, this.validadores.validarFecha]],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante: ['SALARIO', Validators.required],
        nombreApellido: ['', Validators.required],
        cedula: ['', Validators.required],
        cargo: ['', Validators.required],
        tipoComprobante: ['', Validators.required],
        nroComprobante: ['', Validators.required],
        observacion: ['', Validators.required],
      });
    }

    if (this.mostrar == 'INSUMOS') {
      this.formularioComprobante = this.fb.group({
        sucursal: ['', Validators.required],
        fArqueo: ['', [Validators.required, this.validadores.validarFecha]],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante: ['INSUMOS', Validators.required],
        comercial: ['', Validators.required],
        insumos: ['', Validators.required],
        tipoComprobante: ['', Validators.required],
        nroComprobante: ['', Validators.required],
        observacion: ['', Validators.required],
      });
    }

    if (this.mostrar == 'RETIRO') {
      this.formularioComprobante = this.fb.group({
        sucursal: ['', Validators.required],
        fArqueo: ['', [Validators.required, this.validadores.validarFecha]],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante: ['RETIRO', Validators.required],
        autorizaNA: ['', Validators.required],
        autorizaCI: ['', Validators.required],
        retiraNA: ['', Validators.required],
        retiraCI: ['', Validators.required],
        motivo: ['', Validators.required],
        tipoComprobante: ['', Validators.required],
        nroComprobante: ['', Validators.required],
        observacion: ['', Validators.required],
      });
    }

    if (this.mostrar == 'DEPOSITO') {
      this.formularioComprobante = this.fb.group({
        sucursal: ['', Validators.required],
        fArqueo: ['', [Validators.required, this.validadores.validarFecha]],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante: ['DEPOSITO', Validators.required],
        banco: ['', Validators.required],
        cuentaBancaria: ['', Validators.required],
        nroComprobante: ['', Validators.required],
        fDeposito: ['', [Validators.required, this.validadores.validarFecha]],
      });

      this.cargarBancos();
      this.cargarCuentas();
    }
    if (this.mostrar == 'TARJETA') {
      this.formularioComprobante = this.fb.group({
        sucursal: ['', Validators.required],
        fArqueo: ['', [Validators.required, this.validadores.validarFecha]],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante: ['TARJETA', Validators.required],
        boleta: ['', Validators.required],
      });
    }
    if (this.mostrar == 'CHEQUE') {
      this.formularioComprobante = this.fb.group({
        sucursal: ['', Validators.required],
        fArqueo: ['', [Validators.required, this.validadores.validarFecha]],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante: ['CHEQUE', Validators.required],
        banco: ['', Validators.required],
        emisor: ['', Validators.required],
        cedula: ['', Validators.required],
        cuentaNro: ['', Validators.required],
        chequeNro: ['', Validators.required],
        paguese: ['', Validators.required],
        observacion: ['', Validators.required],
      });
    }
    if (this.mostrar == 'DESCUENTO') {
      this.formularioComprobante = this.fb.group({
        sucursal: ['', Validators.required],
        fArqueo: ['', [Validators.required, this.validadores.validarFecha]],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante: ['DESCUENTO', Validators.required],
        autorizaNA: ['', Validators.required],
        autorizaCI: ['', Validators.required],
        empleadoNA: ['', Validators.required],
        empleadoCI: ['', Validators.required],
        observacion: ['', Validators.required],
      });
    }
  }
  guardarFormulario() {
    if (this.formularioComprobante.valid) {
      this.creandoComprobante = true;
      let loginToken = localStorage.getItem('token');
      console.log('FORMULARIO:', this.formularioComprobante.value);
      this.arqueoService
        .agregarComprobante(loginToken, this.formularioComprobante.value)
        .subscribe(
          (data) => {
            //imprimir mensaje
            console.log('RESPUESTA:', data);
            Swal.fire({
              allowOutsideClick: false, //false, no puede dar click en otro lugar
              title: 'Exito!!!',
              text: 'El comprobante fue agregado',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            //vaciar formulario
            this.borrarFormulario();
            //ocultar btn de carga
            this.creandoComprobante = false;
          },
          (err) => {
            //ocultar btn carga
            this.creandoComprobante = false;
            Swal.fire({
              allowOutsideClick: false, //false, no puede dar click en otro lugar
              title: 'Error!!!',
              text: 'No se pudo crear el comprobante',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          }
        );
    } else {
      Swal.fire({
        allowOutsideClick: false, //false, no puede dar click en otro lugar
        title: 'Error!',
        text: 'Todos los campos son obligatorios',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }
  seleccionarFormulario(formulario) {
    this.mostrar = formulario;
    this.crearFormulario();
  }

  borrarFormulario() {
    if (this.mostrar == 'ANDE') {
      this.formularioComprobante.reset({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'ANDE',
        nis: '',
        vencimiento: '',
        nroComprobante: '',
      });
    }
    if (this.mostrar == 'SERVICIOS') {
      this.formularioComprobante.reset({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'SERVICIOS',
        servicio: '',
        tipoComprobante: '',
        nroComprobante: '',
        observacion: '',
      });
    }
    if (this.mostrar == 'IMPUESTO') {
      this.formularioComprobante.reset({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'IMPUESTO',
        impuesto: '',
        tipoComprobante: '',
        nroComprobante: '',
        observacion: '',
      });
    }
    if (this.mostrar == 'SALARIO') {
      this.formularioComprobante.reset({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'SALARIO',
        nombreApellido: '',
        cedula: '',
        cargo: '',
        tipoComprobante: '',
        nroComprobante: '',
        observacion: '',
      });
    }
    if (this.mostrar == 'INSUMOS') {
      this.formularioComprobante.reset({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'INSUMOS',
        comercial: '',
        insumos: '',
        tipoComprobante: '',
        nroComprobante: '',
        observacion: '',
      });
    }
    if (this.mostrar == 'RETIRO') {
      this.formularioComprobante.reset({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'RETIRO',
        autorizaNA: '',
        autorizaCI: '',
        retiraNA: '',
        retiraCI: '',
        motivo: '',
        tipoComprobante: '',
        nroComprobante: '',
        observacion: '',
      });
    }
    if (this.mostrar == 'DEPOSITO') {
      this.formularioComprobante = this.fb.group({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'DEPOSITO',
        banco: '',
        cuentaBancaria: '',
        nroComprobante: '',
        fDeposito: '',
      });
    }
    if (this.mostrar == 'TARJETA') {
      this.formularioComprobante = this.fb.group({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'TARJETA',
        boleta: '',
      });
    }
    if (this.mostrar == 'CHEQUE') {
      this.formularioComprobante = this.fb.group({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'CHEQUE',
        banco: '',
        emisor: '',
        cedula: '',
        cuentaNro: '',
        chequeNro: '',
        paguese: '',
        observacion: '',
      });
    }
    if (this.mostrar == 'DESCUENTO') {
      this.formularioComprobante = this.fb.group({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'DESCUENTO',
        autorizaNA: '',
        autorizaCI: '',
        empleadoNA: '',
        empleadoCI: '',
        observacion: '',
      });
    }
  }

  onChange(banco) {
    this.banco = banco;
  }
}
