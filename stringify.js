var rock2 = {
  color: "violet",
  size: "100",
  core: "aqua",
  spec: ["this", "is", "aqua", "stone"]
};
var rock3 = {
  color: "violet",
  size: "100",
  core: "aqua",
  spec: ["this", "is", "aqua", "stone"]
};
var rock4 = {
  color: "violet",
  size: "120",
  core: "aqua",
  spec: ["this", "is", "aqua", "stone"]
};

console.log(typeof JSON.stringify(rock2));
console.log(JSON.stringify(rock2.color)===JSON.stringify(rock3.color));
console.log(JSON.stringify(rock2.color)===JSON.stringify(rock4.color));


console.log("-------------------")
