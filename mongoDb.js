const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

//Connection MongoDB (mLabs)

const url ='mongodb://system:system@ds023303.mlab.com:23303/bot_demo';


//Metodos para acceso a la base de datos
module.exports={
    //conDb:conDb,
    //Metodo para buscar todos los registros en la colleccion usuarios
    findAll:function(){

     MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("usuarios").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      });
  },
  //Metodo para buscar por documento
  buscarxCedula:function(documento,cb){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("usuarios").find(documento).toArray(function(err, result) {
        if (err) throw err;
        if(result.length===0){
           cb(result);
        }else{

               cb(result[0]);
          }
        db.close();
      });
    });

  },
  //Metodo para listar todos los usuarios
  listarUsuarios:function(cb){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection('usuarios').find({}).toArray(function(err, result) {
        if (err) throw err;
        if(result.length===0){
           cb(result);
        }else{
            cb(result);
          }
        db.close();
      });
    });

  },
  //metodo para listar las solicitudes
  listarSolicitudes:function(cb){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      let sort = { numeroSolicitud: 1 };
      db.collection('solicitudes').find({}).sort(sort).toArray(function(err, result) {
        if (err) throw err;
        if(result.length===0){
           cb(result);
        }else{
            cb(result);
          }
        db.close();
      });
    });

  },
  //Metodo para buscar credito por numero de documento
  buscarCreditoxCedula:function(documento,cb){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("creditos").find(documento).toArray(function(err, result) {
        if (err) throw err;
        if(result.length===0){
           cb(result);
        }else{
               cb(result[0]);
          }
        db.close();
      });
    });

  },
  //Metodo para buscar por solicitud por id
  buscarSolicitud:function(idSolicitud,cb){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("solicitudes").find({"_id":objectId(idSolicitud)}).toArray(function(err, result) {
        if (err) throw err;
        if(result.length===0){
          cb(result);
        }else{

          cb(result[0]);
        }
        db.close();
      });
    });

  },
//Metodo para insertar solicitudes de refinanciamiento
insertarSolicitud:function(objeto){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection('solicitudes').insertOne(objeto,function(err, result) {
      if (err) throw err;
      console.log('Solicitud creada')
       db.close();
    });
  });

},
  //Metodo para actualizar la solicitud cuando hay rechazo
  actualizarSolicitud:function(id,objeto2){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;

      db.collection('solicitudes').updateOne({"_id":objectId(id)},objeto2,function(err, result) {
        if (err) throw err;
        console.log('Solicitud Actualizada')
        db.close();
      });
    });

  },


  //Metodo para actualizar el credito del usuario cuando es aceptada por un asesor bancario
  actualizarCreditoUsuario:function(idCredito,newValues) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;

      db.collection('creditos').updateOne({"_id": objectId(idCredito)}, newValues, function (err, result) {
        if (err) throw err;
        console.log('Crédito Actualizado');
        db.close();
      });
    });

  },

  //Metodo para incrementar contador del id solicitudes
  actualizarSecuencia:function(cb) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;

        let query = {"id": "productid" };
        let update = {'$inc': { 'seq': 1 } };
        let options = {'new': true};
        let sort = [];

      db.collection("contador").findAndModify(query,sort,update,options,(err,doc)=>{
       if(err) throw err;

       if(!doc){
         console.log('Contador no encontrado');
       }else{
         console.log('Secuencia aumentada en ', doc.value.seq)
       }

       cb(doc.value.seq);

       db.close();

     })



  })

}

};
