//익스프레스 구동 실습E야
//express
const express = require('express');
const app = request(); //고차함수 = 함수를 리턴하는 함수
const fs=require('fs');
const ejs=require('ejs');

app.get('/cat',function(req,res){
  fs.readFile('./sunflowercat.ejs','utf-8',
function(error,result){
  if(error) console.log(error);
  else res.status(200),send(ejs.render(result));
});
});

//포트지정
app.listen(3000,function(){
  console.log("3000번으로 구동중");
});
