const fs = require('fs');

fs.readFile('./long.txt','utf-8', function(err, result){
  if(err)
    console.log(err);
  else
    console.log(result);
}); //얘가 너무 길어서

fs.readFile('./short.txt','utf-8', function(err, result){
  if(err)
    console.log(err);
  else
    console.log(result);
}); //얘가 먼저 실행됨
