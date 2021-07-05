export interface Producto {
  codigoBarra: string;
  producto: string;
  empresa?: number;
  iddeposito?: number;
  codigoDeposito?:number;
  existencia?: number;
  precios?: Array<Precio>;
}

export interface Precio{
  tipoPrecio:string;
  precio:number;
}
