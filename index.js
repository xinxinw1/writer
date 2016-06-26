var express = require('express');
var app = express();
var http = require('http').Server(app);

app.set('port', (process.env.PORT || 8080));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(bodyParser.json());

var filesDir = "files";

app.post('/save', function(req, res) {
  var message = 'Save request received.';
  var data = JSON.parse(req.body.data);
  console.log(message);
  console.log(data);

  var saved = saveFile(data.filename, JSON.stringify(data));
  if (saved) {
    message = 'File saved successfully.';
    res.send(message);
  }
  else {
    message = 'Something went wrong, the file was not saved!';
    res.send(message);
  }
});

function saveFile(filename, data) {
  var fs = require('fs');
  var filePath = filesDir + '/' + filename;

  fs.writeFile(filePath, data, function(err) {
    if(err) {
      console.log(err);
      return false;
    }

    console.log("File was saved to" + filePath);
  });

  return true;
}

var mu = require('mu2');

mu.root = __dirname;

app.get(['/', '/index.html'], function (req, res){
  function render(data){
    renderFile(res, 'index.html', data);
  }
  ensureDir(filesDir, function (){
    getFiles(filesDir, function (files){
      console.log(files);
      render({
        files: files.map(function (file){
          return {
            file: file,
            encodedFile: encodeURIComponent(file)
          };
        })
      });
    }, function (err){
      console.log(err);
      render({
        files: [],
        err: err.toString()
      });
    });
  }, function (err){
    console.log(err);
    render({
      files: [],
      err: err.toString()
    });
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
  function render(data){
    renderFile(res, 'file.html', data);
  }
  var file = req.query.file;
  if (file === undefined){
    render({data: "null"});
  } else {
    var serverPath = path.normalize(filesDir + "/" + file);
    console.log(serverPath);
    readFileJSON(serverPath, function (json){
      console.log("Read file " + serverPath);
      render({data: JSON.stringify(json)});
    }, function (err){
      console.log(err);
      render({data: JSON.stringify({err: err.toString()})});
    });
  }
});

function renderFile(res, file, data){
  console.log(data);
  var stream = mu.compileAndRender(file, data);
  stream.pipe(res);
}

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
      ef(e);
      return;
    }
    cb(json);
  }, ef);
}

function ensureDir(path, cb, ef) {
    fs.mkdir(path, 0777, function(err){
        if (err) {
            if (err.code == 'EEXIST') cb(); // ignore the error if the folder already exists
            else ef(err); // something else went wrong
        } else cb(); // successfully created folder
    });
}

app.use(express.static('.'));

http.listen(app.get('port'), function(){
  console.log('listening on port ' + app.get('port'));
});
