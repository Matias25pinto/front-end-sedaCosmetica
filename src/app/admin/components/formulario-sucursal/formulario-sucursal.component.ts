import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from '../../../core/shared/services/sucursales.service';
import { Sucursal } from '../../../core/shared/models/sucursal.interface';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-sucursal',
  templateUrl: './formulario-sucursal.component.html',
})
export class FormularioSucursalComponent implements OnInit {
  @Input() isCreate: boolean = true;
  @Input() idSucursal: string = '';

  public formulario: FormGroup;
  public loading: boolean = false;
  public img: string = 'no-image.png';

  constructor(
    private fb: FormBuilder,
    private sucursalesService: SucursalesService
  ) {
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      direccion: ['', Validators.required],
      tel: ['', [Validators.required, Validators.pattern('[0-9]{1,10}$')]],
      cel: ['', [Validators.required, Validators.pattern('[0-9]{1,10}$')]],
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      codigosucursal: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,2}$')],
      ],
    });
  }

  ngOnInit(): void {
    if (this.idSucursal != '') {
      let token = localStorage.getItem('token');
      console.log(this.idSucursal);
      this.cargarSucursal();
    }
  }

  get tituloNoValido(): boolean {
    return (
      this.formulario.get('titulo').invalid &&
      this.formulario.get('titulo').touched
    );
  }
  get direccionNoValido(): boolean {
    return (
      this.formulario.get('direccion').invalid &&
      this.formulario.get('direccion').touched
    );
  }
  get telNoValido(): boolean {
    return (
      this.formulario.get('tel').invalid && this.formulario.get('tel').touched
    );
  }
  get celNoValido(): boolean {
    return (
      this.formulario.get('cel').invalid && this.formulario.get('cel').touched
    );
  }
  get correoNoValido(): boolean {
    return (
      this.formulario.get('correo').invalid &&
      this.formulario.get('correo').touched
    );
  }

  get codigosucursalNoValido(): boolean {
    return (
      this.formulario.get('codigosucursal').invalid &&
      this.formulario.get('codigosucursal').touched
    );
  }

  cargarSucursal() {
    this.sucursalesService
      .getSucursal(this.idSucursal)
      .subscribe((sucursal) => {
        this.formulario.reset({
          titulo: sucursal.titulo,
          direccion: sucursal.direccion,
          tel: sucursal.tel,
          cel: sucursal.cel,
          correo: sucursal.correo,
          codigosucursal: sucursal.codigosucursal,
        });
      });
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      this.loading = true;

      const token = localStorage.getItem('token');

      const titulo = this.formulario.get('titulo')?.value;
      const direccion = this.formulario.get('direccion')?.value;
      const tel = this.formulario.get('tel')?.value;
      const cel = this.formulario.get('cel')?.value;
      const correo = this.formulario.get('correo')?.value;
      const codigosucursal = this.formulario.get('codigosucursal')?.value;
      const _id = this.idSucursal;
      const img = this.img;
      const estado = true;
      const body: Sucursal = {
        _id,
        titulo,
        direccion,
        tel,
        cel,
        correo,
        codigosucursal,
        img,
        estado,
      };

      if (this.isCreate) {
        this.crearSucursal(token, body);
      } else {
        this.modificarSucursal(token, body);
      }
    } else {
      Object.values(this.formulario.controls).forEach((control) => {
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
  crearSucursal(token: string, body: Sucursal) {
    this.sucursalesService.crearSucursal(token, body).subscribe(
      (resp) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se creo la sucursal  ${resp.titulo}`,
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
          text: `No se pudo crear la sucursal ${
            this.formulario.get('titulo')?.value
          }`,
          footer: 'Verifique que su conexión a internet.',
        });
      }
    );
  }
  modificarSucursal(token: string, body: Sucursal) {
    this.sucursalesService
      .modificarSucursal(token, this.idSucursal, body)
      .subscribe(
        (sucursal) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se modifico la sucursal  ${sucursal.titulo}`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.loading = false;
        },
        (err) => {
          console.warn(err);
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `No se pudo modificar la sucursal ${
              this.formulario.get('titulo')?.value
            }`,
            footer: 'Verifique que su conexión a internet.',
          });
        }
      );
  }
  limpiarFormulario() {
    this.formulario.reset({
      titulo: '',
      direccion: '',
      tel: '',
      cel: '',
      correo: '',
      codigosucursal: '',
    });
  }
}
