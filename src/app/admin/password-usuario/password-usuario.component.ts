import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../core/shared/services/usuarios.service';
import { Usuario } from '../../core/shared/models/usuario.interface';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ValidadoresService } from '../../core/shared/services/validadores.service';

@Component({
  selector: 'app-password-usuario',
  templateUrl: './password-usuario.component.html',
  styleUrls: ['./password-usuario.component.css'],
})
export class PasswordUsuarioComponent implements OnInit {
  public formulario: FormGroup;
  public loading: boolean = false;
  public id = '';
  public usuario: Usuario;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private validadoresService: ValidadoresService,
    private routes: ActivatedRoute
  ) {
    this.formulario = this.fb.group(
      {
        password: ['', [Validators.required]],
        verificar_password: ['', [Validators.required]],
      },
      {
        //Para validar password de forma ascincrona
        //validadores ascincronos
        validators: this.validadoresService.passwordsIguales(
          'password',
          'verificar_password'
        ),
      }
    );
  }

  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      this.id = params['id'];
      const token = localStorage.getItem('token');
      this.usuariosService.getUsuario(this.id, token).subscribe((usuario) => {
        this.usuario = usuario;
      });
    });
  }
  get passwordNoValido(): boolean {
    return (
      this.formulario.get('password').invalid &&
      this.formulario.get('password').touched
    );
  }
  get verificar_passwordNoValido(): boolean {
    return (
      this.formulario.get('verificar_password').invalid &&
      this.formulario.get('verificar_password').touched
    );
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      this.loading = true;
      const password = this.formulario.get('password')?.value;

      const token = localStorage.getItem('token');
      const body = {
        password,
      };
      this.usuariosService.cambiarPassword(this.id, token, body).subscribe(
        (resp) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se actualizo la contraseña del usuario ${resp.nombre} ${resp.apellido}`,
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
            text: `No es posible actualizar la contraseña del usuario.`,
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

  limpiarFormulario() {
    this.formulario.reset({
      password: '',
      verificar_password: '',
    });
  }
}
