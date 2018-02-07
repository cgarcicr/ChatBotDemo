
module.exports.calcularCuota=(capitalInicial,interes,nroCuotas)=>{
   //Formula cuota fija tasa fija p*(    i*Math.pow((1+i),n)/Math.pow((1+i),n)-1   );

let p=capitalInicial;//capital inicial
let i=interes;//interesnominal (12%= 0.12/12 = 0.01)
let n=nroCuotas;// nro de cuotas

let numerador=i*Math.pow((1+i),n);
let denominador=Math.pow((1+i),n)-1

var div=numerador/denominador;
//var w=div.toString();
var l=div.toString().substr(0,6);
var cuota=(p*l);
return cuota;

};

module.exports.calcularNroCuotas=(capitalInicial,interes,valorCuota)=>{
    //Formula para calcular el nro de cuotas n=Log(A)-Log(A-i.P)/Log(1+i)
    let a=valorCuota;//valor cuota
    let i=interes;//interesnominal (12%= 0.12/12 = 0.01)
    let p=capitalInicial//capital inicial

    let numerador=Math.log(a)-Math.log(a-i*p);
    let denominador=Math.log(1+i);
    let nroCuotas=numerador/denominador;

    return Math.round(nroCuotas);
};

