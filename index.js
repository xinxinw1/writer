var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(bodyParser.json());

var filesDir = "files";

app.post('/save', function(req, res) {
  console.log('Save request received.');
  var data = JSON.parse(req.body.data);
  console.log(data);
  
  var filePath = filesDir + '/' + data.filename;

  saveFile(filePath, JSON.stringify(data), function (){
    console.log("File was saved to" + filePath);
    res.send('File saved successfully.');
  }, function (err){
    console.log(err);
    res.send('Something went wrong, the file was not saved! ' + err.toString());
  });
});

function saveFile(file, data, cb, ef) {
  fs.writeFile(file, data, function(err) {
    if (err) {
      ef(err);
    } else {
      cb();
    }
  });
}

app.post('/delete', function(req, res) {
  console.log('Delete request received.');
  var filename = req.body.filename;
  console.log(filename);
  
  var filePath = filesDir + '/' + filename;

  deleteFile(filePath, function (){
    console.log("File " + filePath + " was deleted");
    res.redirect('/');
  }, function (err){
    console.log(err);
    res.send('Something went wrong, the file was not deleted! ' + err.toString());
  });
});
  
function deleteFile(file, cb, ef) {
  fs.unlink(file, function(err) {
    if (err) {
      ef(err);
    } else {
      cb();
    }
  });
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

http.listen(port, ip);
