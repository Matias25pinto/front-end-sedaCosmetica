import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArqueoService } from 'src/app/services/arqueo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-arqueo',
  templateUrl: './arqueo.component.html',
  styleUrls: ['./arqueo.component.css'],
})
export class ArqueoComponent implements OnInit {
  public usuario: any;
  public clientRole = false;
  public vendedorRole = false;
  public adminRole = false;

  public sucursales = [];

  public formularioArqueo: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private sucursalesService: SucursalesService,
    private fb: FormBuilder,
    private arqueoService: ArqueoService
  ) {}

  ngOnInit(): void {
    this.subirInicio();
    this.sucursalesService.getSucursales().subscribe((data) => {
      this.sucursales = data['sucursalesBD'];
    });

    this.login();
  }

  // Funcion para subir al inicio
  subirInicio(): void {
    window.scroll(0, 0);
  }

  //Verificar si el usuario esta logueado
  login() {
    let loginToken = localStorage.getItem('loginToken');
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

          this.crearFormulaio();
        },
        (err) => {
          console.warn(err);
          // Remover el token
          //localStorage.removeItem('loginToken');
          //vamos a recargar la pagina 3 segundos despues
          setTimeout(() => {
            //Recargar la pagina para que actualice el estado del usuario
            window.location.reload();
          }, 1000);
        }
      );
    }
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
    let loginToken = localStorage.getItem('loginToken');
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
