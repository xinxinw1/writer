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
  getFiles(filesDir, function (files){
    console.log(files);
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

function getFiles(dir, cb, ef){
  fs.readdir(dir, function (err, files){
    if (err){
      ef(err);
    } else {
      cb(files);
    }
  });
}

var path = require('path');

app.get('/file.html', function (req, res){
  var file = req.query.file;
  if (file === undefined){
    var stream = mu.compileAndRender('file.html', {
      data: "null"
    });
    stream.pipe(res);
  } else {
    var serverPath = path.normalize(filesDir + "/" + file);
    console.log(serverPath);
    readFileJSON(serverPath, function (json){
      console.log("Read file " + serverPath);
      var stream = mu.compileAndRender('file.html', {
        data: JSON.stringify(json)
      });
      stream.pipe(res);
    }, function (err){
      console.log(err);
      res.send(err.toString());
    });
  }
});

function readFile(file, cb, ef){
  fs.readFile(file, 'utf8', function (err, data) {
    if (err){
      ef(err);
    } else {
      cb(data);
    }
  });
}

function readFileJSON(file, cb, ef){
  readFile(file, function (data){
    var json;
    try {
      json = JSON.parse(data);
    } catch (e){
      console.log(e);
      ef(e);
      return;
    }
    cb(json);
  }, ef);
}

app.use(express.static('.'));

http.listen(app.get('port'), function(){
  console.log('listening on port ' + app.get('port'));
});
