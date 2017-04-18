var bcrypt = require('bcryptjs');
var saltRounds = 10 //sale를 해싱하는 횟수
const myPassword = '1';
const anotherPassword = '1';

bcrypt.hash(anotherPassword, saltRounds, function(err, hash){
  if(err) console.log("Hashing error", err);
  else console.log("anotherPassword hashed", hash);
  bcrypt.compare(myPassword, hash,function(err,res){ //비밀번호가 같으면 true, 다르면 flase
    if(err) console.log("comparing error",err);
    else console.log(res);

  });
});
bcrypt.hash(myPassword, saltRounds, function(err, hash){
  if(err) console.log("Hashing error", err);
  else console.log("myPassword hashed", hash);
  bcrypt.compare(anotherPassword, hash,function(err,res){ //비밀번호가 같으면 true, 다르면 flase
    if(err) console.log("comparing error",err);
    else console.log(res);

  });
});
