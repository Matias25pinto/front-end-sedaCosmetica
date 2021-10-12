import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../core/shared/services/usuarios.service';
import { Usuario } from '../../core/shared/models/usuario.interface';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { SucursalesService } from '../../core/shared/services/sucursales.service';
import { ValidadoresService } from '../../core/shared/services/validadores.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
})
export class EditarUsuarioComponent implements OnInit {
  public formulario: FormGroup;
  public loading: boolean = false;

  public sucursales: any[];

  public precios: string[] = [];
  public noExistePrecios: boolean = false;

  public usuario: Usuario;
  public id: string = '';

  constructor(
    private fb: FormBuilder,
    private sucursalesService: SucursalesService,
    private usuariosService: UsuariosService,
    private routes: ActivatedRoute
  ) {
    this.sucursalesService.getSucursales().subscribe((sucursales) => {
      this.sucursales = sucursales;
    });
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      cedula: ['', [Validators.required]],
      ruc: ['', [Validators.required]],
      celular: ['', [Validators.required, Validators.pattern('[0-9]{1,10}$')]],
      role: ['', [Validators.required]],
      sucursal: ['', [Validators.required]],
      preven: [false, []],
      preven2: [false, []],
      preven3: [false, []],
      preven4: [false, []],
      preven5: [false, []],
      preven6: [false, []],
      preven7: [false, []],
      preven8: [false, []],
      pcosto: [false, []],
      deposito: ['', [Validators.required, Validators.pattern('[0-9]{1,2}$')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      this.id = params['id'];
      const token = localStorage.getItem('token');
      this.usuariosService.getUsuario(this.id, token).subscribe((usuario) => {
        this.usuario = usuario;
        this.cargarFormulario();
      });
    });
  }

  get nombreNoValido(): boolean {
    return (
      this.formulario.get('nombre').invalid &&
      this.formulario.get('nombre').touched
    );
  }

  get apellidoNoValido(): boolean {
    return (
      this.formulario.get('apellido').invalid &&
      this.formulario.get('apellido').touched
    );
  }
  get cedulaNoValido(): boolean {
    return (
      this.formulario.get('cedula').invalid &&
      this.formulario.get('cedula').touched
    );
  }

  get rucNoValido(): boolean {
    return (
      this.formulario.get('ruc').invalid && this.formulario.get('ruc').touched
    );
  }
  get celularNoValido(): boolean {
    return (
      this.formulario.get('celular').invalid &&
      this.formulario.get('celular').touched
    );
  }

  get roleNoValido(): boolean {
    return (
      this.formulario.get('role').invalid && this.formulario.get('role').touched
    );
  }
  get sucursalNoValido(): boolean {
    return (
      this.formulario.get('sucursal').invalid &&
      this.formulario.get('sucursal').touched
    );
  }

  get depositoNoValido(): boolean {
    return (
      this.formulario.get('deposito').invalid &&
      this.formulario.get('deposito').touched
    );
  }
  get emailNoValido(): boolean {
    return (
      this.formulario.get('email').invalid &&
      this.formulario.get('email').touched
    );
  }
  cargarPrecios() {
    this.precios = [];
    this.noExistePrecios = false;
    if (this.formulario.get('preven').value === true) {
      this.precios.push('preven');
    }
    if (this.formulario.get('preven2').value === true) {
      this.precios.push('preven2');
    }
    if (this.formulario.get('preven3').value === true) {
      this.precios.push('preven3');
    }
    if (this.formulario.get('preven4').value === true) {
      this.precios.push('preven4');
    }
    if (this.formulario.get('preven5').value === true) {
      this.precios.push('preven5');
    }
    if (this.formulario.get('preven6').value === true) {
      this.precios.push('preven6');
    }
    if (this.formulario.get('preven7').value === true) {
      this.precios.push('preven7');
    }
    if (this.formulario.get('preven8').value === true) {
      this.precios.push('preven8');
    }
    if (this.formulario.get('pcosto').value === true) {
      this.precios.push('pcosto');
    }
    if (this.precios.length === 0) {
      this.noExistePrecios = true;
    }
  }
  enviarFormulario() {
    this.cargarPrecios();
    if (this.formulario.valid && this.precios.length > 0) {
      this.loading = true;
      const nombre = this.formulario.get('nombre')?.value;
      const apellido = this.formulario.get('apellido')?.value;
      const cedula = this.formulario.get('cedula')?.value;
      const ruc = this.formulario.get('ruc')?.value;
      const celular = this.formulario.get('celular')?.value;
      const password = this.formulario.get('password')?.value;
      const role = this.formulario.get('role')?.value;
      const sucursal = this.formulario.get('sucursal')?.value;
      const deposito = this.formulario.get('deposito')?.value;
      const email = this.formulario.get('email')?.value;

      const token = localStorage.getItem('token');
      const body: Usuario = {
        nombre,
        apellido,
        cedula,
        ruc,
        celular,
        password,
        role,
        sucursal,
        deposito,
        email,
        precios: this.precios,
        img: 'no-image.png',
      };
      this.usuariosService.editarUsuario(this.id, token, body).subscribe(
        (resp) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Usuario actualizado`,
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
            text: `No es posible actualizar el usuario ${
              this.formulario.get('nombre')?.value
            } ${this.formulario.get('apellido')?.value}`,
            footer: 'Verifique que su conexión a internet.',
          });
        }
      );
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

      console.log('El formulario no es válido');
    }
  }

  cargarFormulario() {
    this.formulario.reset({
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      cedula: this.usuario.cedula,
      ruc: this.usuario.ruc,
      celular: this.usuario.celular,
      role: this.usuario.role,
      sucursal: this.usuario.sucursal,
      preven: this.usuario.precios.includes('preven') == true ? true : false,
      preven2: this.usuario.precios.includes('preven2') == true ? true : false,
      preven3: this.usuario.precios.includes('preven3') == true ? true : false,
      preven4: this.usuario.precios.includes('preven4') == true ? true : false,
      preven5: this.usuario.precios.includes('preven5') == true ? true : false,
      preven6: this.usuario.precios.includes('preven6') == true ? true : false,
      preven7: this.usuario.precios.includes('preven7') == true ? true : false,
      preven8: this.usuario.precios.includes('preven8') == true ? true : false,
      pcosto: this.usuario.precios.includes('pcosto') == true ? true : false,
      deposito: this.usuario.deposito,
      email: this.usuario.email,
    });
  }
}
