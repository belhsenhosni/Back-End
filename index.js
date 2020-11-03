const express = require('express');
//const https = require('https');
const http = require('http');
const fs = require('fs');
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
// set up port
app.use(bodyParser.json());
// add routes

var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

const router = require('./routes/router.js');
app.use('/api', router);
// run server
var server = http.createServer(options, app);

server.listen(port, () => {
  console.log("server starting on port : " + port)
});

