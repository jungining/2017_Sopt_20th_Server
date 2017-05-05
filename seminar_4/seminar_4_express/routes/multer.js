const fs = require('fs');
const ejs = require('ejs');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest : './images'}); //프로젝트 폴더명 기준, 이 폴더명 안에 저장됨

//프로젝트 폴더 내에서 npm install, npm start를 이용하여 실행시킴


router.get('/', function(req, res) { //ejs파일 열어줌
  fs.readFile('views/image_upload.ejs', 'utf-8', function(err,result){
    if(err) console.log(err);
    else res.status(200).send(result);
  });
});

//업로드
router.post('/',upload.array('pic',2), function(req, res){
  res.status(201).send("저장완료");
});

// //단일 이미지
// router.post('/',upload.single('pic'), function(req, res){
//   res.status(201).send("저장완료");
// });

module.exports = router; //모듈잍라는 전역객체, 모듈을 내보내주어야 한다.
