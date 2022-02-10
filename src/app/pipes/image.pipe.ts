import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(value: string, carpeta:string): unknown {
    
    if(value == ''){
      return `./assets/img/no-image/noimage.png`;
    }
    return `./assets/img/${carpeta}/${value}`;
  }

}
