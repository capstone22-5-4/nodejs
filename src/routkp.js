const router = require('express').Router();
const mydb = require('./dbModel');
const passport = require('passport');

const crypto = require('crypto');

router.post('/signup', signup);
router.delete('/signout', signout);
router.post('/login',passport.authenticate('local'), 
    (req,res) => { res.send('login success') });
router.get('/logout', (req, res) => {
    req.logOut();
    req.session.save(err =>{
        if(err) throw err;
        res.status(200).send('logout');
    });
});

router.get('/list', getlist);
router.get('/book/:user_id',getbook);

module.exports = router;


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

        mydb.users.findOrCreate({
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
        mydb.users.destroy({where:{id:user}});
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
        mydb.users.findOne({
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
    mydb.users.findAll({
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