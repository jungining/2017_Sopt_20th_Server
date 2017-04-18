const async = require('async');
const fs = require('fs');

var task_array = [
  function(callback){
    fs.readFile('./read_lyric.txt','utf-8', function(err, result){
      if (err) callback(err, null);
      else callback(null, result);
    });
  },
  function(text, callback){
    fs.writeFile('./empty.txt',text, function(err, result){
      if (err) callback(err, null);
      else callback(null, 'complete writeFile');
    });
  }
];

async.waterfall(task_array, function(err, result){
  if(err) console.log(err);
  else console.log(result);
});
