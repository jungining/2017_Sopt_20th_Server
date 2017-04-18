const async = require('async');
const fs = require('fs');

function read_lyric(){
  return new Promise(function (fulfill, reject){
    fs.readFile('./read_lyric.txt','utf-8',function(err,result){
      if(err) reject(err);
      else fulfill(result);
    });
  });

}

function write_lyric(lyric){
  return new Promise(function(fulfill, reject){
    fs.writeFile('./write_lyric.txt',lyric,function(err){
      if(err) reject(err);
      else {
        fulfill('complete writeFile');
      }
    });
  });
}

read_lyric()
.then(write_lyric)
.then(result => {console.log(result)});
