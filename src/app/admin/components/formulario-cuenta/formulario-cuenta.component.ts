import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentasService } from '../../../core/shared/services/cuentas.service';
import { Cuenta } from '../../../core/shared/models/cuenta.interface';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-cuenta',
  templateUrl: './formulario-cuenta.component.html',
})
export class FormularioCuentaComponent implements OnInit {
  @Input() isCreate: boolean = true;
  @Input() banco: string = '';
  @Input() idCuenta: string = '';

  public formularioCuenta: FormGroup;
  public loading: boolean = false;
  constructor(private fb: FormBuilder, private cuentasService: CuentasService) {
    this.formularioCuenta = this.fb.group({
      titular: ['', Validators.required],
      nroCuenta: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.idCuenta != '') {
      let token = localStorage.getItem('token');
      this.cuentasService.getCuenta(token, this.idCuenta).subscribe((resp) => {
        this.formularioCuenta.reset({
          titular: resp.titular,
          nroCuenta: resp.nroCuenta,
        });
      });
    }
  }
  get titularNoValido(): boolean {
    return (
      this.formularioCuenta.get('titular').invalid &&
      this.formularioCuenta.get('titular').touched
    );
  }

  get nroCuentaNoValido(): boolean {
    return (
      this.formularioCuenta.get('nroCuenta').invalid &&
      this.formularioCuenta.get('nroCuenta').touched
    );
  }

  enviarFormulario() {
    if (this.formularioCuenta.valid && this.banco != '') {
      this.loading = true;
      let token = localStorage.getItem('token');
      let banco = this.banco;
      let titular = this.formularioCuenta.get('titular')?.value;
      let nroCuenta = this.formularioCuenta.get('nroCuenta')?.value;
      let body: Cuenta = {
        banco,
        titular,
        nroCuenta,
      };
      if (this.isCreate) {
        this.cuentasService.crearCuenta(token, body).subscribe(
          (resp) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `Se agregó la cuenta ${
                this.formularioCuenta.get('titular')?.value
              } - ${this.formularioCuenta.get('nroCuenta')?.value}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.limpiarFormulario();
            this.loading = false;
          },
          (err) => {
            console.warn(err);
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `No es posible agregar la cuenta ${
                this.formularioCuenta.get('nombre')?.value
              }`,
              footer: 'Verifique que el número de cuenta sea único.',
            });
          }
        );
      } else {
        let id = this.idCuenta;
        this.cuentasService.editarCuenta(token, body, id).subscribe(
          (resp) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `Se editó la cuenta ${
                this.formularioCuenta.get('titular')?.value
              } - ${this.formularioCuenta.get('nroCuenta')?.value}`,
              showConfirmButton: false,
              timer: 1500,
            });

            this.loading = false;
          },
          (err) => {
            this.loading = false;
            console.warn(err);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `No es posible editar la cuenta ${
                this.formularioCuenta.get('titular')?.value
              } - ${this.formularioCuenta.get('nroCuenta')?.value}`,
              footer: 'Verifique que el número de cuenta sea único.',
            });
          }
        );
      }
    } else {
      Object.values(this.formularioCuenta.controls).forEach((control) => {
        //control instanceof FormGroup; Si es true es porque control es una instancia de FormGroup por lo tanto es otro formGroup para recorrer
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) =>
            control.markAllAsTouched()
          ); //de esta forma markAllAsTouched(); esta marcando como editados a todos los inputs, Touched:que se toco
        } else {
          control.markAsTouched();
        }
      });
    }
  }

  limpiarFormulario() {
    this.formularioCuenta.reset({
      titular: '',
      nroCuenta: '',
    });
  }
}
