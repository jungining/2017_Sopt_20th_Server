const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const s3 = new aws.S3();
aws.config.loadFromPath('./config/aws_config.json');
const pool = require('../config/db_pool');
const multer = require('multer');
const multerS3 = require('multer-s3');
const upload = multer({
    storage : multerS3({
        s3 : s3,
        bucket : 'sopt.server.seminar6',
        acl : 'public-read',
        key : function(req,file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});

router.get('/', function(req, res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err: ',err);
    else{
      let query = 'select * from pokemon';
      connection.query(query, function(err, data){
        if(err) console.log('selecting query err: ',err);
        else res.status(200).send({result: data});
        connection.release();
      });
    }
  });
});

router.post('/', upload.single('pic'), function(req, res){
  pool.getConnection(function(err, connection){
    if(err) console.log('getConnection err: ',err);
    else {
      let query = 'insert into pokemon set = ?';
      let imageUrl;
      if(!req.file) imageUrl = null;
      else imageUrl = req.file.location;
      let record = {
        name: req.body.name,
        character: req.body.character,
        image: imageUrl
      };
      connection.query(query, record, function(err){
        if(err) console.log('inserting query err:', err);
        else res.status(201).send({message: 'save'});
        connection.release();
      });
    }
  });
});

module.exports = router;
