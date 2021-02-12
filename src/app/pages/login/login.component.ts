import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  public formularioLogin:FormGroup;

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private router:Router) { 
   
  }

  ngOnInit(): void {
    this.subirInicio();
    this.crearFormulario();
  }
  //Retornar si es valido y si se toco
  get emailNovalido() {
    return this.formularioLogin.get('email').invalid && this.formularioLogin.get('email').touched
  }
  crearFormulario() {
     //Construir formulario
  this.formularioLogin = this.fb.group({
    email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
    password:['', Validators.required],
  });
  }
  // Funcion para subir al inicio
  subirInicio(): void{
    window.scroll(0, 0);
  }

  borrarFormulario() {
    this.formularioLogin.reset({
      email: '',
      password: '',
    })
  }

  login() {
    //Para hacer que se dispare las validaciones si el formulario queda en blanco
    Object.values(this.formularioLogin.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach((control) => {
          control.markAllAsTouched();
        });
      } else {
        control.markAsTouched();
      }
    });
    console.log('Formulario valido: ', this.formularioLogin.valid);
    if (this.formularioLogin.valid) {
      let email = this.formularioLogin.value.email;
      let password = this.formularioLogin.value.password;
      console.log(email, password);
      //Hacer la consulta al servicio que devuelve un observable
      this.usuarioService.login(email, password).subscribe(data => {
        console.log(data);
        // Guardar en el localstorage
        localStorage.setItem("loginToken", data['token']);
        this.borrarFormulario();//borrar el formulario
       
        //imprimir mensaje
        Swal.fire({
          allowOutsideClick: false,//false, no puede dar click en otro lugar
          title: 'Seda Cosmética',
          text: 'Gracias por iniciar sesión en Seda Cosmética',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(result => {
          if (result.isConfirmed) {
            //Redireccionar a usuario
            this.router.navigate(['usuario']);
            setTimeout(() => {
              //Recargar la pagina para que actualice el estado del usuario
             window.location.reload(); 
            },1000);
             
          }
        });      
      }, (error) => {
          console.log(error);
          Swal.fire({
            allowOutsideClick: false,//false, no puede dar click en otro lugar
            title: 'Error!',
            text: 'El inicio de sesión no es válido',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
      });
    }
  }
}
