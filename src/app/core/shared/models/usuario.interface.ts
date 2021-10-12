export interface Usuario{
  _id?:string;
  nombre:string;
  apellido:string;
  cedula:string;
  ruc:string;
  celular:string
  password?:string;
  img:string;
  role:string;
  sucursal:string;
  precios:Array<string>;
  deposito:number;
  email:string
}
