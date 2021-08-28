// não mexa nestas 3 linhas!
var express = require('express');
var router = express.Router();
var banco = require('../app-banco');
// não mexa nessas 3 linhas!

router.post('/monitor', function (req, res, next) {
  console.log(banco.conexao);
  banco.conectar().then(() => {
    var limite_linhas = 8;
	var iduser = req.body.iduser;
    return banco.sql.query(`select t.idSensor, t.temp, t.umid, f.descricao from Temp_Umi as t
                            join Sensor as s on t.idSensor = s.idSensor where idUser=${sessionStorage.id}
                            join Tipo_Fruta as f on s.idTipo = f.idTipo`);
  }).then(consulta => {

    console.log(`Resultado da consulta: ${JSON.stringify(consulta.recordset)}`);
    res.send(consulta.recordset);

  }).catch(err => {

    var erro = `Erro na leitura dos últimos registros: ${err}`;
    console.error(erro);
    res.status(500).send(erro);

  }).finally(() => {
    banco.sql.close();
  });

});

// não mexa nesta linha!
module.exports = router;