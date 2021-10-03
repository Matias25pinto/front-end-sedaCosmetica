import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BancosService } from '../../../core/shared/services/bancos.service';
import { Banco } from '../../../core/shared/models/banco.interface';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-banco',
  templateUrl: './formulario-banco.component.html',
})
export class FormularioBancoComponent implements OnInit {
  @Input() isCreate: boolean = true;
  @Input() idBanco: string = '';

  public formularioBanco: FormGroup;
  public loading: boolean = false;
  constructor(private fb: FormBuilder, private bancosService: BancosService) {
    this.formularioBanco = this.fb.group({
      nombre: ['', Validators.required],
      desc: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.idBanco != '') {
      let token = localStorage.getItem('token');
      console.log(this.idBanco);
      this.bancosService.getBanco(token, this.idBanco).subscribe((resp) => {
        this.formularioBanco.reset({ nombre: resp.nombre, desc: resp.desc });
      });
    }
  }
  get nombreNoValido(): boolean {
    return (
      this.formularioBanco.get('nombre').invalid &&
      this.formularioBanco.get('nombre').touched
    );
  }

  get descNoValido(): boolean {
    return (
      this.formularioBanco.get('desc').invalid &&
      this.formularioBanco.get('desc').touched
    );
  }

  enviarFormulario() {
    if (this.formularioBanco.valid) {
      this.loading = true;
      let token = localStorage.getItem('token');
      let nombre = this.formularioBanco.get('nombre')?.value;
      let desc = this.formularioBanco.get('desc')?.value;
      let estado = true;
      let body: Banco = {
        nombre,
        desc,
        estado,
      };
      if (this.isCreate) {
        this.bancosService.crearBanco(token, body).subscribe(
          (resp) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `Se agregó el banco ${
                this.formularioBanco.get('nombre')?.value
              }`,
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
              text: `No se pudo agregar el banco ${
                this.formularioBanco.get('nombre')?.value
              }`,
              footer: 'Verifique que el nombre del banco sea único.',
            });
          }
        );
      } else {
        let id = this.idBanco;
        console.log(id);
        this.bancosService.editarBanco(token, body, id).subscribe(
          (resp) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `Se editó el banco ${
                this.formularioBanco.get('nombre')?.value
              }`,
              showConfirmButton: false,
              timer: 1500,
            });

            this.loading = false;
            console.log(resp);
          },
          (err) => {
            this.loading = false;
            console.warn(err);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `No se pudo editar el banco ${
                this.formularioBanco.get('nombre')?.value
              }`,
              footer: 'Verifique que el nombre del banco sea único.',
            });

          }
        );
      }
    } else {
      Object.values(this.formularioBanco.controls).forEach((control) => {
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
    this.formularioBanco.reset({
      nombre: '',
      desc: '',
    });
  }
}
