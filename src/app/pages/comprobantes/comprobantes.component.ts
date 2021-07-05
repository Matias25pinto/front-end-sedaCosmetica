import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArqueoService } from 'src/app/services/arqueo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comprobante',
  templateUrl: './comprobantes.component.html',
})
export class ComprobantesComponent implements OnInit {
  public arqueo;
  public comprobantes = [];
  public montoComprobante;
  public adminRole: Boolean = false;
  public userRole: Boolean = false;
  private id;
  constructor(
    private arqueoService: ArqueoService,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    //verificar el login del usuario
    let loginToken = localStorage.getItem('loginToken');
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
    let loginToken = localStorage.getItem('loginToken');
    this.route.params.subscribe((parametros) => {
      this.id = parametros['id'];
      console.log(this.id);
      this.arqueoService.getArqueo(loginToken, this.id).subscribe(
        (data) => {
          this.arqueo = data['arqueoBD'];
          let contador = 0;
          this.comprobantes = this.arqueo['comprobantes'];
          this.montoComprobante = 0;
          console.log(this.comprobantes);
          if (this.comprobantes.length > 0) {
            for (const elemento of this.comprobantes) {
              console.log(elemento);
              this.montoComprobante =
                this.montoComprobante + Number(elemento.monto);
            }
          }

          console.log(this.montoComprobante);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  enviarComprobantes(id) {
    console.log(id);
    this.router.navigate(['crear', 'comprobante', id]);
  }

  eliminarComprobante(id, indexEliminar) {
    let comprobantesUpdate = [];
    let loginToken = localStorage.getItem('loginToken');

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
              console.log(data);
              Swal.fire(
                'Eliminado!',
                'El comprobante fue eliminado exitosamente!!!',
                'success'
              );
              this.cargarComprobante();
            },
            (error) => {
              console.log(error);
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
