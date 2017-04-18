var queryString = require("querystring");

var str = "sopt=20기&part=서버&great=yes";
var parsed = queryString.parse(str);

console.log(parsed);
console.log(parsed.sopt);
console.log(parsed.part);
console.log(parsed.great);
console.log(parsed.friend);
