var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : false}));

const userT = require('./usersT');

router.get('/user/list', function(req, res){
    userT.findAll({
            attributes : ['user_id','phone']
        }).then(function(results){
        console.log('list request');
        res.status(200).send(results);
    }, function(rejected){
        console.log('selection fail'+rejected);
        res.status(400).send('list not found');
    });
});

router.post('/user/signup', function(req,res){
    // const id = req.body.id.replace(/ /g,"");
    // const password = req.body.password.replace(/ /g,"");
    // const phone = req.body.phone;
    const {id, password, phone} = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hash_pw = crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex');

    userT.findOrCreate({
        where: {user_id : id},
        defaults:{
            salt_key: salt,
            password :hash_pw,
            phone:phone
        }
    }).then((results) =>{
        if(!results[1])
            res.status(202).send(`${id} is already exists`);
        else {
            res.status(200).send(`${id} has been created.`);
            console.log(`ip : ${req.ip}\ncreate ${id}`);
        }
    });

});

router.get('/user/signin', (req, res) => {

});

router.delete('/user/:id', (req, res) => {
    res.status(205).send('not manufactured');
});

router.get('/user/:user_id',(req,res) => {
    userT.findOne({
        where: {user_id : req.params.user_id},
        attributes: ['user_id', 'phone']
    })
    .then((results, rejected) => {
        res.status(200).send(results.dataValues);
    });
});

module.exports = router;
