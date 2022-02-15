import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precio'
})
export class PrecioPipe implements PipeTransform {

  transform(value: string): unknown {
    let ultimoCaracter = value.substr(-1);
    if(this.isNum(ultimoCaracter)){
      return `Precio ${ultimoCaracter}`;
    }else if(ultimoCaracter == 'n'){
      return `Precio 1`;
    }else if(ultimoCaracter == 'o'){
      return `Precio Costo`;
    }
    return value;
  }

  isNum(val){
    return !isNaN(val)
  }

}
