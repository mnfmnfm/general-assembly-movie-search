var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs');
var path = require('path');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.get('/', express.static(path.join(__dirname, 'public')));

app.get('/favorites', function(req, res){
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.post('/favorites', function(req, res){
  if(!req.body.Title || !req.body.imdbID){
    res.send("Error: Missing body.Title or body.imdbID");
    return;
  }
  
  var fileContents = fs.readFileSync('./data.json');
  var data = JSON.parse(fileContents);
  if (!fileContents.includes(req.body.imdbID)) {
  	data.push(req.body);
  	fs.writeFile('./data.json', JSON.stringify(data));
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.post('/favorites-clear', function (req,res) {
	fs.truncate('./data.json');
	fs.writeFile('./data.json', '[]');
	res.send(null);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
