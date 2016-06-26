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
