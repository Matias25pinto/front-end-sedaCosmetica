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
}
