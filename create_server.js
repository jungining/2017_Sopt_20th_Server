const http = require('http');

const server = http.createServer(function(request, response){
  response.writeHead(200,{ //헤더 작성
    'Content-Type' : 'text/html'
  });
  response.write("Hello, http server!"); //바디 작성
  response.end();

});

server.listen(3003, function(){
  console.log("3003번으로 구동중");
});
