import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArqueoService } from 'src/app/core/shared/services/arqueo.service';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-iniciar-arqueo',
  templateUrl: './iniciar-arqueo.component.html',
})
export class IniciarArqueoComponent implements OnInit {
  public usuario: any;
  public clientRole = false;
  public vendedorRole = false;
  public adminRole = false;

  public sucursales = [];

  public formularioArqueo: FormGroup;

  constructor(
    private sucursalesService: SucursalesService,
    private fb: FormBuilder,
    private arqueoService: ArqueoService
  ) {}

  ngOnInit(): void {
    this.subirInicio();
    this.sucursalesService.getSucursales().subscribe((data) => {
      this.sucursales = data['sucursalesBD'];
    });

  }

  // Funcion para subir al inicio
  subirInicio(): void {
    window.scroll(0, 0);
  }

    crearFormulaio() {
    if (this.usuario.role == 'ADMIN_ROLE') {
      this.formularioArqueo = this.fb.group({
        sucursal: ['', Validators.required],
        fecha: ['', Validators.required],
        venta: ['', [Validators.required, Validators.pattern('^[0-9]{3,9}$')]],
        totalCosto: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{3,9}$')],
        ],
      });
    }
  }

  async enviarFormulario() {
    let loginToken = localStorage.getItem('token');
    let body = this.formularioArqueo.value;
    console.log('fecha de formulario:', body.fecha);

    if (this.formularioArqueo.valid) {
      if (this.usuario.role == 'ADMIN_ROLE') {
        this.arqueoService.iniciarArqueo(loginToken, body).subscribe(
          (data) => {
            //imprimir mensaje
            Swal.fire({
              allowOutsideClick: false, //false, no puede dar click en otro lugar
              title: 'Arqueo de Caja Iniciado',
              text: 'El arqueo de caja fue un Exito!!!',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            //vaciar formulario
            this.borrarFormulario();
          },
          (err) => {
            Swal.fire({
              allowOutsideClick: false, //false, no puede dar click en otro lugar
              title: 'Error!',
              text: 'El arqueo de caja no fue iniciado',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
            console.log(err);
          }
        );
      }
    } else {
      Swal.fire({
        allowOutsideClick: false, //false, no puede dar click en otro lugar
        title: 'Error!',
        text: 'El arqueo de caja no fue iniciado',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }

  borrarFormulario() {
    if (this.usuario.role == 'ADMIN_ROLE') {
      this.formularioArqueo.reset({
        sucursal: this.usuario.sucursal,
        fecha: '',
        venta: '',
        totalCosto: '',
      });
    }
  }
}
