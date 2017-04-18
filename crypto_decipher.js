var crypto = require('crypto');

var key = '이것이 내 암호키다';
var password = "비번이다";

 var cipher = crypto.createCipher('aes192',key); //싸이퍼 객체 생성 aes192라는 알고리즘 사용
 var encoded_result = cipher.update(password, 'utf8', 'base64');//지금 utf8에서 base64
 encoded_result += cipher.final('base64');

 var decipher = crypto.createDecipher('aes192',key);
 var decoded_result = decipher.update(encoded_result,'base64','utf8');
decoded_result += decipher.final('utf8');

console.log("암호화되기 전 비미번호 : ", password);
console.log("암호화 후 : ",encoded_result);
console.log("복호화 후 : ",decoded_result);
