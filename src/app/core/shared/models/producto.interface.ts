export interface Producto {
  codigoBarra: string;
  codigoInterno:string;
  producto: string;
  empresa?: number;
  iddeposito?: number;
  codigoDeposito?:number;
  existencia?: number;
  referencia?:string;
  precios?: Array<Precio>;
}

export interface Precio{
  tipoPrecio:string;
  precio:number;
}
