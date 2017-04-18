const async = require('async');
const fs = require('fs');

var task_array = [
  function(callback){
    fs.readFile('./hello.txt','utf-8', function(err, result){
      if (err) callback(err,null);
      else callback(null, result);
    });
  },
  function(callback){
    fs.readFile('./long.txt','utf-8', function(err, result){
      if (err) callback(err,null);
      else callback(null, result);
    });
  },
  function(callback){
    fs.readFile('./short.txt','utf-8', function(err, result){
      if (err) callback(err,null);
      else callback(null, result);
    });
  }
];

async.series(task_array, function(err,result){
  if(err) console.log(err);
  else console.log(result);
})
