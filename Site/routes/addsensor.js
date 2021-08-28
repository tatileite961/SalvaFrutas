// não mexa nestas 3 linhas!
var express = require('express');
var router = express.Router();
var banco = require('../app-banco');
// não mexa nessas 3 linhas!

//cadastro sensores
router.post('/adicionar',(req, res, next) =>{
    banco.conectar().then(pool => {
      console.log(`Chegou p/ registro: ${JSON.stringify(req.body)}`);
      
      var sensor = req.body.idSensor; 
      
      
      var temper = req.body.tipo; 
     
      
      
      return pool.request().query(`insert into Sensor (idUser, idTipo) values ('${sensor}', '${temper}')`);
    }).then(()=>{
      res.send(200);
    }).catch(err=>{
      console.log(err);
    }).finally(()=>{
      banco.sql.close();
    })
  });

  // não mexa nesta linha!
module.exports = router;
