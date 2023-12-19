const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const trimRequest = require('trim-request');
const DBconfig = require('./DB_config/db');
const fs = require('fs');
var https = require('https');


if (process.env.NODE_ENV == 'local' || typeof process.env.NODE_ENV == 'undefined') {

    var config = require('./config/local.js');
    var http = require('http');
    var server = http.createServer(app);
    var port = config.port;

} else {
    var config = require('./config/prod.js');
    var options = {
        key: fs.readFileSync(''),
        cert: fs.readFileSync(''),
    };
    var server = https.createServer(options, app);
    var port = config.port;

}

app.use(express.json({
    limit: '50mb'
}));

app.use(cors());
// app.use(logger('dev'));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.clearCookie("__cfduid");
    return next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(trimRequest.all);

/*USER ROUTES*/

app.use('/user', require('./routes/user/user'));
app.use('/admin', require('./routes/admin/admin'));

/*COMMON ROUTES*/



server.listen(port, () => console.log(`Express server running on port ` + port));

console.log("-------> ver 1.4 feb 3 2023 16:46 111")