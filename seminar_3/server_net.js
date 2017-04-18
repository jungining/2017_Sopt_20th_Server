const net = require('net');

const server = net.createServer(function(socket){
  console.log('tcp서버에 오신것을 환영하오 낯선이여');
  socket.write("서버에서 메시지를 보냅니다.")
  socket.on('data', function(data){ //소켓으로 data가 들어왔을때 호출되는 메소드
    console.log('클라로부터 오는 메시지 : ', data.toString());
  });
  socket.on('end', function(){ //클라가 연결을 종료시켰으면 실행
    console.log("사용자가 나갔슴니다ㅜ");
  });
});

server.on('listening', function(){
  console.log("서버 구동중..");

});

server.on('close',function(){
  console.log("서버 종료합니다~~~~~~");
});
server.listen(3000);
