function plus(a,b){ //기명함수
  return a+b;
}

var minus = function (a,b){ //익명힘수
  return a-b;
};

console.log(plus(13,14));
console.log(minus(13,14));
console.log("-----------");

var obj = {
  "name" : "유정인",
  "foo" : function(){
    console.log("객체의 프로퍼티 값에도 함수가 들어갑니다.");
  }
};

function excecutor(object, func){
  func(object);
}

var hamsu = function(obj){
  for (var i in obj )
    console.log(obj[i]);
};
scope2 = 22;

excecutor(obj,hamsu);

function excecutor2(){
  return function(name){
    console.log("댄스왕" + name);
  };
}

excecutor2()("최준성");
