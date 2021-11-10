import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as action from 'src/app/usuario.actions';

import { Sucursal } from 'src/app/core/shared/models/sucursal.interface';
import { SucursalesService } from 'src/app/core/shared/services/sucursales.service';
import { ObjetivosService } from 'src/app/core/shared/services/objetivos.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
})
export class ObjetivosComponent implements OnInit {
  public formulario: FormGroup;

  public usuario$: Observable<any>;
  public usuario: any;

  public isLoading: boolean = false;

  public sucursales: Sucursal[] = [];
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

  public objetivos: any[] = [];

  public years: number[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<{ usuario: any }>,
    private sucursalesService: SucursalesService,
    private objetivosService: ObjetivosService,
    private router: Router
  ) {
    let inicio = 2021;
    let yearNow = new Date().getFullYear();
    yearNow = yearNow;
    for (let i = inicio; i <= yearNow; i++) {
      this.years.push(i);
    }

    this.formulario = this.fb.group({
      sucursal: [''],
      mes: [''],
      year: [yearNow, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.autenticarUsuario();
  }

  autenticarUsuario() {
    this.usuario$ = this.store.select('usuario');

    this.store.dispatch(action.getUsuario());

    this.usuario$.subscribe((data) => {
      this.usuario = data;
      this.sucursalesService.getSucursales().subscribe(async (sucursales) => {
        if (this.usuario.role !== 'ADMIN_ROLE') {
          sucursales.filter((sucursal) => {
            if (sucursal._id == this.usuario.sucursal) {
              this.sucursales.push(sucursal);
              return sucursal;
            }
            return;
          });
        } else {
          this.sucursales = sucursales;
        }
        let fechaActual = new Date();
        this.formulario.reset({
          sucursal: this.sucursales[0]._id,
          mes: fechaActual.getMonth() + 1,
          year: this.years[0],
        });
        this.recargarDatos();
      });
    });
  }

  enviarFormulario(sucursal: string, mes: number, year: number) {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    this.objetivosService.getObjetivos(token, sucursal, mes, year).subscribe(
      (resp) => {
        if (resp['sucursal']) {
          this.objetivos.push(resp);
        }
        if (mes == 12) {
          this.objetivos = this.ordenamientoBurbujaCortoObjetivos(
            this.objetivos
          );
        }

        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        if (mes == 12) {
          this.objetivos = this.ordenamientoBurbujaCortoObjetivos(
            this.objetivos
          );
        }
        this.isLoading = false;
      }
    );
  }

  async recargarDatos() {
    this.objetivos = [];
    const sucursal = this.formulario.get('sucursal')?.value;
    let mes = this.formulario.get('mes')?.value;
    const year = this.formulario.get('year')?.value;
    if (mes == '') {
      for (let i = 1; i <= 12; i++) {
        this.enviarFormulario(sucursal, i, year);
      }
    } else {
      this.enviarFormulario(sucursal, mes, year);
    }
  }

  ordenamientoBurbujaCortoObjetivos(objetivos: any[]): any {
    this.isLoading = true;
    let n, i, k, aux;
    n = objetivos.length;
    // Algoritmo de burbuja
    for (k = 1; k < n; k++) {
      for (i = 0; i < n - k; i++) {
        if (objetivos[i].mes > objetivos[i + 1].mes) {
          aux = objetivos[i];
          objetivos[i] = objetivos[i + 1];
          objetivos[i + 1] = aux;
        }
      }
    }
    this.isLoading = false;
    return objetivos;
  }

  editarObjetivo(objetivo: any) {
    let id = objetivo._id;
    let data = JSON.stringify(objetivo);
    localStorage.setItem('objetivo', data);
    this.router.navigate(['admin', 'editar-objetivo', id]);
  }
}
