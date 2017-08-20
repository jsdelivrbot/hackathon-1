var express = require('express')
var app = express()
var parser = require('./parser')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/', function(request, response) {
	response.send(request.body)
	if (request.body.hasOwnProperty("load")) {
		response.send(parser.parseProtocol(request.body.load))
	}
	else if (true) {
		response.send('Hello World!')
	}
})
app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

parser.parseProtocol("protocol1")