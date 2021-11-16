import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArqueoService } from 'src/app/core/shared/services/arqueo.service';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';
import { ComprobantesService } from 'src/app/core/shared/services/comprobantes.service';
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

  public isLoadingIMG = false;
  public comprobanteIMG: any = {};

  constructor(
    private store: Store<{ usuario: any }>,
    private fb: FormBuilder,
    private arqueoService: ArqueoService,
    private comprobantesService: ComprobantesService,
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
        fVencimiento: ['', Validators.required],
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
        bancoCliente: ['', Validators.required],
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
  crearBody() {
    //Cargar img al body
    let formData = new FormData();
    formData.append('img', this.comprobanteIMG);
    let fecha = `${this.formularioComprobante
      .get('fArqueo')
      ?.value.getFullYear()}-${
      this.formularioComprobante.get('fArqueo')?.value.getMonth() + 1
    }-${this.formularioComprobante.get('fArqueo')?.value.getDate()}`;
    formData.append('fArqueo', fecha);
    formData.append(
      'sucursal',
      this.formularioComprobante.get('sucursal')?.value
    );
    formData.append('monto', this.formularioComprobante.get('monto')?.value);
    formData.append(
      'comprobante',
      this.formularioComprobante.get('comprobante')?.value
    );

    if (this.mostrar == 'ANDE') {
      formData.append('nis', this.formularioComprobante.get('nis')?.value);
      let fechaVencimiento = `${this.formularioComprobante
        .get('fVencimiento')
        ?.value.getFullYear()}-${
        this.formularioComprobante.get('fVencimiento')?.value.getMonth() + 1
      }-${this.formularioComprobante.get('fVencimiento')?.value.getDate()}`;

      formData.append(
        'fVencimiento',
	fechaVencimiento
      );
      formData.append(
        'nroComprobante',
        this.formularioComprobante.get('nroComprobante')?.value
      );
    }
    if (this.mostrar == 'SERVICIOS') {
      formData.append(
        'servicio',
        this.formularioComprobante.get('servicio')?.value
      );
      formData.append(
        'tipoComprobante',
        this.formularioComprobante.get('tipoComprobante')?.value
      );
      formData.append(
        'nroComprobante',
        this.formularioComprobante.get('nroComprobante')?.value
      );
      formData.append(
        'observacion',
        this.formularioComprobante.get('observacion')?.value
      );
    }
    if (this.mostrar == 'IMPUESTO') {
      formData.append(
        'tipoComprobante',
        this.formularioComprobante.get('tipoComprobante')?.value
      );
      formData.append(
        'nroComprobante',
        this.formularioComprobante.get('nroComprobante')?.value
      );
      formData.append(
        'observacion',
        this.formularioComprobante.get('observacion')?.value
      );
      formData.append(
        'impuesto',
        this.formularioComprobante.get('impuesto')?.value
      );
    }
    if (this.mostrar == 'SALARIO') {
      formData.append(
        'tipoComprobante',
        this.formularioComprobante.get('tipoComprobante')?.value
      );
      formData.append(
        'nroComprobante',
        this.formularioComprobante.get('nroComprobante')?.value
      );
      formData.append(
        'observacion',
        this.formularioComprobante.get('observacion')?.value
      );
      formData.append(
        'nombreApellido',
        this.formularioComprobante.get('nombreApellido')?.value
      );
      formData.append(
        'cedula',
        this.formularioComprobante.get('cedula')?.value
      );
      formData.append('cargo', this.formularioComprobante.get('cargo')?.value);
    }
    if (this.mostrar == 'INSUMOS') {
      formData.append(
        'tipoComprobante',
        this.formularioComprobante.get('tipoComprobante')?.value
      );
      formData.append(
        'nroComprobante',
        this.formularioComprobante.get('nroComprobante')?.value
      );
      formData.append(
        'observacion',
        this.formularioComprobante.get('observacion')?.value
      );
      formData.append(
        'comercial',
        this.formularioComprobante.get('comercial')?.value
      );
      formData.append(
        'insumos',
        this.formularioComprobante.get('insumo')?.value
      );
    }
    if (this.mostrar == 'RETIRO') {
      formData.append(
        'tipoComprobante',
        this.formularioComprobante.get('tipoComprobante')?.value
      );
      formData.append(
        'nroComprobante',
        this.formularioComprobante.get('nroComprobante')?.value
      );
      formData.append(
        'observacion',
        this.formularioComprobante.get('observacion')?.value
      );
      formData.append(
        'autorizaNA',
        this.formularioComprobante.get('autorizaNA')?.value
      );
      formData.append(
        'autorizaCI',
        this.formularioComprobante.get('autorizaCI')?.value
      );
      formData.append(
        'retiraNA',
        this.formularioComprobante.get('retiraNA')?.value
      );
      formData.append(
        'retiraCI',
        this.formularioComprobante.get('retiraCI')?.value
      );
      formData.append(
        'motivo',
        this.formularioComprobante.get('motivo')?.value
      );
    }
    if (this.mostrar == 'DEPOSITO') {
      formData.append(
        'tipoComprobante',
        this.formularioComprobante.get('tipoComprobante')?.value
      );
      formData.append(
        'nroComprobante',
        this.formularioComprobante.get('nroComprobante')?.value
      );
      formData.append(
        'observacion',
        this.formularioComprobante.get('observacion')?.value
      );
      formData.append('banco', this.formularioComprobante.get('banco')?.value);
      formData.append(
        'cuentaBancaria',
        this.formularioComprobante.get('cuentaBancaria')?.value
      );
      let fechaDeposito = `${this.formularioComprobante
        .get('fDeposito')
        ?.value.getFullYear()}-${
        this.formularioComprobante.get('fDeposito')?.value.getMonth() + 1
      }-${this.formularioComprobante.get('fDeposito')?.value.getDate()}`;
      formData.append('fDeposito', fechaDeposito);
    }
    if (this.mostrar == 'TARJETA') {
      formData.append(
        'boleta',
        this.formularioComprobante.get('boleta')?.value
      );
    }
    if (this.mostrar == 'CHEQUE') {
      formData.append(
        'observacion',
        this.formularioComprobante.get('observacion')?.value
      );
      formData.append(
        'bancoCliente',
        this.formularioComprobante.get('bancoCliente')?.value
      );
      formData.append(
        'emisor',
        this.formularioComprobante.get('emisor')?.value
      );
      formData.append(
        'cedula',
        this.formularioComprobante.get('cedula')?.value
      );
      formData.append(
        'cuentaNro',
        this.formularioComprobante.get('cuentaNro')?.value
      );
      formData.append(
        'chequeNro',
        this.formularioComprobante.get('chequeNro')?.value
      );
      formData.append(
        'paguese',
        this.formularioComprobante.get('paguese')?.value
      );
    }
    if (this.mostrar == 'DESCUENTO') {
      formData.append(
        'observacion',
        this.formularioComprobante.get('observacion')?.value
      );
      formData.append(
        'autorizaNA',
        this.formularioComprobante.get('autorizaNA')?.value
      );
      formData.append(
        'autorizaCI',
        this.formularioComprobante.get('autorizaCI')?.value
      );
      formData.append(
        'empleadoNA',
        this.formularioComprobante.get('empleadoNA')?.value
      );
      formData.append(
        'empleadoCI',
        this.formularioComprobante.get('empleadoCI')?.value
      );
    }
    return formData;
  }
  guardarFormulario() {
    if (this.formularioComprobante.valid && this.comprobanteIMG) {
      this.creandoComprobante = true;
      //leer token
      let loginToken = localStorage.getItem('token');
      const body = this.crearBody(); //creamos el body
      console.log('formulario: ', this.formularioComprobante.value);
      console.log('formDara', body);
      this.comprobantesService.agregarComprobante(loginToken, body).subscribe(
        (data) => {
          //imprimir mensaje
          console.log(data);
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
          console.warn(err);
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
    this.comprobanteIMG = {};
    if (this.mostrar == 'ANDE') {
      this.formularioComprobante.reset({
        sucursal: '',
        fArqueo: '',
        monto: '',
        comprobante: 'ANDE',
        nis: '',
        fVencimiento: '',
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
        bancoCliente: '',
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

  handleFileInput(files: any) {
    this.isLoadingIMG = true;
    this.comprobanteIMG = files[0];
  }

  onChange(banco) {
    this.banco = banco;
  }
}
