import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../core/shared/models/usuario.interface';
import { UsuariosService } from '../../core/shared/services/usuarios.service';
import { Router } from '@angular/router';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  public usuarios: Usuario[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    const token = localStorage.getItem('token');
    this.usuariosService.getUsuarios(token).subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  crearUsuario() {
    this.router.navigate(['admin', 'crear-usuario']);
  }
  editarUsuario(id: string) {
    this.router.navigate(['admin', 'editar-usuario', id]);
  }

  cambiarPassword(id: string) {
    this.router.navigate(['admin', 'cambiar-password', id]);
  }

  eliminarUsuario(id: string, nombre: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `¿Está usted seguro de que desea eliminar al usuario: ${nombre}`,
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
          this.usuariosService.eliminarUsuario(id, token).subscribe(
            (resp) => {
              swalWithBootstrapButtons.fire(
                'Eliminado',
                `Se elimino al usuario ${nombre}`,
                'success'
              );
              this.cargarUsuarios();
            },
            (err) => {
              console.warn(err);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `No es posible eliminar al usuario ${nombre}`,
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
            `No se elimino al usuario ${nombre}`,
            'error'
          );
        }
      });
  }
}
