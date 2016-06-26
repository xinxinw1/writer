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

app.use(express.static('.'));

http.listen(app.get('port'), function(){
  console.log('listening on port ' + app.get('port'));
});
