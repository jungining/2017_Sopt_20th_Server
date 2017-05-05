//이거는 파라미터값을 읽어오는 방법들
//파라미터값 받아오기
const express=require('express');
const app=express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/:name',function(req,res){
  console.log(req.params.name); //id가 name인녀석을 출력.
  res.send("parameter from variable");
});

app.get('/', function(req, res){
  console.log(req.query.name);
  res.send("parameter from variable");
})

//바디에서 불러오려면 바디파서를 깔아야합니다.
