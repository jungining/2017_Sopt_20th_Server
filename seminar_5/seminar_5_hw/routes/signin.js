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

//ejs 보여주기
router.get('/', function(req, res) { //ejs파일 열어줌
  fs.readFile('views/signin.ejs', 'utf-8', function(err,result){
    if(err) console.log(err);
    else res.status(200).send(result);
  });
});

//회원가입
router.post('/', function(req, res){
  let query = 'select * from trainer where email = ?';
  pool.getConnection(function(err, connection){
    if(err) console.log('getConection error:', err);
    else {
      connection.query(query , req.body.email, function(err, data){ // injection 방어 : +가 아니라 , 를 추가
        if(err){
          console.log("first query err: ", err);
          connection.release(); //pool에 반납ㄴ한다. connection 이면 end()
        }
        else{
          if(data.length!==0) res.status(403).send("이미 존재하는 계정입니다.");
          else{
            let query2 = 'insert into trainer values(null,?,?,?)';
            connection.query(query2, [req.body.email, req.body.name, req.body.password], function(err, result){
                  if(err){
                    console.log('second query err', err);
                    connection.relase();
                  }
                  else{
                    res.status(201).send("회원가입 완료");
                  }
                  connection.release();
            });
          }
        }
      });
    }
  });
});


 module.exports = router;
