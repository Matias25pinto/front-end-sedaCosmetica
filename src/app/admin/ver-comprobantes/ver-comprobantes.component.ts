import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArqueoService } from 'src/app/core/shared/services/arqueo.service';
import { UsuariosService } from 'src/app/core/shared/services/usuarios.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-comprobantes',
  templateUrl: './ver-comprobantes.component.html',
})
export class VerComprobantesComponent implements OnInit {
  public arqueo;
  public comprobantes = [];
  public montoComprobante;
  public adminRole: Boolean = false;
  public userRole: Boolean = false;
  private id;
  public noExisteComprobantes = false;
  constructor(
    private arqueoService: ArqueoService,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuariosService
  ) {}

  ngOnInit(): void {
    //verificar el login del usuario
    let loginToken = localStorage.getItem('token');
    this.usuarioService.verificarLogin(loginToken).subscribe((data) => {
      if (data['usuario'].role == 'USER_ROLE') {
        this.userRole = true;
      }
      if (data['usuario'].role == 'ADMIN_ROLE') {
        this.adminRole = true;
      }
    });

    this.subirInicio();
    this.cargarComprobante();
  }
  // Funcion para subir al inicio
  subirInicio(): void {
    window.scroll(0, 0);
  }

  cargarComprobante() {
    let loginToken = localStorage.getItem('token');
    this.route.params.subscribe((parametros) => {
      this.id = parametros['id'];
      this.arqueoService.getArqueo(loginToken, this.id).subscribe(
        (data) => {
          this.arqueo = data['arqueoBD'];
          let contador = 0;
          this.comprobantes = this.arqueo['comprobantes'];
          this.montoComprobante = 0;
          if (this.comprobantes.length > 0) {
            for (const elemento of this.comprobantes) {
              this.montoComprobante =
                this.montoComprobante + Number(elemento.monto);
            }
          } else {
            this.noExisteComprobantes = true;
          }
        },
        (err) => {
          console.warn(err);
        }
      );
    });
  }

  enviarComprobantes(id) {
    this.router.navigate(['admin', 'crear-comprobante', id]);
  }

  eliminarComprobante(id, indexEliminar) {
    let comprobantesUpdate = [];
    let loginToken = localStorage.getItem('token');

    for (let index = 0; index < this.comprobantes.length; index++) {
      if (index != indexEliminar) {
        const element = this.comprobantes[index];
        comprobantesUpdate.push(element);
      }
    }

    Swal.fire({
      title: '¿Eliminar el comprobante?',
      text: 'Si esta seguro de eliminar el comprobante presione Sí',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
    }).then((result) => {
      if (result.isConfirmed) {
        this.arqueoService
          .eliminarComprobante(loginToken, id, comprobantesUpdate)
          .subscribe(
            (data) => {
              Swal.fire(
                'Eliminado!',
                'El comprobante fue eliminado exitosamente!!!',
                'success'
              );
              this.cargarComprobante();
            },
            (error) => {
              console.warn(error);
              Swal.fire({
                allowOutsideClick: false, //false, no puede dar click en otro lugar
                title: 'Error!',
                text: 'Ocurrio un error no se eliminoi el comprobante',
                icon: 'error',
                confirmButtonText: 'Ok',
              });
            }
          );
      }
    });
  }
}
