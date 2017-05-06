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

//단일 커넥션 객체
//const connection = mysql.createConnection(dbConfig);
// router.get('/', function(req,res){
//   let query = 'select * from student';
//   connection.query(query, function(err, data){
//     if(err){
//       console.log("query err", err);
//       connection.end(); // 커넥션 연결을 끊어줌
//     }
//     else {
//       fs.readFile('views/show_info.ejs','utf-8', function(err,result){
//           if(err)
//             console.log("reading ejs err: ", err);
//           else
//             res.status(200).send(ejs.render(result, {
//             student : data
//           }));
//       });
//     }
//   });//인자로는 쿼리 명령어와 두번째 인자에는 콜백함수
// });


//커넥션 10개가 담기는 풀을 만들어서
const pool = mysql.createPool(dbConfig);
router.get('/', function(req, res){
fs.readFile('views/check_score.ejs', 'utf-8',function(err,result){
  if(err) console.log('reading ejs err : ', err);
  else res.status(200).send(ejs.render(result));
  });
});
router.get('/check_score', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err : ', err );
    else{
      let query = 'select * from student, score where student.id = score.student_id and id = ?';//injection 방어 : ? 추가
        connection.query(query , req.query.student_id, function(err, data){ // injection 방어 : +가 아니라 , 를 추가
          if(err){
            console.log("query err: ", err);
            connection.release(); //pool에 반납ㄴ한다. connection 이면 end()

          }
          else{
            res.status(200).send(data);
            connection.release();
          }
        });
      }
  });
});
module.exports = router;
