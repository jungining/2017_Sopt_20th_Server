const express = require('express');
const aws = require('aws-sdk');
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

/* promise-mysql로 전체글 조회 */
// get /lists  : 저장된 모든 전체 게시글 조회
router.get('/', async function(req, res){
  try {
    var connection = await pool.getConnection(); // 동기방식으로 호출하겠다.
    let query = 'select id, view_number,writer, title, written_time from post order by id desc'
    let data = await connection.query(query);
    res.status(200).send({result : data, message : 'ok'});
  }
  catch(err) {
    res.status(500).send({result : [], message : 'selecting posts error : '+err});
  }
  finally{
    pool.releaseConnection(connection);
  }
});




module.exports = router;
