const util = require('util');
const EventEmitter = require('events').EventEmitter;

//이름을 바꿔서
var Jungin = function(){};
util.inherits(Jungin, EventEmitter); // Jungin 클래스가 EventEmitter클래스를상속받음.

var jungin = new Jungin();

jungin.on('speak', function(name){
  console.log(name+"가 말한다 예~~~~");
});
jungin.emit('speak', "윤미");
