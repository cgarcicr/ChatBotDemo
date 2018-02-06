var express = require('express');
var connect = require('../mongoDb');
var router = express.Router();
var email=require('../public/javascripts/sendEmail');


/* GET de la página de inicio o listado de solicitudes. */
router.get('/', function(req, res, next) {
  connect.listarSolicitudes(result=>{
   //Renderiza el objeto solicitud con la información almacenada en la coleccion SOLICITUDES
   res.render('index',{solicitud:result});

  })


});
/*POST recibido cuando se rechaza una solicitud */
router.post('/save', function(req, res, next) {

  let idSolicitud = req.body.id_solicitud; //id de la solicitud rechazada
  let estado = {$set:{"Estado":"Rechazado","motivoRechazo":req.body.motivo}};//Estado actual de la solicitud y motivo del rechazo

  //envio del id de la solicitud, estado, y motivo del rechazo para actualizar la coleccion SOLICITUDES
  connect.actualizarSolicitud(idSolicitud,estado);
  //Buscar solicitud por id para obtener la información del usuario y cuenta
  connect.buscarSolicitud(idSolicitud, result=>{
    //construccion del cuerpo del correo
    let contenido = `Sr(a) ${result.datosUsuario.nombres}.
             \nReciba un cordial saludo,
             \nSegún la solicitud realizada el dia ${result.FechaSolicitud} en nuestro portal referente al número de crédito ${result.datosCreditoActual.nro_cuenta},\ninformamos que fue RECHAZADA por los siguientes motivos:
             \n* ${req.body.motivo}
             \nRecuerda que puedes consultar tu información en cualquier momento y visitar las opciones que tenemos disponibles para ti.
             \n\nAtentamente,
             \nAsesor Bancario.
             `;
    //correo del usuario al cual fue rechazada la solicitud
    let correo= result.datosUsuario.email;
    //Asunto del correo
    let asunto = "Solicitud rechazada";
    //Llamado a la función para enviar correo electronico con la información del rechazo
    email.enviarEmail(correo,asunto,contenido);


  })
    //Al terminar el proceso redirecciona la página al inicio
    res.redirect('back')
});


/*POST recibido cuando se acepta una solicitud*/
router.post('/confirm',(req,res,next)=>{

   connect.buscarSolicitud(req.body.solicitudB, result => {
     let cuentaId = result.datosCreditoActual._id;
     let nuevaCuota = result.nuevaCuota;
     let nuevoNroCuotas = result.nuevoNroCuotas;
     let nuevosValores = {$set:{"nro_cuotas": nuevoNroCuotas, "valor_cuota":nuevaCuota}};
     let aceptado = {$set:{"Estado": "Aceptado"}};

     connect.actualizarCreditoUsuario(cuentaId,nuevosValores);

     connect.actualizarSolicitud(req.body.solicitudB,aceptado);


   });


  //Al terminar el proceso redirecciona la página al inicio
  res.redirect('back')


})

module.exports = router;
