const mysql = require('mysql');

const dbConfig = {
  host : 'sopt20.chhkc03lm5hv.ap-northeast-2.rds.amazonaws.com',
  port : 3306,
  user : 'jungin641',
  password : '1311wjddls!',
  database : 'innodb',
  connectionLimit : 23,
  waitForConnection : true
};
const db_pool = mysql.createPool(dbConfig);
module.exports = db_pool;
