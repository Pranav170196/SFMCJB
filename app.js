var express = require('express');
var path = require('path');
var bodyParser  = require('body-parser');
var http = require('http');

var app = express();

app.set('port', process.env.port || 4200);
app.use(bodyParser.json({type: 'application/json'}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

http.createServer(app).listen(app.get('port'), (error)=>{
    if (!error) {
        console.log(`Server is up and running on port : ${app.get('port')}`);
    } else {
        console.log(`Showing error : ${error}`);
    }
})
