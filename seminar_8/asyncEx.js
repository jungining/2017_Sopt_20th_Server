

function fulFillAfter2Sec(x) {
  return new Promise(function(fulfill){
    setTimeout(function() {
      console.log(x);
      fulfill(x);
    }, 2000); //2초 뒤에
  });
}

async function execute(){
  let a = await fulFillAfter2Sec(2);
  let b = await fulFillAfter2Sec(3);
  console.log(a+b);
}

execute();
