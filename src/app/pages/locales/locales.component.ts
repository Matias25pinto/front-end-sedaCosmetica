import { Component, OnInit } from '@angular/core';
import { getMaxListeners } from 'process';

@Component({
  selector: 'app-locales',
  templateUrl: './locales.component.html',
  styles: [],
})
export class LocalesComponent implements OnInit {
  public locales = [
    {
      titulo: 'Sucursal Guarambare',
      direccion: 'Tte Nicasio Insaurralde c/ Tte Leandro Pineda',
      tel: '0293932436',
      cel:'0984888050',
      correo: 'suguar@sedacosmetica.com',
      img: './assets/img/localGuarambare.jpeg',
    },
    {
      titulo: 'Sucursal Ñemby',
      direccion: 'Acceso Sur c/9 de Agosto Ñemby ',
      tel: '021951762',
      cel:'0984888050',
      correo: 'sucñemby@sedacosmetica.com',
      img: './assets/img/noimage.png',
    },
    {
      titulo: 'Sucursal San Lorenzo',
      direccion: 'Mcal estigarribia',
      tel: '021586092',
      cel:'0984888050',
      correo: 'suc2@sedacosmetica.com',
      img: './assets/img/noimage.png',
    },
    {
      titulo: 'Sucursal San Lorenzo ',
      direccion: 'J.M.C Sagento Silva',
      tel: '021570188',
      cel:'0984888050',
      correo: 'suc1@sedacosmetica.com',
      img: './assets/img/noimage.png',
    },
    {
      titulo: 'Sucursal San Lorenzo J.M.C C/Gral caballero',
      direccion: '',
      tel: '0213392454',
      cel:'0984888050',
      correo: 'suc3@sedacosmetica.com',
      img: './assets/img/noimage.png',
    },
    {
      titulo: 'Sucursal Capiata',
      direccion: 'Mcal Estigarribia esquina candelaria y 2 de Febrero',
      tel: '0228634586',
      cel:'0984888050',
      correo: 'sucapiata@sedacosmetica.com',
      img: './assets/img/noimage.png',
    },
    {
      titulo: 'Sucursal MARIA AUXILIADORA',
      direccion: 'Calle Mari auxiliadora esquina Tomas Romero Pereira y Ñasaindy',
      tel: '076420236',
      cel:'076420236',
      correo: 'sucursalmaria_auxiliadora@sedacosmetica.com',
      img: './assets/img/noimage.png',
    },
    {
      titulo: 'Sucursal Itaugua',
      direccion: 'Ruta 2 mcal estigarribia calle virgen del rosario',
      tel: '0294220730',
      cel:'0984888050',
      correo: 'sucitaugua@sedacosmetica.com',
      img: './assets/img/noimage.png',
    },
    {
      titulo: 'Sucursal Luque',
      direccion: 'Cnel Martinez esquina Heroes del Chaco',
      tel: '0971222530',
      cel:'0971222530',
      correo: 'sucluque@sedacosmetica.com',
      img: './assets/img/noimage.png',
    },
    {
      titulo: 'Casa Central Distribuidor',
      direccion: 'Ex combatiente Gaona entre gral caballero y mariscal estigarribia',
      tel: '0228630182',
      cel:'0984888050',
      correo: 'ventas@sedacosmetica.com',
      img: './assets/img/noimage.png',
    },
   
  ];
  constructor() {}

  ngOnInit(): void {
    this.subirInicio()
  }

  llamar(nro: string):string{
    return `tel:${nro}`
  }
  whatsApp(nro: string){
     // abrir la app de what con un mensaje
     let what = Number(nro);//Convierte el nro a Number para que desaparezca el cero
     window.open(`https://wa.me/+595${what}?text=¿Qué tal?`, '_blank');
  }
   // Funcion para subir al inicio
   subirInicio(): void{
    window.scroll(0, 0);
  }
}
