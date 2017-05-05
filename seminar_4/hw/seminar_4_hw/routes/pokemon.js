const fs = require('fs');
const ejs = require('ejs');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Converter = require('csvtojson').Converter;
const json2csv = require('json2csv');

var array = [];

//이미지를 로컬 디스크에 저장할 때 이미지 저장에 대한 옵션을 정할 수 있습니다.
const storage = multer.diskStorage({
  destination: function(req, file, cb){ //destination = 이미지를 저장할 경로
    cb(null, './public/images'); //???????을 이미지가 저장될 위치로 바꿔주세요.
  },
  filename: function(req, file, cb){ //filename = 이미지 저장할 때 이름
    cb(null,req.body.name); //확장자를 뺀 입력한 포켓몬 이름으로 저장
  }
});
const upload = multer({storage: storage}); //위의 storage를 프로퍼티 값으로 갖는 multer객체를 만듭니다.


router.get('/', function(req, res, next){ //ejs파일 열어줌
  let converter = new Converter({});
  converter.fromFile('./pokemon.csv', function(err, result){
    if(err)
      console.log(err);
    else {
      array = result; //array에 csv에서 읽어온 데이터 넣어줌
      next();
    }
  });
}, function(req, res){
  fs.readFile('views/pokemon.ejs', 'utf-8', function(err, result){
    if(err)
      console.log(err);
    else res.status(200).send(ejs.render(result, {
        array : array  //앞의 array은 ejs에서 쓰는 이름, 뒤의 array는 여따가 선언한 array
      }));
  });
});

router.post('/complete', upload.single('pic'), function(req, res){ //이미지 저장

  array.push(req.body);
  var obj = json2csv({data:array}); //cvs에 저장

  fs.writeFile('./pokemon.csv', obj, function(err, result){
    if(err)
      console.log(err);
    else{
      res.status(201).send('저장완료');
    }
  });
});

module.exports = router; //모듈잍라는 전역객체, 모듈을 내보내주어야 한다.
