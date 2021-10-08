import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';
import { Sucursal } from 'src/app/core/shared/models/sucursal.interface';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
})
export class SucursalComponent implements OnInit {
  public sucursales: Sucursal[] = [];
  constructor(
    private sucursalesService: SucursalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarSucursales();
  }

  cargarSucursales() {
    this.sucursalesService.getSucursales().subscribe((sucursales) => {
      this.sucursales = sucursales;
    });
  }

  crearSucursal() {
    this.router.navigate(['admin', 'crear-sucursal']);
  }
  modificarSucursal(id: string) {
    this.router.navigate(['admin', 'editar-sucursal', id]);
  }

eliminarSucursal(id: string, nombre: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `¿Está usted seguro de que desea eliminar la sucursal ${nombre}`,
        text: 'Si está seguro presione el botón Sí',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Eliminar.',
        cancelButtonText: 'No, Cancelar.',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let token = localStorage.getItem('token');
          this.sucursalesService.eliminarSucursal(token, id).subscribe(
            (resp) => {
              swalWithBootstrapButtons.fire(
                'Eliminado',
                `Se elimino la sucursal ${nombre}`,
                'success'
              );
              this.cargarSucursales();
            },
            (err) => {
              console.warn(err);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `No es posible eliminar la sucursal ${nombre}`,
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
            `No se elimino la sucursal ${nombre}`,
            'error'
          );
        }
      });
  }

}
