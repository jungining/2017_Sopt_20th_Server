const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const ejs = require('ejs'); //확장모듈
const Converter = require('csvtojson').Converter; //확장모듈
const json2csv = require('json2csv'); //확장모듈
const bcrypt = require('bcryptjs'); //확장모듈
const saltRounds = 10;

var array = []; //csv에 write될 배열 json to csv 기능은 json array 배열을 넣어주어야 동작한다.
//request가 get방식인지 post 방식인지에 따라 코드를 분기하여 처리해야 한다.
const server = http.createServer(function(req, res){
  var converter = new Converter({});
  var body = "";
  var jsonDogam;
    //참고링크 : https://tutorialedge.net/converting-csv-json-nodejs
    converter.fromFile("./dogam.csv",function(err,result){
        if(err){
            console.log("An Error Has Occured");
            console.log(err);
        }
        array = result;
        console.log(array);
    });

    req.on('data', function(chunk){ //post로 넘어온 querystring을 append합니다.
      body += chunk;
    });
    req.on('end', function(){ //appned가 완료된 body를 가지고 이 이벤트핸들러에서 작업합니다.
        var saltRounds = 10;
        if(body === ""){ //post에서 넘어온 querystring이 비오있을경우
          fs.readFile('./show.ejs','utf8', function(error, result) {
            if(error) {
              console.log("reading file error\n", error);
            }
            else {
              res.writeHead(200, {
                'Content-Type' : 'text/html'
              });
              res.write(ejs.render(result, { array : array }));
              res.end();
            }
          });
        }
        else{ //post에서 받아온 querystring에 내용이 있을경우
          //body json으로 바꾸고
          jsonDogam = querystring.parse(body);

          //비밀번호 해시한후
          bcrypt.hash(jsonDogam.password, saltRounds, function(err, hashed){
            if(err) console.log("Hashing error", err);
            else {
              jsonDogam.password = hashed;
              array.push(jsonDogam); // jsonArray 형태로 넣어주고
              console.log("jsonDogam in hased", jsonDogam);
              //csv로 바꿔서
              //참고링크 : http://stackoverflow.com/questions/20620771/how-to-parse-json-object-to-csv-file-using-json2csv-nodejs-module
              json2csv({data: array,
                        fields: ['name', 'charactor', 'weight', 'password']}, function(err, csv) {
                if (err) console.log(err);
                fs.writeFile('./dogam.csv', csv, 'utf-8', function(error,data){
                  if (error) console.log("writing csv error", error);
                  else{
                    res.writeHead(201,{
                      'Content-Type' : 'text/plain; charset=utf-8'
                    });
                    res.end("저장완료");
                  }
                });
              });
            }
          });
        }
    });
server.listen(3000,function() {
  console.log("3000번 포트에서 실행중");
});
