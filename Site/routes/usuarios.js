// não mexa nestas 3 linhas!
var express = require('express');
var router = express.Router();
var banco = require('../app-banco');
// não mexa nessas 3 linhas!

router.post('/entrar', function (req, res, next) {

  banco.conectar().then(() => {
    console.log(`Chegou p/ login: ${JSON.stringify(req.body)}`);
    var login = req.body.email; // depois de .body, use o nome (name) do campo em seu formulário de login
    var senha = req.body.senha; // depois de .body, use o nome (name) do campo em seu formulário de login
    if (login == undefined || senha == undefined) {
      throw new Error(`Dados de login não chegaram completos: ${login} / ${senha}`);
    }
    return banco.sql.query(`select *
from Sensor as s 
inner join Usuario as u on s.idUser = u.idUser
where u.email = '${login}' and senha = '${senha}'
group by s.idSensor, s.idUser, s.idTipo, u.idUser, u.email, u.senha,
u.empresa, u.cnpj, u.representante, u.tel, u.endereco, u.numero, u.cidade, u.estado, u.cep;`);
  }).then(consulta => {

    console.log(`Usuários encontrados: ${JSON.stringify(consulta.recordset)}`);

    if (consulta.recordset.length >= 1) {
      res.send(consulta.recordset);
    } else {
      res.sendStatus(404);
    }

  }).catch(err => {

    var erro = `Erro no login: ${err}`;
    console.error(erro);
    res.status(500).send(erro);

  }).finally(() => {
    banco.sql.close();
  });

});
 //cadastro
router.post('/cadastrar',(req, res, next) =>{
  banco.conectar().then(pool => {
    console.log(`Chegou p/ cadastro: ${JSON.stringify(req.body)}`);
    
    var empresa = req.body.empresa; 
    var cnpj = req.body.cnpj; 
    var representante = req.body.representante;
    var telefone = req.body.telefone;
    var email = req.body.email;
    var senha = req.body.senha;
    var endereco = req.body.endereco;
    var numero = req.body.numero;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var cep = req.body.cep;
    
    return pool.request().query(`insert into Usuario (empresa, cnpj, representante, tel, email, senha, endereco, numero, cidade, estado, cep) values ('${empresa}', '${cnpj}', '${representante}', '${telefone}', '${email}', '${senha}', '${endereco}', '${numero}', '${cidade}', '${estado}', '${cep}' )`);
  }).then(()=>{
    res.send(200);
  }).catch(err=>{
    console.log(err);
  }).finally(()=>{
    banco.sql.close();
  })
});



router.post('/profile',(req, res, next) =>{
  banco.conectar().then(pool => {
    console.log(`Chegou p/ perfil: ${JSON.stringify(req.body)}`);
	
	var empresa = req.body.empresa; 
    var cnpj = req.body.cnpj; 
    var representante = req.body.representante;
    var telefone = req.body.telefone;
    var email = req.body.email;
    var senha = req.body.senha;
    var endereco = req.body.endereco;
    var numero = req.body.numero;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var cep = req.body.cep;
	var id = req.body.iduser;
    
    return pool.request().query(`update Usuario set empresa = '${empresa}', cnpj = '${cnpj}', representante = '${representante}', tel = '${telefone}', email = '${email}', senha = '${senha}', endereco = '${endereco}', numero = '${numero}', cidade = '${cidade}', estado = '${estado}', cep = '${cep}' where idUser = ${id};`);
  }).then(()=>{
    res.send(200);
  }).catch(err=>{
    console.log('Erro de perfil:'+err);
    res.send(404);
  }).finally(()=>{
    banco.sql.close();
  })
});

router.post('/sensor',(req, res, next) =>{
  banco.conectar().then(pool => {
    console.log(`Chegou p/ cadastro: ${JSON.stringify(req.body)}`);
    
    var id = req.body.id; 
    
    return pool.request().query(`select * from Sensor where idUser = ${id}`);
  }).then(()=>{
    res.send(200);
  }).catch(err=>{
    console.log(err);
  }).finally(()=>{
    banco.sql.close();
  })
});

router.post('/monitor', function (req, res, next) {
  console.log(banco.conexao);
  banco.conectar().then(() => {
    var limite_linhas = 8;
  var iduser = req.body.iduser;
  var nsensor = req.body.nsensor;
    return banco.sql.query(`select * from Temp_Umi as t 
							join Sensor as s on t.idSensor = s.idSensor
							join Tipo_Fruta as tf on s.idTipo = tf.idTipo where idTU in (
							select idTU from (
							select max(idTU) as idTU , t.idSensor from Temp_Umi as t
							join Sensor as s on t.idSensor = s.idSensor
							join Tipo_Fruta as tf on s.idTipo = tf.idTipo where s.idUser = ${iduser} group by t.idSensor
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

router.post('/adicionar',(req, res, next) =>{
    banco.conectar().then(pool => {
      console.log(`Chegou p/ registro: ${JSON.stringify(req.body)}`);
      
      var id = req.body.iduser; 
      var temper = req.body.sel; 
	  
      return pool.request().query(`insert into Sensor (idUser, idTipo) values ('${id}', '${temper}');`);
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
