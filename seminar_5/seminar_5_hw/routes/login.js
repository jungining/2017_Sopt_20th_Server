const fs = require('fs');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const ejs = require('ejs');
const bcrypt = require('bcryptjs'); //윈도우에서는 js빼고 돌려주세욤~~~~~

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
fs.readFile('views/login.ejs', 'utf-8',function(err,result){
  if(err) console.log('reading ejs err : ', err);
  else res.status(200).send(ejs.render(result));
  });
});

router.post('/', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err : ', err );
    else{
      let query = 'select * from trainer where email = ?';
        connection.query(query , req.body.email, function(err, data){ // injection 방어 : +가 아니라 , 를 추가
          if(err){
            console.log("query err: ", err);
            connection.release();
          }
          else{
            if(data.length>0){
              bcrypt.compare(req.body.password, data[0].password, function(err, result) {
                  if (err)
                      console.log("compare error", err);
                  else {
                      if (result) { //로그인 성공
                        res.redirect('/pokemon/' + data[0].id);
                      } else {
                        res.status(403).send("아이디나 비밀번호가 올바르지 않습니다");
                      }
                  }
              });
            }
            else{
                res.status(403).send("존재하지 않는 아이디입니다. 먼저 가입해주세요");
            }
            connection.release();
          }
        });
      }
  });
});


 module.exports = router;
