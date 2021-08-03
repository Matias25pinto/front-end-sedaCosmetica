import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';
import { UsuariosService } from 'src/app/core/shared/services/usuarios.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  public usuario: any;
  public clientRole = false;
  public userRole = false;
  public adminRole = false;

  public sucursales = [];

  constructor(
    private usuarioService: UsuariosService,
    private sucursalesService: SucursalesService,
    private router: Router
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
    let loginToken = localStorage.getItem('token');
    if (loginToken) {
      this.usuarioService.verificarLogin(loginToken).subscribe(
        (data) => {
          this.usuario = data['usuario'];
          if (this.usuario.role == 'CLIENT_ROLE') {
            this.clientRole = true;
          } else if (this.usuario.role == 'ADMIN_ROLE') {
            this.adminRole = true;
          } else if (this.usuario.role == 'USER_ROLE') {
            this.userRole = true;
          }
        },
        (err) => {
          console.warn(err);
          // Remover el token
          localStorage.removeItem('token');
        }
      );
    }
  }

  iniciarArqueo() {
    this.router.navigate(['admin', 'iniciar-arqueo']);
  }

  verArqueos() {
    this.router.navigate(['admin', 'arqueos']);
  }

  reporteBanco() {
    this.router.navigate(['admin', 'reportes']);
  }
  reporteCuenta() {
    this.router.navigate(['admin', 'reportes', 'cuentas']);
  }

  reporteGeneral() {
    this.router.navigate(['admin', 'reporte', 'general']);
  }

  dashboard() {
    this.router.navigate(['admin', 'dashboard']);
  }

  cargarComprobante() {
    this.router.navigate(['admin', 'crear-comprobante']);
  }

  verComprobantes() {
    this.router.navigate(['admin', 'ver-comprobantes']);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['', 'login']);
  }
}
