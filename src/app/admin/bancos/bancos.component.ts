import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BancosService } from '../../core/shared/services/bancos.service';
import { Banco } from '../../core/shared/models/banco.interface';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
})
export class BancosComponent implements OnInit {
  public bancos: Banco[] = [];

  public formularioBusqueda: FormGroup;

  constructor(
    private bancosService: BancosService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarBancos();
  }

  crearFormulario() {
    this.formularioBusqueda = this.fb.group({
      nombre: ['', Validators.required],
    });
  }
  buscarBanco(nombre: string) {
    console.log(nombre);
    const token = localStorage.getItem('token');

    if (nombre != '') {
      this.bancosService.buscarBanco(token, nombre).subscribe((bancos) => {
        this.bancos = bancos;
      });
    }
  }

  cargarBancos() {
    const token = localStorage.getItem('token');
    this.bancosService.bancos(token).subscribe(
      (bancos) => {
        this.bancos = bancos;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  crearBanco() {
    this.router.navigate(['admin', 'crear-banco']);
  }
  editarBanco(id) {
    this.router.navigate(['admin', 'editar-banco', id]);
  }

  eliminarBanco(id: string, nombre: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `¿Está seguro de eliminar el banco ${nombre}?`,
        text: 'Si está seguro presione el botón Sí',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Eliminar Banco.',
        cancelButtonText: 'No, Cancelar.',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let token = localStorage.getItem('token');
          this.bancosService.eliminarBanco(token, id).subscribe(
            (resp) => {
              swalWithBootstrapButtons.fire(
                'Eliminado',
                `Se eliminó el banco ${nombre}`,
                'success'
              );
              this.cargarBancos();
            },
            (err) => {
              console.warn(err);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `No es posible eliminar el banco ${nombre}`,
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
            `No se eliminó el banco ${nombre}`,
            'error'
          );
        }
      });
  }
  cuentas(banco: string) {
    this.router.navigate(['admin', 'cuentas', banco]);
  }
}
