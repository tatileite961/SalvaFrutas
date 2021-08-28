var desenvolvimento = false;

var configuracoes = {
    producao: {
        server: "sdn.database.windows.net",
        user: "feccorrea",
        password: "podepa1@",
        database: "bdn",
        options: {
            encrypt: true
        },
        pool: {
            max: 4,
            min: 1,
            idleTimeoutMillis: 30000
        }
    },
    desenvolvimento: {
        server: "sdn.database.windows.net",
        user: "",
        password: "",
        database: "bdn",
        options: {
            encrypt: false
        }
    }
}
 
var sql = require('mssql');
sql.on('error', err => {
    console.error(`Erro de Conexão: ${err}`);
});

var perfil = desenvolvimento ? 'desenvolvimento' : 'producao';

function conectar() {
  return sql.connect(configuracoes[perfil])
  // return new sql.ConnectionPool();  
} 

module.exports = {
    conectar: conectar,
    sql: sql
}