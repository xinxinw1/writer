var express = require('express');
var app = express();
var http = require('http').Server(app);

app.set('port', (process.env.PORT || 8080));

var filesDir = "files";

app.post('/save', function(req, res) {
  var message = 'Save request received.';

  res.send(message);
  console.log(message);

  var saved = saveFile(req);
  if (saved) {
    message = 'File saved successfully.';
    console.log(message);
    res.send(message);
  }
  else {
    message = 'Something went wrong, the file was not saved!';
    console.log(message);
    res.send(message);
  }

});

function saveFile(data) {

}

var mu = require('mu2');

mu.root = __dirname;

app.get(['/', '/index.html'], function (req, res){
  getFiles(function (files){
    var stream = mu.compileAndRender('index.html', {
      files: files.map(function (file){
        return {
          file: file,
          encodedFile: encodeURIComponent(file)
        };
      })
    });
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
