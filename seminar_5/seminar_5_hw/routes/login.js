const fs = require('fs');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const ejs = require('ejs');
const dbConfig = {
  host : 'localhost',
  port : '3306',
  user : 'root',
  password : 'root',
  database : 'sopt_20_seminar5',
  connectionLimit : 10
};

//커넥션 10개가 담기는 풀을 만들어서
const pool = mysql.createPool(dbConfig);

//로그인
router.get('/', function(req, res){
fs.readFile('views/singin.ejs', 'utf-8',function(err,result){
  if(err) console.log('reading ejs err : ', err);
  else res.status(200).send(ejs.render(result));
  });
});

router.get('/login', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err : ', err );
    else{
      let query = 'select * from trainer, pokemon where trainer.id = owns.trainer_id and email = ?';
        connection.query(query , req.query.email, function(err, data){ // injection 방어 : +가 아니라 , 를 추가
          if(err){
            console.log("query err: ", err);
            connection.release(); //pool에 반납ㄴ한다. connection 이면 end()

          }
          else{
            res.redirect('pokemon/'+trainer_id);
            res.status(200).send(data);
            connection.release();
          }
        });
      }
  });
});


 module.exports = router;
