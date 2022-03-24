var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded{extended : false});

router.get('/user/list', (req,res) => {
    res.status(205).send('list is not manufactured');
});

router.post('/user/signup', (req,res) => {
    res.status(205).send('sign up is not manufactured');
});

router.get('/user/sign in', (req,res) => {
    res.status(205).send('sign in not manufactured');
});

router.delete('/user/:user_id', (req, res) => {
    res.status(205).send('query is not manufactured');
});

module.exports = router;
