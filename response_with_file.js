const fs = require('fs');
const http = require('http');
const ejs = require('ejs');

http.createServer(function(request, response) {
  //비동기
  fs.readFile('./hello_kitty.ejs','utf8', function(error, result) {
    if(error) {
      console.log("reading file error\n", error);
    }
    else {
      response.writeHead(200, {
        'Content-Type' : 'text/html'
      });
      response.write(ejs.render(result));
      response.end();
    }
  });
}).listen(3001, function() {
  console.log("3001 port로 구동중");
});
