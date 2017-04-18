var crypto = require('crypto');

var password = "비번이지롱비번비번ㄸㄷ예에에에에ㅔㅔㅔㄸㄷ";

var shasum = crypto.createHash('sha1');
shasum.update(password);

var output = shasum.digest('hex');

console.log(output);
