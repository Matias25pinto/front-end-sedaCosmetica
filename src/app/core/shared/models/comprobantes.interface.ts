export interface ComprobanteAnde{
    sucrusal:string;
    fArqueo:Date;
    monto:number;
    comprobante:string;
    nis:string;
    fVencimiento:Date;
    nroComprobante:string;
}
export interface ComprobanteServicios{
    sucrusal:string;
    fArqueo:Date;
    monto:number;
    comprobante:string;
    servicio:string;
    tipoComprobante:string;
    nroComprobante:string;
    observacion:string;
}
export interface ComprobanteImpuesto{
    sucrusal:string;
    fArqueo:Date;
    monto:number;
    comprobante:string;
    impuesto:string;
    tipoComprobante:string;
    nroComprobante:string;
    observacion:string;
}
export interface ComprobanteSalario{
    sucrusal:string;
    fArqueo:Date;
    monto:number;
    comprobante:string;
    nombreApellido:string;
    cedula:string;
    cargo:string;
    tipoComprobante:string;
    nroComprobante:string;
    observacion:string;
}
export interface ComprobanteInsumos{
    sucrusal:string;
    fArqueo:Date;
    monto:number;
    comprobante:string;
    comercial:string;
    insumos:string;
    tipoComprobante:string;
    nroComprobante:string;
    observacion:string;
}
export interface ComprobanteRetiro{
    sucrusal:string;
    fArqueo:Date;
    monto:number;
    comprobante:string;
    autorizaNA:string;
    autorizaCI:string;
    retiraNA:string;
    retiraCI:string;
    motivo:string;
    tipoComprobante:string;
    nroComprobante:string;
    observacion:string;
}

export interface ComprobanteDeposito{
    sucrusal:string;
    fArqueo:Date;
    monto:number;
    comprobante:string;
    banco:string;
    cuentaBancaria:string;
    nroComprobante:string;
}
export interface ComprobanteTarjeta{
    sucrusal:string;
    fArqueo:Date;
    monto:number;
    comprobante:string;
    boleta:string;
}
export interface ComprobanteCheque{
    sucrusal:string;
    fArqueo:Date;
    monto:number;
    comprobante:string;
    banco:string;
    emisor:string;
    cedula:string;
    cuentaNro:string;
    chequeNro:string;
    paguese:string;
    observacion:string;
}
export interface ComprobanteDescuento{
    sucrusal:string;
    fArqueo:Date;
    monto:number;
    comprobante:string;
    autorizaNA:string;
    autorizaCI:string;
    empleadoNA:string;
    empleadoCI:string;
    observacion:string;
}