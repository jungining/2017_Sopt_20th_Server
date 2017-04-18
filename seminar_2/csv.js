const fs = require('fs');
const http = require('http');
const json2csv = require('json2csv');

var myCars = [
  {
    "car": "아우디",
    "price": 40000,
    "color": "blue"
  },
  {
    "car": "BMW",
    "price": 35000,
    "color": "black"
  },
  {
    "car": "포르쉐",
    "price": 60000,
    "color": "green"
  }
];

const server = http.createServer(function(req, res){
  var objects = json2csv({data:myCars});
  fs.writeFile('./name.csv', objects, 'utf-8', function(error,data){
    if (error) console.log("reading csv error", error);
    else{
      res.writeHead(201,{
        'Content-Type' : 'text/plain; charset=utf-8'
      });
      res.end('저장완료');
    }
  });

});

server.listen(3000,function() {
  console.log("3000번 포트에서 실행중")
})
