const mysql = require('mysql');
const ejs = require('ejs');
const fs = require('fs');
const async = require('async');
const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

router.get('/', function(req, res){
  fs.readFile('views/soptmall.ejs', 'utf-8', function(err, result){
    if(err) console.log('reading ejs error', err);
    else res.status(200).send(ejs.render(result));
  });
});

router.post('/', function(req, res){
  let task_array = [
    function(callback){
      pool.getConnection(function(err, connection){ //dbpool에서 connnection객체 생성.
        if(err) callback("getConnection error: "+err, null);
        else callback(null, connection); //connection을 다음 태스크로 넘겨줌.
      });
    },
    function(connection, callback){
      connection.beginTransaction(function(err){ //connection에 트랜잭션이 시작됨.
        if(err) callback("beginning transaction error: "+err, null);
        else callback(null, connection);
      });
    },
    function(connection, callback){
      let query = 'select point from user where email = ?';
      connection.query(query, req.body.email, function(err, point){
        if(err) {
          connection.rollback(); //쿼리 에러가 발생하면 작업 시작 전의 상태로 되돌린다.
          callback('first query error: '+err, null);
        }
        else callback(null, point[0].point, connection); //정상으로 쿼리가 작동되면 쿼리 결과를 다음 태스크로 넘김.
      });
    },
    function(point, connection, callback){
      let query = 'select * from product where name = ?';
      connection.query(query, req.body.name, function(err, product){
        if(err) {
          connection.rollback();
          callback('second query error: '+err, null);
        }
        else callback(null, point, product[0], connection);
      });
    },
    function(point, product, connection, callback){
      if(point<product.price) {
        res.status(403).send("포인트 잔액이 부족합니다.");
        connection.rollback(); //사용자의 잔액이 부족하면 작업 시작 전의 상태로 되돌린다.
      }
      //여기까지는 db조회(select)만 하는 작업이므로 쿼리에서 에러가 발생하면 release해도 무관함.
      else {
        let query = 'update user set point = point - ? where email = ?';
        connection.query(query, [product.price, req.body.email], function(err){
          if(err){
            connection.rollback();
            //사용자 포인트를 차감하는 쿼리에서 에러가 발생하면 작업 시작 전의 상태로 되돌린다.
            callback('third query error: '+err, null);
          }
          else
            callback(null, product, connection);
        });
      }
    },
    function(product, connection, callback){
      let query = 'select id, point from user where email = ?';
      connection.query(query, req.body.email, function(err, data){
        if(err) {
          connection.rollback();
          //사용자 포인트가 차감된 상태(위의 update작업완료)에서 현재 쿼리에 에러가 발생하면 반드시
          //작업을 모두 취소시켜야 한다.(update 전의 상태로 되돌아가야) 따라서 rollback호출.
          callback('forth query error: '+err, null);
        }
        else callback(null, data[0], product, connection);
      });
    },
    function(data, product, connection, callback){
      let query = 'insert into purchase values (?,?)';
      connection.query(query, [data.id, product.id], function(err){
        if(err) {
          connection.rollback(); //insert도 마찬가지
          callback('fifth query error: '+err, null);
        }
        else {
          res.status(201).send("구매완료되었습니다.");
          connection.commit();
          connection.release();
          callback(null, "done", connection);
        }
      });
    }
  ];
  async.waterfall(task_array, function(err, result){
    if(err) console.log(err);
    else console.log(result);
  });
});

module.exports = router;
