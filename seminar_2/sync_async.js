const fs = require('fs');


try{
  var result = fs.readFileSync('./1.rtf', 'utf-8');
  console.log(result);
} catch(exception){
  console.log("reading file error",exception);
}
fs.readFile('./1.rtf', 'utf-8',function(error, result){
  if(error)
    console.log("reading file error", error);
  else
    console.log(result);
});
var sum = 0;
