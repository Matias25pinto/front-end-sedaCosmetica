import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArqueoService } from 'src/app/services/arqueo.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: [
  ]
})
export class UsuarioComponent implements OnInit {

  public usuario: any;
  public clientRole = false;
  public userRole = false;
  public adminRole = false;

  public sucursales = [];

  constructor(private usuarioService: UsuarioService,
              private sucursalesService: SucursalesService,
              private fb: FormBuilder,
              private arqueoService: ArqueoService,
              private router: Router) { 

  }

  ngOnInit(): void {
    this.subirInicio();
    
    this.sucursalesService.getSucursales().subscribe(data => {
      this.sucursales = data['sucursalesBD'];
      console.log(this.sucursales)
    });

    this.login();
  }
   // Funcion para subir al inicio
   subirInicio(): void{
    window.scroll(0, 0);
  }
  //Verificar si el usuario esta logueado
  login() {
    let loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      this.usuarioService.verificarLogin(loginToken).subscribe(data => {
        
        this.usuario = data['usuario'];
        if (this.usuario.role == 'CLIENT_ROLE') {
          this.clientRole = true;
        } else if (this.usuario.role == 'ADMIN_ROLE') {
          this.adminRole = true;
        } else if (this.usuario.role == 'USER_ROLE') {
          this.userRole = true;
        }
        console.log(this.usuario);
      }, err => {
          console.warn(err);
          // Remover el token
          localStorage.removeItem('loginToken');
          //vamos a recargar la pagina 3 segundos despues
          setTimeout(() => {
          //Recargar la pagina para que actualice el estado del usuario
           window.location.reload(); 
       }, 1000);
      });

    }
    
  }

  iniciarArqueo() {
    this.router.navigate(['arqueo']);
  }

  verArqueos() {
    this.router.navigate(['arqueos']);
  }

  reportes() {
    this.router.navigate(['reportes']);
  }


}
