import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { PdfMakeWrapper, Table, Txt, Img } from 'pdfmake-wrapper';//para poder utilizar pdfMake-wrapper

@Component({
  selector: 'app-catalogo-pdf',
  templateUrl: './catalogo-pdf.component.html',
  styleUrls: ['./catalogo-pdf.component.css']
})
export class CatalogoPdfComponent implements OnInit {

  public mercaderias = [];
  public marcas = ['ROUBAIX', 'REAL COLOR', 'NEVADA(NNP)', 'ROSENTAL', 'SKAFE'];
  public marcaActivo = [false, false, false, false, false];
  constructor(private http: ProductosService) { }

  ngOnInit(): void {
    this.subirInicio();
  }
  generarMercaderias(marca, index) {
    if (!this.marcaActivo[index]) {
      if (this.mercaderias.length > 0) {
        this.mercaderias = [];
      }
      this.marcaActivo[index] = true;
      this.http.getMarca(marca).subscribe(data => {
        this.mercaderias = data['mercaderias'];
        this.generarPdf(marca, index);
      });
    }
  }

  async generarPdf(pdfmarca, index) {
    let datos = [];
    let cont = 1;
    let imagen = new Txt('Imagen').bold().end;
    let codigo = new Txt('Código').bold().end;
    let producto = new Txt('Producto').bold().end;
    let linea = new Txt('Línea').bold().end;
    let marca = new Txt('Marca').bold().end;
    datos.push([
      imagen,
      codigo,
      producto,
      linea,
      marca,
    ]);

    //Crear el objeto pdf
    const pdf = new PdfMakeWrapper();
 
    //Cargar JSON para la tabla
    for (const mercaderia of this.mercaderias) {
      let mercaderias = [];
      
      mercaderias.push(await new Img('./assets/img/noimage.png').fit([80,80]).build());
      mercaderias.push(mercaderia.codigo);
      mercaderias.push(mercaderia.productonombre);
      mercaderias.push(mercaderia.lineanombre);
      mercaderias.push(mercaderia.marcanombre);
  
      datos.push(mercaderias);
    }
   

    //Generar estilos al pdf
    pdf.defaultStyle({
      bold: false,
      fontSize: 10,
    });
    //Tamaño de hoja
    //pdf.pageSize('EXECUTIVE');
    
    //Generar margenes
    pdf.pageMargins([30, 80, 30, 60]); //left, top, right, botton
    //Horientacion del documento
    pdf.pageOrientation('landscape'); // 'portrait'
    //Generar el Encabezado
    let encabezado = new Txt(`Seda Cosmética`)
      .bold()
      .decorationStyle('dotted')
      .fontSize(14)
      .alignment('center').end;
    pdf.header(encabezado);
    //Crear la tabla
    let tabla = new Table(datos)
      .alignment('center')
      .layout('lightHorizontalLines').end;

    //Cargar la tabla al pdf
    pdf.add(tabla);
    // ============= Simple watermark ============= la marca de agua
    //pdf.watermark('MXVX Paraguay 2020');

    //Generar el footer
    let fecha = new Date();
    let year = fecha.getFullYear();
    let footer = new Txt(
      `Seda Cosmética ${year} \n www.sedacosmetica.com`
    )
      .bold()
      .alignment('center').end;
    pdf.footer(footer);
    //Crear e imprimir pdf
    pdf.create().download(`Catalogo ${pdfmarca} Seda Cosmetica`);
    setTimeout(() => {
      this.marcaActivo[index] = false;
    }, 10000);
  }
   // Funcion para subir al inicio
   subirInicio(): void{
    window.scroll(0, 0);
  }

}
