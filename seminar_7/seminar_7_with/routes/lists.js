const express = require('express');
const aws = require('aws-sdk');
const moment = require('moment');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router();
aws.config.loadFromPath('./config/aws_config.json');
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


// get /lists  : 저장된 모든 전체 게시글 조회
router.get('/', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err: ',err);
    else{
      let query = 'select id, view_number, writer, title, written_time from post';
      connection.query(query, function(err, data){
        if(err) res.status(500).send({message : 'selecting query err: ' + err, result :null });
        else res.status(200).send({message : 'ok', result: data});
        connection.release();
      });
    }
  });
});

// TODO : 조회수 올리기
// get /lists/:id : 특정 게시글 조회
router.get('/:id', function(req, res){
  pool.getConnection(function(err, connection){
    var post;
    var comment;
    var result;
    if(err) console.log('getConnection err: ',err);
    else{
      let query1 = 'select * from post where post.id = ?';
      let query2 = 'select comment.writer, comment.written_time, comment.content from comment, post where post.id = ? and post.id = comment.post_id';
      let query3 = 'update post set post.view_number = post.view_number+1 where post.id = ?'
      connection.query(query1, req.params.id, function(err, data){
        if(err) res.status(500).send({message : 'selecting query err: ' + err, result :null });
        else post = data;

      });
      connection.query(query2, req.params.id, function(err, rows){
        if(err) res.status(500).send({message : 'selecting query err: ' + err, result :null });
        else comment = rows;

      });
      connection.query(query3, req.params.id, function(err, rows){
        if(err) res.status(500).send({message : 'updating query err: ' + err, result :null });
        else {
          result = {post : post[0], comment :comment};
           res.status(200).send({ message : 'ok' ,result });
        }
      });
        connection.release();
    }
  });
});



// post lists/:id : 게시글에 댓글 저장
router.post('/:id', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err: ',err);
    else {
      let query = 'insert into comment set ?';
      let record = {
        writer: req.body.writer,
        content: req.body.content,
        post_id: req.params.id,
        written_time: moment(new Date()).format('YYYY-MM-DD, h:mm:ss a')
      };
      connection.query(query, record, function(err){
        if(err) console.log('inserting query err:', err);
        else res.status(201).send({message: 'ok'}); //쿼리 결과는 항상 제이슨 객체에 담아서 응답합니다.
        connection.release();
      });
    }
  });
});
// post lists : 게시글 저장
router.post('/', upload.single('image'), function(req, res){ //ji : 여기서 정한게 클라가 넘겨줄 api key
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err: ',err);
    else {
      let query = 'insert into post set ?'; //placeholder에 들어갈 값으로 배열 대신에 제이슨 객체를 삽입할 수도 있습니다.
      let imageUrl;
      if(!req.file) imageUrl = null;
      else imageUrl = req.file.location;
      let record = {
        writer: req.body.writer,
        title: req.body.title,
        content: req.body.content,
        image_url: imageUrl,
        written_time: moment(new Date()).format('YYYY-MM-DD, h:mm:ss a')
      };
      connection.query(query, record, function(err){
        if(err) console.log('inserting query err:', err);
        else res.status(201).send({message: 'ok'}); //쿼리 결과는 항상 제이슨 객체에 담아서 응답합니다.
        connection.release();
      });
    }
  });
});

module.exports = router;
