var express = require('express');
var router = express.Router();
var connect = require('../mongoDb');
/* GET users listing. */
router.get('/', function(req, res, next) {
  connect.listarUsuarios(result=>{
   
    res.render('users',{user:result});
   
   })
 
});

module.exports = router;
