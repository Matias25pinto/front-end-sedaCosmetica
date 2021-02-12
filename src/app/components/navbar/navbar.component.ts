import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
      
      
interface DoCheck {
  ngDoCheck(): void
}
      
      
interface AfterViewChecked {
  ngAfterViewChecked(): void
}
      
      
interface OnDestroy {
  ngOnDestroy(): void
}

    
    

    
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, DoCheck, AfterViewChecked, OnDestroy  {

  public usuarioLogin: Boolean;
  public usuario: any;

  public nombreUsuario: string;

  public menu: string;
  public fijarMenu: boolean;
  public menuOculto: boolean;
  public fijarMenuMovil: boolean;

  public scrollfixed: number;
  public DisplayWithMovil = 800;
  public alturaTitulo = 500; 

  //menu Movil
  public productoOculto = true;
  public promocionesOculto =  true;
  public LineasOculto = true;
  //Submenu movil
  public rostroOculto = true;
  public ojosOculto = true;
  public setOculto = true;
  public labiosOculto = true;
  public unasOculto = true;
  public accesoriosOculto = true;
  public pielOculto = true;
  public corporalOculto = true;

  public menuScroll: number = 0;

  constructor(private routes: Router, private usuarioService: UsuarioService) {
    // ver los valores del scroll del usuario
    
    window.onscroll = () => {
      if (screen.width <= this.DisplayWithMovil) {
        let resolucionPantalla = screen.height;//resolucion de pantalla
        this.menuScroll= resolucionPantalla//iniciar el menuScroll con la resolucion de pantalla
        //dimension de menu movil acutomatico con el scroll
        let ubicacionScroll = window.scrollY; // ubicacion del scroll actual
        this.menuScroll = ubicacionScroll+resolucionPantalla;
        //Fijar menu movil
        this.fijarMenuMovilSmall();
      } else {
        this.fijarMenuPc();
      }
    };

    this.menuOculto = false;
  }

  ngOnInit(): void {

    this.usuarioLogueado();
   
    // verificar tamaño de menu nav
    let menunav = document.getElementById('nav');
    let menuflotante = document.getElementById('menuflotante');
    let heightMenunav = menunav.offsetHeight; //altura del menu
    if (screen.width <= this.DisplayWithMovil) {
      menunav.style.top = `0px`; //cambiar el top del menu
      this.scrollfixed = heightMenunav; // la suma de las dos alturas que seria el scroll para cambiar la position a fixed
    } else {
      menunav.style.top = '0px'; //cambiar el top del menu
      menuflotante.style.top= `${String(menunav.offsetHeight+10)}px`
    }
    //calcular la altura del titulo
    
  }
  ngDoCheck() {
    //Cargar usuario
    if (this.usuario) {
      this.nombreUsuario = this.usuario.nombre;
    } else {
      this.nombreUsuario = '';
    }
    
  }

  ngAfterViewChecked() {
   
  }
  ngOnDestroy() {
    console.log('se destruyo el componente')
  }

  // Funcion para subir al inicio
  subirInicio(): void{
    window.scroll(0, 0);
  }
  cambiarValor(valor:boolean){
    if(valor){
      return false;
    }else{
      return true;
    }
  }
  fijarMenuMovilSmall(): void {
    if (window.scrollY > this.scrollfixed) {
      this.fijarMenuMovil = true;
    } else {
      this.fijarMenuMovil = false;
    }
  }
  fijarMenuPc(): void {
    if (window.scrollY > 500) {
      this.fijarMenu = true;
    } else {
      this.fijarMenu = false;
    }
  }
  mostrarMenu(idmenu: string): void {
    if (this.menu != null && this.menu != idmenu) {
      this.ocultarMenu();
    }
    this.menu = idmenu;
    let menu = document.getElementById(idmenu);
    menu.style.display = 'flex';
  }
  ocultarMenu(): void {
    let menu = document.getElementById(this.menu);
    setTimeout(() => {
      menu.style.display = 'none';
    }, 10);
  }
  ocultarMenuMovil(): void {
    if (this.menuOculto) {
      this.menuOculto = false;
    } else {
      this.menuOculto = true;

      //Ocultar Submenu movil
      this.rostroOculto = true;
      this.ojosOculto = true;
      this.setOculto = true;
      this.labiosOculto = true;
      this.unasOculto = true;
      this.accesoriosOculto = true;
      this.pielOculto = true;
      this.corporalOculto = true;
      //Ocultar menu Movil
      this.productoOculto = true;
      this.promocionesOculto =  true;
      this.LineasOculto = true;
    }
  }
  //Enivamos a la ruta de buscar
  buscarMercaderia(termino) {
    this.routes.navigate(['buscar', termino,'0']);
  }

  usuarioLogueado() {
    //Verficiar si existe token valido
    let loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      this.usuarioService.verificarLogin(loginToken).subscribe(data => {
        this.usuario = data['usuario'];
        this.usuarioLogin = true;
      }, err => {
          console.warn(err);
          this.usuarioService.cerrarLogin();
          this.usuarioLogin = false;
      }); 
    } else {
      this.usuarioLogin = false;
    }
 }

  cerrarLogin() {
    this.usuarioService.cerrarLogin();
    this.usuarioLogueado();
    this.routes.navigate['/login'];
  }
 
}
