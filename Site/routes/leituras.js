// não mexa nestas 3 linhas!
var express = require('express');
var router = express.Router();
var banco = require('../app-banco');
// não mexa nessas 3 linhas!

router.get('/ultimas', function (req, res, next) {
  console.log(banco.conexao);
  banco.conectar().then(() => {
    var limite_linhas = 8;
	var id = req.body.idUser;
    return banco.sql.query(`select top ${limite_linhas}
							t.temp, t.umid, t.idSensor, t.datahora	
							from Temp_Umi as t
							where t.idSensor = 7 order by idTU desc`);
  }).then(consulta => {
	let c = 0;
	while(c < consulta.recordset.length){
    console.log(`Resultado da consulta: ${JSON.stringify(consulta.recordset[c])}`);
	c++;
	}
    res.send(consulta.recordset);
  }).catch(err => {

    var erro = `Erro na leitura dos últimos registros: ${err}`;
    console.error(erro);
    res.status(500).send(erro);

  }).finally(() => {
    banco.sql.close();
  });

});

router.post('/ultima', function (req, res, next) {
  console.log(banco.conexao);
  banco.conectar().then(() => {
    var limite_linhas = 8;
	var id = req.body.idsen;
    return banco.sql.query(`select top ${limite_linhas}
							t.temp, t.umid, t.idSensor, t.datahora	
							from Temp_Umi as t
							where t.idSensor = ${id} order by idTU desc`);
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



router.post('/historico', function (req, res, next) {
  console.log(banco.conexao);
  banco.conectar().then(() => {
    var limite_linhas = 8;
	var id = req.body.iduser;
    return banco.sql.query(`select 
							t.idSensor, t.cod_erro, t.datahora, a.cor_erro, a.descricao
							from Temp_Umi as t, Sensor as s, Alerta as a
							where s.idUser = ${id} and t.cod_erro != 1 and t.cod_erro = a.cod_erro and s.idSensor = t.idSensor order by t.idSensor desc`);
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

router.post('/caminhao', function (req, res, next) {
  console.log(banco.conexao);
  banco.conectar().then(() => {
    var limite_linhas = 8;
	var id = req.body.iduser;
    return banco.sql.query(`
select * from Temp_Umi as t 
join Sensor as s on t.idSensor = s.idSensor
join Alerta as a on t.cod_erro = a.cod_erro where idTU in (
select idTU from (
select max(idTU) as idTU , t.idSensor from Temp_Umi as t
join Sensor as s on t.idSensor = s.idSensor
join Alerta as a on t.cod_erro = a.cod_erro where s.idUser = ${id} and t.cod_erro = a.cod_erro and s.idSensor = t.idSensor group by t.idSensor
) as idTU);`);
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



router.get('/estatisticas', function (req, res, next) {
  console.log(banco.conexao);

  var estatisticas = {
    temp_maxima: 0,
    temp_minima: 0,
    temp_media: 0
  };

  banco.conectar().then(() => {
    return banco.sql.query(`
        select 
          max(temperatura) as temp_maxima, 
          min(temperatura) as temp_minima, 
          avg(temperatura) as temp_media 
        from leitura
        `);
  }).then(consulta => {
    estatisticas.temp_maxima = consulta.recordset[0].temp_maxima;
    estatisticas.temp_minima = consulta.recordset[0].temp_minima;
    estatisticas.temp_media = consulta.recordset[0].temp_media;
    console.log(`Estatísticas: ${JSON.stringify(estatisticas)}`);
    res.send(estatisticas);
  }).catch(err => {

    var erro = `Erro na leitura dos últimos registros: ${err}`;
    console.error(erro);
    res.status(500).send(erro);

  }).finally(() => {
    banco.sql.close();
  });

});


router.get('/tempo-real', function (req, res, next) {
  console.log(banco.conexao);

  var estatisticas = {
    temperatura: 0,
    umidade: 0,
    hora : 0
  };

  banco.conectar().then(() => {
    return banco.sql.query(`
        select top 1 temp, umid, datahora from Temp_Umi order by idTU desc
        `);
  }).then(consulta => {

    estatisticas.temperatura = consulta.recordset[0].temp;
    estatisticas.umidade = consulta.recordset[0].umid;
    estatisticas.hora = consulta.recordset[0].datahora;
    console.log(`Tempo real: ${JSON.stringify(estatisticas)}`);

    res.send(consulta.recordset);

  }).catch(err => {

    var erro = `Erro na leitura dos registros de tempo real: ${err}`;
    console.error(erro);
    res.status(500).send(erro);

  }).finally(() => {
    banco.sql.close();
  });
});


// não mexa nesta linha!
module.exports = router;
