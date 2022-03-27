var express = require('express');
var router = express.Router();
const userT = require('./usersT');

var crypto = require('crypto');

var passport = require('passport');
router.use(passport.initialize());
router.use(passport.session());

var LocalStrategy = require('passport-local').Strategy;
var strategy = new LocalStrategy({
    usernameField:'id',
    passwordField:'pw',
},login);

passport.use(strategy);
passport.serializeUser(function(id, done){
    console.log(id,'log in session');
    done(null, id);
});

passport.deserializeUser(function(id,done) {
    console.log('read user info');
    done(null,id);
});

router.post('/user/signup', signup);
router.delete('/user/signout', signout);
router.post('/user/login',passport.authenticate('local'), 
    (req,res) => { res.send('login success') });
router.get('/user/logout', (req, res) => {
    req.logOut();
    req.session.save(err =>{
        if(err) throw err;
        res.status(200).send('logout');
    });
});

router.get('/user/list', getlist);
router.get('/user/book/:user_id',getbook);

module.exports = router;

function login(id,pw, done){    
    userT.findOne({
        where: {user_id : id},
        attributes: ['id','user_id','salt_key', 'password']
    })
    .then((results, rejected) => {
        if(rejected){
            console.log(`rejected ${rejected}`);
            return done(err);
        }
        if (!results){
            return done(null,false, { message : 'Incorrect id'});
        } 
        const valid = crypto
        .createHash('sha256')
        .update(pw+results.salt_key)
        .digest('hex')
        if(!(results.password === valid)){
            return done(null,false, { message : 'Incorrect pw'});
        }
        return done(null,results.id)
    });
}

function signup(req,res){
    // const id = req.body.id.replace(/ /g,"");
    // const password = req.body.password.replace(/ /g,"");
    // const phone = req.body.phone;
    const {id, pw, phone} = req.body;
    if(id && pw && phone){
        // const salt = crypto.randomBytes(10).toString('base64');
        const salt = 'sampleSalt'
        const hash_pw = crypto
        .createHash('sha256')
        .update(pw + salt)
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
    } else {
        res.status(404).send('Please fill it up');
    }
}

function signout(req,res){
    var user = req.user;
    if(user){
        userT.destroy({where:{id:user}});
        req.logOut();
        req.session.save(err =>{
            if(err) throw err;
            res.status(200).send('sign out');
        });
    } else {
        res.status(401).send('log in first');
    }
}

function getbook(req,res){
    var user = req.user;
    console.log('user',user);
    console.log(req.params.user_id)
    if (user && (user == req.params.user_id)){
        userT.findOne({
            where: {id : user},
            attributes: ['user_id', 'phone']
        })
        .then((results, rejected) => {
            if(results)
                res.status(200).send(results.dataValues);
            else
                res.status(201).send(results);
        });
    } else {
        res.status(401).send('log in first');
    }
}

function getlist(req, res){
    userT.findAll({
            attributes : ['user_id','phone']
        }).then(
        (results) => {
            console.log('list request');
            res.status(200).send(results);}, 
        (rejected) =>{
            console.log('selection fail'+rejected);
            res.status(400).send('list not found');
    });
}