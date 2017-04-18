const async = require('async');
const fs = require('fs');

var task_array = [
  function(callback){
    setInterval(function(){
      console.log("task1");
    },1000);
  },
  function(text, callback){
    setInterval(function(){
      console.log("task2");
    },2000);
  },
  function(callback){
    setInterval(function(){
      console.log("task3");
    },3000);
  }
];

async.parallel(task_array, function(err, result){
  if(err) console.log(err);
  else console.log(result);
});
