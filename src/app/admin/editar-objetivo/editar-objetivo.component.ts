import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ObjetivosService } from 'src/app/core/shared/services/objetivos.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-editar-objetivo',
  templateUrl: './editar-objetivo.component.html',
})
export class EditarObjetivoComponent implements OnInit {
  private id: string = '';
  public objetivo: any;
  public meses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  public formulario: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private objetivosService: ObjetivosService
  ) {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      let data = localStorage.getItem('objetivo');
      this.objetivo = JSON.parse(data);
    });

    this.formulario = this.fb.group({
      incremento: [
        this.objetivo.incremento,
        [Validators.required, Validators.pattern('[0-9]{1,3}$')],
      ],
    });
  }

  ngOnInit(): void {}

  get incrementoNoValido(): boolean {
    return (
      (this.formulario.get('incremento')?.invalid &&
        this.formulario.get('incremento')?.touched) ||
      false
    );
  }

  public enviarFormulario(): void {
    if (this.formulario.valid) {
      const incremento = this.formulario.get('incremento')?.value;
      const token = localStorage.getItem('token');
      const body = { incremento };
      this.objetivosService
        .actualizarIncremento(token, this.id, body)
        .subscribe(
          (resp) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `Objetivo actualizado`,
              showConfirmButton: false,
              timer: 1500,
            });
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `ERROR!! no es posible actualizar el objetivo`,
              footer: 'Verificar su conexión a internet.',
            });
          }
        );
    } else {
      console.log('Formulario no válido');
    }
  }
}
