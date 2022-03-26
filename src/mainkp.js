var express = require('express');
var app = express();
const PORT = 8880;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
var session = require('express-session');
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:'secret key'
}));

app.use(require('./routkp'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});