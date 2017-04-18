var obj = {
  "name" : "유정인",
  "foo" : function(){
    console.log("객체의 프로퍼티 값에도 함수가 들어갑니다.");
  }
};


console.log(obj['name']);
console.log(obj.name);
console.log(obj.foo());
