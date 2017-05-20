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

// id로 owns 테이블에서 가지고 있는

const pool = mysql.createPool(dbConfig);


router.get('/:trainer_id', function(req, res, next){
  fs.readFile('views/pokemon.ejs', 'utf-8', function(err, result333) {
        if(err) {
          console.log("reading ehs error", err);
          callback(err, null);
        }
        else {
          pool.getConnection(function(err, connection){
            if(err) console.log('getConnection err : ', err );
            else{
              connection.query('select * from trainer where id = ?',req.params.trainer_id, function(err, result){
                if(err){
                  console.log("query err: ", err);
                  connection.release();
                }
                else{
                  var trainer = result[0];
                  connection.query('select * from owns, pokemon where owns.trainer_id = ? and pokemon.id = owns.pokemon_id ORDER BY pokemon.id ASC', req.params.trainer_id, function(error, rows){
                    if(error){
                      res.status(500).send("query err : ",err);
                    }
                    else{
                      if(rows.length > 0){
                        res.send(ejs.render(result333,
                        { trainer_name : trainer.name
                        , pokemon : rows }));
                      }
                      else{
                        res.status(200).send("정보가 없습니다.") ;
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });
    });


 module.exports = router;
