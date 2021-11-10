import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

interface ErrorValidate {
  [s: string]: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ValidadoresService {
  constructor() {}

  validarFecha(control: FormControl): ErrorValidate {
    if (control.value > new Date()) {
      return { validarFecha: true };
    }
    return null;
  }

  validarMes(control: FormControl): ErrorValidate {
    if (control.value > 12 || control.value < 1) {
      return { validarFecha: true };
    }

    return null;
  }

  //validar si dos pass son iguales, es asincrono
  passwordsIguales(pass1Name: string, pass2Name: string) {
    console.log('se compara los passwords');
    return (formGrup: FormGroup) => {
      const pass1Control = formGrup.controls[pass1Name];
      const pass2Control = formGrup.controls[pass2Name];

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };
  }
}
