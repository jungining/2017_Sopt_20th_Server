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

//포켓몬 리스트 보여주기
router.get('/'+trainer_id, function(req, res){
fs.readFile('views/pokemon.ejs', 'utf-8',function(err,result){
  if(err) console.log('reading ejs err : ', err);
  else res.status(200).send(ejs.render(result));
  });
});


router.get('/pokemon/:trainer_id', function(req, res, next){
  connection.query('select * from pokemon where trainer_id = ?', [req.params.trainer_id], function(error, rows){
    if(error){
      console.log(error);
      res.send(500, "실패");
    }
    else{
      if(rows.length > 0){
        res.render('result', {trainer_name : "트레이너 이름", pokemon :rows});
      }
      else{
        res.send(200, "정보가 없습니다.");
      }
    }
  });
});

 module.exports = router;
