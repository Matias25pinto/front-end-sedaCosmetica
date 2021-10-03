import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CuentasService } from '../../core/shared/services/cuentas.service';
import { BancosService } from '../../core/shared/services/bancos.service';
import { Cuenta } from '../../core/shared/models/cuenta.interface';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
})
export class CuentasComponent implements OnInit {

  public cuentas: Cuenta[] = [];


  public titulo: string = '';

  public idBanco: string = '';

  constructor(
    private cuentasService: CuentasService,
    private bancosService: BancosService,
    private router: Router,
    private routes: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarCuentas();
  }

  cargarCuentas() {
    this.routes.params.subscribe((params) => {
      let banco = params.banco;
      const token = localStorage.getItem('token');
      this.bancosService.getBanco(token, banco).subscribe((banco) => {
        this.titulo = banco.nombre;
	this.idBanco = banco['_id'];
      });
      this.cuentasService.cuentas(token, banco).subscribe(
        (cuentas) => {
          this.cuentas = cuentas;
        },
        (err) => {
          console.warn(err);
        }
      );
    });
  }
  crearCuenta() {
    this.router.navigate(['admin', 'crear-cuenta', this.idBanco]);
  }
  editarCuenta(banco:string, cuenta:string) {
    this.router.navigate(['admin', 'editar-cuenta', banco, cuenta]);
  }

  eliminarCuenta(id: string, titular: string, nroCuenta:string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `¿Está seguro de eliminar la cuenta ${titular} - ${nroCuenta}?`,
        text: 'Si está seguro presione el botón Sí',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Eliminar la cuenta.',
        cancelButtonText: 'No, Cancelar.',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let token = localStorage.getItem('token');
          this.cuentasService.eliminarCuenta(token, id).subscribe(
            (resp) => {
              swalWithBootstrapButtons.fire(
                'Eliminado',
                `Se eliminó la cuenta ${titular} - ${nroCuenta}`,
                'success'
              );
              this.cargarCuentas();
            },
            (err) => {
              console.warn(err);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `No es posible eliminar la cuenta ${titular} - ${nroCuenta}`,
                footer: 'Verifique su conexión a internet.',
              });
            }
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            `No se eliminó la cuenta ${titular} - ${nroCuenta}`,
            'error'
          );
        }
      });
  }
}
