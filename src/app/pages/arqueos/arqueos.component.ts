import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArqueoService } from 'src/app/services/arqueo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-arqueos',
  templateUrl: './arqueos.component.html',
  styleUrls: ['./arqueos.component.css'],
})
export class ArqueosComponent implements OnInit {
  public arqueos = [];
  public comprobantes = [];
  public montoGastos = [];
  public montoRetiro = [];
  public montoTarjeta = [];
  public montoDeposito = [];
  public mostrarArqueoCaja = false;
  public admin = false;

  constructor(
    private arqueoService: ArqueoService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.subirInicio();

    //verificar el login del usuario
    let loginToken = localStorage.getItem('loginToken');
    this.usuarioService.verificarLogin(loginToken).subscribe((data) => {
      if (data['usuario'].role == 'USER_ROLE') {
        this.mostrarArqueoCaja = true;
      }

      if (data['usuario'].role == 'ADMIN_ROLE') {
        this.admin = true;
      }
    });

    this.cargarArqueos();
  }

  // Funcion para subir al inicio
  subirInicio(): void {
    window.scroll(0, 0);
  }

  cargarArqueos() {
    let loginToken = localStorage.getItem('loginToken');

    this.arqueoService.getArqueos(loginToken).subscribe(
      (data) => {
        this.arqueos = data['arqueosBD'];
        let contador = 0;
        for (const arqueo of this.arqueos) {
          console.log(arqueo);

          this.comprobantes[contador] = arqueo['comprobantes'];
          this.montoGastos[contador] = 0;
          this.montoRetiro[contador] = 0;
          this.montoTarjeta[contador] = 0;
          this.montoDeposito[contador] = 0;

          if (this.comprobantes[contador].length > 0) {
            for (const elemento of this.comprobantes[contador]) {
              if (
                elemento.comprobante != 'RETIRO' &&
                elemento.comprobante != 'TARJETA' &&
                elemento.comprobante != 'CHEQUE' &&
                elemento.comprobante != 'DEPOSITO'
              ) {
                this.montoGastos[contador] =
                  this.montoGastos[contador] + Number(elemento.monto);
              }

              if (elemento.comprobante == 'RETIRO') {
                this.montoRetiro[contador] =
                  this.montoRetiro[contador] + Number(elemento.monto);
              }

              if (elemento.comprobante == 'TARJETA') {
                this.montoTarjeta[contador] =
                  this.montoTarjeta[contador] + Number(elemento.monto);
              }

              if (elemento.comprobante == 'DEPOSITO') {
                this.montoDeposito[contador] =
                  this.montoDeposito[contador] + Number(elemento.monto);
              }
            }
          }
          contador++;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  verComprobantes(id) {
    this.router.navigate(['comprobantes', id]);
  }
  arqueoSucursal(id) {
    this.router.navigate(['arqueo', id]);
  }
  anularArqueo(id) {
    let loginToken = localStorage.getItem('loginToken');
    Swal.fire({
      title: '¿Anular el arqueo?',
      text: 'Si esta seguro de anular el arqueo presionar Sí',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
    }).then((result) => {
      if (result.isConfirmed) {
        this.arqueoService.anularArqueo(loginToken, id).subscribe(
          (resp) => {
            Swal.fire(
              'Anulado!',
              'El arqueo fue anulado exitosamente!!!',
              'success'
            );
            this.cargarArqueos();
          },
          (error) => {
            Swal.fire({
              allowOutsideClick: false, //false, no puede dar click en otro lugar
              title: 'Error!',
              text: 'Ocurrio un error no se anulo el arqueo',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          }
        );
      }
    });
  }
}
