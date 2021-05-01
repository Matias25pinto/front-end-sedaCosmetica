import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ArqueoService } from 'src/app/services/arqueo.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crear-comprobante',
  templateUrl: './crear-comprobante.component.html',
  styleUrls: ['./crear-comprobante.component.css']
})
export class CrearComprobanteComponent implements OnInit {

  public mostrar: string;

  public formularioComprobante: FormGroup;

  public banco: string;

  public creandoComprobante:Boolean = false;

  constructor(private fb: FormBuilder, private arqueoService:ArqueoService, private route:ActivatedRoute) { 
    this.mostrar = '';
    this.banco = '';
  }

  ngOnInit(): void {
    this.subirInicio();
  }
   // Funcion para subir al inicio
   subirInicio(): void{
    window.scroll(0, 0);
  }
  
  crearFormulario() {
    if (this.mostrar == 'ANDE') {
      this.formularioComprobante = this.fb.group({
        nis: ['', Validators.required],
        fVencimiento: ['', Validators.required],
        nroComprobante: ['', Validators.required],
        fPago: ['', Validators.required],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,9}$')]],
        comprobante:['ANDE', Validators.required]
      });
    }

    if (this.mostrar == 'SERVICIOS') {
      this.formularioComprobante = this.fb.group({
        servicio: ['', Validators.required],
        tipoComprobante:['', Validators.required],
        nroComprobante: ['', Validators.required],
        fPago: ['', Validators.required],
        observacion:['', Validators.required],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante:['SERVICIOS', Validators.required]
      });
    }

    if (this.mostrar == 'IMPUESTO') {
      this.formularioComprobante = this.fb.group({
        impuesto: ['', Validators.required],
        tipoComprobante:['', Validators.required],
        nroComprobante: ['', Validators.required],
        fPago: ['', Validators.required],
        observacion:['', Validators.required],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante:['IMPUESTO', Validators.required]
      });
    }

    if (this.mostrar == 'SALARIO') {
      this.formularioComprobante = this.fb.group({
        nombreApellido: ['', Validators.required],
        cedula: ['', Validators.required],
        cargo: ['', Validators.required],
        tipoComprobante:['', Validators.required],
        nroComprobante: ['', Validators.required],
        fPago: ['', Validators.required],
        observacion:['', Validators.required],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante:['SALARIO', Validators.required]
      });
    }

    if (this.mostrar == 'INSUMOS') {
      this.formularioComprobante = this.fb.group({
        comercial: ['', Validators.required],
        insumos: ['', Validators.required],
        tipoComprobante:['', Validators.required],
        nroComprobante: ['', Validators.required],
        fPago: ['', Validators.required],
        observacion:['', Validators.required],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante:['INSUMOS', Validators.required]
      });
    }

    if (this.mostrar == 'RETIRO') {
      this.formularioComprobante = this.fb.group({
        autorizaNA: ['', Validators.required],
        autorizaCI: ['', Validators.required],
        retiraNA: ['', Validators.required],
        retiraCI: ['', Validators.required],
        motivo:['', Validators.required],
        tipoComprobante:['', Validators.required],
        nroComprobante: ['', Validators.required],
        fPago: ['', Validators.required],
        observacion:['', Validators.required],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante:['RETIRO', Validators.required]
      });
    }

    if (this.mostrar == 'DEPOSITO') {
      this.formularioComprobante = this.fb.group({
        banco: ['', Validators.required],
        cuentaBancaria:['', Validators.required],
        nroComprobante: ['', Validators.required],
        fPago: ['', Validators.required],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante:['DEPOSITO', Validators.required],
      });
    }
    if (this.mostrar == 'TARJETA') {
      this.formularioComprobante = this.fb.group({
        boleta: ['', Validators.required],
        fPago: ['', Validators.required],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante:['TARJETA', Validators.required]
      });
    }
    if (this.mostrar == 'CHEQUE') {
      this.formularioComprobante = this.fb.group({
        banco:['',Validators.required],
        emisor: ['', Validators.required],
        cedula:['', Validators.required],
        cuentaNro:['', Validators.required],
        chequeNro: ['', Validators.required],
        paguese:['', Validators.required],
        observacion:['',Validators.required],
        fPago: ['', Validators.required],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante:['CHEQUE', Validators.required]
      });
    }
    if (this.mostrar == 'DESCUENTO') {
      this.formularioComprobante = this.fb.group({
        autorizaNA: ['', Validators.required],
        autorizaCI: ['', Validators.required],
        empleadoNA: ['', Validators.required],
        empleadoCI: ['', Validators.required],
        fPago: ['', Validators.required],
        observacion:['', Validators.required],
        monto: ['', [Validators.required, Validators.pattern('^[0-9]{3,10}$')]],
        comprobante:['DESCUENTO', Validators.required]
      });
    }
    
  }
  guardarFormulario() {
    if (this.formularioComprobante.valid) {
      this.creandoComprobante = true;
      let loginToken = localStorage.getItem('loginToken');
      this.route.params.subscribe(parametros => {
        this.arqueoService.agregarComprobante(loginToken, parametros['id'], this.formularioComprobante.value).subscribe(data => {
          //imprimir mensaje
          Swal.fire({
            allowOutsideClick: false,//false, no puede dar click en otro lugar
            title: 'Exito!!!',
            text: 'El comprobante fue agregado',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          //vaciar formulario
          this.borrarFormulario();
        }, err => {
          Swal.fire({
            allowOutsideClick: false,//false, no puede dar click en otro lugar
            title: 'Error!',
            text: 'Todos los campos son obligatorios',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        });
      }); 
    } else {
      Swal.fire({
        allowOutsideClick: false,//false, no puede dar click en otro lugar
        title: 'Error!',
        text: 'Todos los campos son obligatorios',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
  }
  seleccionarFormulario(formulario) {
    this.mostrar = formulario;
    this.crearFormulario();
    
  }

  borrarFormulario() {
    this.creandoComprobante = false;
    if (this.mostrar == 'ANDE') {
      this.formularioComprobante.reset({
          nis: '',
          fVencimiento: '',
          nroComprobante: '',
          fPago: '',
          monto:''
      })
    }
    if (this.mostrar == 'SERVICIOS') {
      this.formularioComprobante.reset({
        servicio: '',
        tipoComprobante:'',
        nroComprobante: '',
        fPago: '',
        observacion:'',
        monto: '',
        comprobante:'SERVICIOS'
      });
    }
    if (this.mostrar == 'IMPUESTO') {
      this.formularioComprobante.reset({
        impuesto: '',
        tipoComprobante:'',
        nroComprobante: '',
        fPago: '',
        observacion:'',
        monto: '',
        comprobante:'IMPUESTO'
      });
    }
    if (this.mostrar == 'SALARIO') {
      this.formularioComprobante.reset({
        nombreApellido: '',
        cedula: '',
        cargo: '',
        tipoComprobante:'',
        nroComprobante: '',
        fPago: '',
        observacion:'',
        monto: '',
        comprobante:'SALARIO'
      });
    }
    if (this.mostrar == 'INSUMOS') {
      this.formularioComprobante.reset({
        comercial: '',
        insumos: '',
        tipoComprobante:'',
        nroComprobante: '',
        fPago: '',
        observacion:'',
        monto: '',
        comprobante:'INSUMOS'
      });
    }
    if (this.mostrar == 'RETIRO') {
      this.formularioComprobante.reset({
        autorizaNA: '',
        autorizaCI: '',
        retiraNA: '',
        retiraCI: '',
        motivo: '',
        tipoComprobante:'',
        nroComprobante: '',
        fPago: '',
        observacion:'',
        monto: '',
        comprobante:'RETIRO'
      });
    }
    if (this.mostrar == 'DEPOSITO') {
      this.formularioComprobante = this.fb.group({
        banco: '',
        cuentaBancaria:'',
        nroComprobante: '',
        fPago: '',
        monto: '',
        comprobante:'DEPOSITO'
      });
    }
    if (this.mostrar == 'TARJETA') {
      this.formularioComprobante = this.fb.group({
        boleta: '',
        fPago: '',
        monto: '',
        comprobante:'TARJETA'
      });
    }
    if (this.mostrar == 'CHEQUE') {
      this.formularioComprobante = this.fb.group({
        banco:'',
        emisor: '',
        cedula:'',
        cuentaNro:'',
        chequeNro: '',
        paguese:'',
        observacion:'',
        fPago: '',
        monto: '',
        comprobante:'CHEQUE'
      });
    }
    if (this.mostrar == 'DESCUENTO') {
      this.formularioComprobante = this.fb.group({
        autorizaNA: '',
        autorizaCI: '',
        empleadoNA: '',
        empleadoCI: '',
        fPago: '',
        observacion:'',
        monto: '',
        comprobante:'DESCUENTO'
      });
    }
  }

  onChange(banco) {
    this.banco = banco
  }
  

}
