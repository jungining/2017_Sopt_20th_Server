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


router.get('/', function(req, res){
  let query = 'select * from student';
  pool.getConnection(function(err, connection){
    if(err) console.log('getConection error:', err);
    else {
      connection.query(query, function(err, data){
        if(err) console.log("query error: ", err);
        else{
          fs.readFile('views/show_info2.ejs', 'utf-8', function(err, result){
            if(err) console.log("reading ejs error: ", err);
            else res.status(200).send(ejs.render(result,{
              student: data
            }));
          });
        }
      });
    }
  });
});
//저장
router.post('/save', function(req, res){
  let query = 'select * from student where id = ?';
  pool.getConnection(function(err, connection){
    if(err) console.log('getConection error:', err);
    else {
      connection.query(query , req.body.id, function(err, data){ // injection 방어 : +가 아니라 , 를 추가
        if(err){
          console.log("first query err: ", err);
          connection.release(); //pool에 반납ㄴ한다. connection 이면 end()
        }
        else{
          if(data.length!==0) res.status(403).send("이미 저장된 아이디입니다");
          else{
            let query2 = 'insert into student values(?,?,?)';
            connection.query(query2, [req.body.id, req.body.name, req.body.part], function(err, result){
                  if(err){
                    console.log('second query err', err);
                    connection.relase();
                  }
                  else{
                    res.status(201).send("저장완료");
                  }
                  connection.release();
            });
          }
        }
      });
    }
  });
});
//수정
router.post('/edit', function(req, res){
  let query = 'select * from student where id = ?';
  pool.getConnection(function(err, connection){
    if(err) console.log('getConection error:', err);
    else {
      connection.query(query , req.body.id, function(err, data){ // injection 방어 : +가 아니라 , 를 추가
        if(err){
          console.log("first query err: ", err);
          connection.release(); //pool에 반납ㄴ한다. connection 이면 end()
        }
        else{
          if(data.length==0) res.status(403).send("존재하지 않는 아이디입니다.");
          else{'update user set point = point - ? where email = ?';
            let query2 = 'update student set name = ?, part = ? where id = ?';
            connection.query(query2, [req.body.name, req.body.part, req.body.id], function(err, result){
                  if(err){
                    console.log('second query err', err);
                    connection.relase();
                  }
                  else{
                    res.status(202).send("수정완료");
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
