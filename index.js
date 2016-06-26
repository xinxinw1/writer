var express = require('express');
var app = express();
var http = require('http').Server(app);

app.set('port', (process.env.PORT || 8080));

var filesDir = "files";

app.post('/save', function(req, res) {
  res.send('hello world');
});

var mu = require('mu2');

mu.root = __dirname;

app.get(['/', '/index.html'], function (req, res){
  getFiles(function (files){
    var stream = mu.compileAndRender('index.html', {files: files});
    stream.pipe(res);
  }, function (err){
    console.log(err);
    res.send(err.toString());
  });
});

var fs = require('fs');

function getFiles(cb, ef){
  fs.readdir(filesDir, function (err, files){
    if (err){
      console.log(err);
      ef(err);
    } else {
      console.log(files);
      cb(files);
    }
  });
}

app.use(express.static('.'));

http.listen(app.get('port'), function(){
  console.log('listening on port ' + app.get('port'));
});
