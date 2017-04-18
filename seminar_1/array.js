var array = [1, "안녕하세요~~~", { 2 : 4}, true];
console.log(array);

var i = array.length;

array[i] = "hello";
array[i+1] = "hello1";
array[i+2] = "hello2";

console.log(array);

delete array[3];

console.log(array);
console.log("null");
var a = null;

console.log(a);


//배열순회
for(var j = 0; j < array.length; j++){
  console.log(array[j]);
} //삭제된원소까지모두순회한다.(undefined로처리)
for(var x in array){
  console.log(array[x]);
} // 삭제된원소는순회하지않는다.
