const express = require('express');
const app = express();
const fs = require('fs');
const ejs = require('ejs');
const Converter = require('csvtojson').Converter;
const json2csv = require('json2csv');
const bodyParser = require('body-parser');

/*
app.get('/cat', function(req, res) {
  fs.readFile('./sunflowercat.ejs', 'utf-8', function(error, result) {
    if(error) console.log(error);
    else res.status(200).send(ejs.render(result));
  });
});
*/

var array = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/', function(req, res, next) {
  let converter = new Converter({});
  converter.fromFile('./dogam.csv', function(error, result) {
    if(error) console.log(error);
    else {
      array = result;
      next();
    }
  });
});

app.get('/', function(req, res) {
  fs.readFile('./show.ejs', 'utf-8', function(error, result) {
    res.status(200).send(ejs.render(result, {
      array: array
    }));
  });
});

app.get('/:name', function(req, res) {
  console.log(req.params.name);
  res.send("parameter from variabe");
});

app.get('/', function(req, res) {
  console.log(req.query.name);
  res.send("parameter from querystring");
});

app.post('/', function(req, res) {
  console.log(req.body.name);
  console.log(req.body.charactor);
  console.log(req.body.weight);
  console.log(req.body.password);
  res.send("data from body");
});

app.listen(3000, function() {
  console.log('Server running at http://127.0.0.1:3000');
});
