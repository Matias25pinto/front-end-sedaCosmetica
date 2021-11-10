import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';
import Swal from 'sweetalert2';
import { Sucursal } from 'src/app/core/shared/models/sucursal.interface';
import { ObjetivosService } from 'src/app/core/shared/services/objetivos.service';
import { ValidadoresService } from 'src/app/core/shared/services/validadores.service';

@Component({
  selector: 'app-crear-objetivo',
  templateUrl: './crear-objetivo.component.html',
})
export class CrearObjetivoComponent implements OnInit {
  public formularioObjetivo: FormGroup;
  public sucursales: Sucursal[] = [];
  public isLoading: boolean = false;

  constructor(
    private sucursalesService: SucursalesService,
    private fb: FormBuilder,
    private objetivosService: ObjetivosService,
    private validadoresService: ValidadoresService
  ) {
    let fecha = new Date();
    let mes = fecha.getMonth() + 1;

    this.formularioObjetivo = this.fb.group({
      incremento: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,3}$')],
      ],
      mes: [
        mes,
        [
          Validators.required,
          Validators.pattern('[0-9]{1,2}$'),
          this.validadoresService.validarMes,
        ],
      ],
      sucursal: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.sucursalesService.getSucursales().subscribe(async (sucursales) => {
      this.sucursales = sucursales;
    });
  }

  get sucursalNoValido(): boolean {
    return (
      (this.formularioObjetivo.get('sucursal')?.invalid &&
        this.formularioObjetivo.get('sucursal').touched) ||
      false
    );
  }

  get mesNoValido(): boolean {
    return (
      (this.formularioObjetivo.get('mes')?.invalid &&
        this.formularioObjetivo.get('mes')?.touched) ||
      false
    );
  }

  get incrementoNoValido(): boolean {
    return (
      (this.formularioObjetivo.get('incremento')?.invalid &&
        this.formularioObjetivo.get('incremento')?.touched) ||
      false
    );
  }

  enviarFormulario() {
    this.isLoading = true;
    if (this.formularioObjetivo.valid) {
      const mes: number = this.formularioObjetivo.get('mes')?.value;
      const sucursal: string = this.formularioObjetivo.get('sucursal')?.value;
      const incremento: number =
        this.formularioObjetivo.get('incremento')?.value;
      const body: any = {
        mes,
        sucursal,
        incremento,
      };
      const token = localStorage.getItem('token');
      this.objetivosService.crearObjetivo(token, body).subscribe(
        (resp) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Objetivo creado`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.limpiarFormulario();
          this.isLoading = false;
        },
        (err) => {
          console.log('ERROR!!!', err);
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `ERROR!! no es posible crear el objetivo`,
            footer: 'Verificar su conexión a internet.',
          });
        }
      );
    } else {
      console.log('Formulario no válido');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `No se pudo crear la sucursal`,
        footer: 'Verifique que su conexión a internet.',
      });
    }
  }

  limpiarFormulario() {
    let fecha = new Date();
    let mes = fecha.getMonth() + 1;

    this.formularioObjetivo.reset({ sucursal: '', mes: mes, incremento: '' });
  }
}
