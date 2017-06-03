const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router();
aws.config.loadFromPath('../config/aws_config.json');
const pool = require('../config/db_pool');
const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'sopt20.server.seminar6',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now() + '.' + file.originalname.split('.').pop());
    }
  })
});


// get /pokemon  : 저장된 모든 포켓몬 이름만 조회
router.get('/', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err: ',err);
    else{
      let query = 'select name from pokemon';
      connection.query(query, function(err, data){
        if(err) console.log('selecting query err: ',err);
        else res.status(200).send({result: data});
        connection.release();
      });
    }
  });
});


// get /pokemon/:id : 특정 포켓몬의 모든 정보(이름, 특성, 이미지) 조회
router.get('/:id', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err: ',err);
    else{
      let query = 'select * from pokemon where id = ?';
      connection.query(query, req.params.id, function(err, data){
        if(err) console.log('selecting query err: ',err);
        else res.status(200).send({result: data[0]});
        connection.release();
      });
    }
  });
});

// put /pokemon/:id : 파라미터로 들어온 id 값을 가진 포켓몬 정보 수정
router.put('/:id',upload.single('image'),function(req,res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err: ',err);
    else {
      let query = 'update pokemon set name = ?, charactor = ?, imageUrl = ? where id = ?';
      let imageUrl;
      if(!req.file) imageUrl = null;
      else imageUrl = req.file.location;
      let inserts = [req.body.name, req.body.charactor, imageUrl, req.params.id];
      connection.query(query, inserts, function(err){
        if(err) console.log('inserting query err:', err);
        else res.status(201).send({message: 'edit'});
        connection.release();
      });
    }
  });
});

// delete /pokemon/:id : 파라미터로 들어온 id 값을 가진 포켓몬 정보 삭제
router.delete('/:id', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err: ',err);
    else{
      let query = 'delete from pokemon where id = ?';
      connection.query(query, req.params.id, function(err, data){
        if(err) console.log('selecting query err: ',err);
        else res.status(200).send({message: 'delete'});
        connection.release();
      });
    }
  });
});

// post /pokemon : 새 포켓몬 저장
router.post('/', upload.single('image'), function(req, res){ //ji : 여기서 정한게 클라가 넘겨줄 api key
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err: ',err);
    else {
      let query = 'insert into pokemon set ?'; //placeholder에 들어갈 값으로 배열 대신에 제이슨 객체를 삽입할 수도 있습니다.
      let imageUrl;
      if(!req.file) imageUrl = null;
      else imageUrl = req.file.location;
      let record = {
        name: req.body.name,
        charactor: req.body.charactor,
        imageUrl: imageUrl
      };
      connection.query(query, record, function(err){
        if(err) console.log('inserting query err:', err);
        else res.status(201).send({message: 'save'}); //쿼리 결과는 항상 제이슨 객체에 담아서 응답합니다.
        connection.release();
      });
    }
  });
});

module.exports = router;
