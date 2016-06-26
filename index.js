var express = require('express');
var app = express();
var http = require('http').Server(app);

app.set('port', (process.env.PORT || 8080));

app.post('/save', function(req, res) {
  res.send('hello world');
});

app.use(express.static('.'));

http.listen(app.get('port'), function(){
  console.log('listening on port ' + app.get('port'));
});
