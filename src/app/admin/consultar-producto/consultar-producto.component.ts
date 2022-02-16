import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'src/app/core/shared/models/producto.interface';
import { ProductosService } from 'src/app/core/shared/services/productos.service';

@Component({
  selector: 'app-consultar-producto',
  templateUrl: './consultar-producto.component.html',
})
export class ConsultarProductoComponent implements OnInit {
  public termino: string = '';
  public desde: string;
  public pagina: number;
  public paginas: any[] = [];
  public productos: Array<Producto> = [];
  public sinProductos = false;
  public isLoading = false;
  public mostrarProducto = false;

  public formulario: FormGroup;

  public detalle: Producto = {
    producto: '',
    codigoBarra: '',
    existencia: 0,
    precios: [],
  };

  @ViewChild('someInput') someInput: ElementRef;

  constructor(
    private productosService: ProductosService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({ termino: ['', Validators.required] });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.someInput.nativeElement.focus();
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      this.isLoading = true;
      this.termino =
        this.formulario.get('termino')?.value || 'el término de búsqueda';
      this.desde = '0';
      this.cargarProductos(this.termino, this.desde);
    }
  }
  cargarProductos(termino: string, desde: string) {
    this.productosService.buscarProducto(termino, desde).subscribe(
      (resp) => {
        this.isLoading = false;

        this.productos = resp;

        if (resp.length === 0) {
          this.sinProductos = true;
        } else {
          this.sinProductos = false;

          if (this.productos.length == 1) {
            this.cargarDetalleProducto(this.productos[0]);
          } else {
            this.mostrarProducto = false;
          }
        }
        this.limpiarFormulario();
      },
      (err) => {
        this.productos = [];
        this.isLoading = false;
      }
    );
  }

  cargarDetalleProducto(producto: Producto) {
    this.mostrarProducto = true;
    this.detalle = producto;
  }

  limpiarFormulario() {
    this.formulario.reset({ termino: '' });
  }

  siguiente() {
    this.desde = (parseInt(this.desde) + 10).toString();
    this.cargarProductos(this.termino, this.desde);
  }

  anterior() {
    this.desde = (parseInt(this.desde) - 10).toString();
    if (parseInt(this.desde) >= 0) {
      this.cargarProductos(this.termino, this.desde);
    } else {
      this.desde = '0';
    }
  }
}
