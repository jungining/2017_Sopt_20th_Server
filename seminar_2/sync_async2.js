const fs = require('fs');

var filenames = fs.readDirSync('.');
for (let i = 0; i< filenames.length; i++){
  console.log(filenames[i]);
}
console.log('can process next job...');
var sum = 0;
for(let i = 9;i<10;i++){
  sum += i;
  console.log(sum);
}
