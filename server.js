var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs');
var path = require('path');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', express.static(path.join(__dirname, 'public')));

app.get('/favorites', function(req, res){
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.post('/favorites', function(req, res){
  
  if(!req.body.Title || !req.body.imdbID){
  	var response = "empty";
  	for (var item in req.body) {
  		response += item + ":" + body[item] + ",";
  	}
    res.send("Error: Missing body.Title or body.imdbID in:" + response);
    return;
  }
  
  var data = JSON.parse(fs.readFileSync('./data.json'));
  data.push(req.body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.listen(3000, function(){
  console.log("Listening on port 3000");
});