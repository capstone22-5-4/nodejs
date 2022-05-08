const express = require('express');
const router = express.Router();
const mydb = require('./dbModel');
const passport = require('passport');

const fs = require('fs');


router.get('/rank', ranklist);
router.post('/buyfood', buyfood);
router.get('/shop', foodlist);
router.get('/credit', getCredit);
router.get('/score', getScore);
router.get('/analmal',(req,res) =>{
    res.sendFile('/home/ubuntu/nodejs/base/index.html');
    // res.sendFile('/base/index.html', { root : process.env.PWD });
});

router.use(express.static('/home/ubuntu/nodejs/base'));
// router.use(express.static(process.env.PWD+'/base'));

module.exports = router;

async function ranklist(req,res){
    var user = req.user;
    var ranking
    if (user){
        ranking['I'] = await mydb.score.findOne({
            where : {id : user},
            attributes : ['score']
        })
    } else { ranking['I'] = null}
    mydb.score.findAll({
        
    });
}
function getCredit(req, res){
    var user = req.user;
    if (user){
        mydb.score.findOne({
            where : {id: user},
            attributes : ['credit']
        }).then((results) => {
            if (results){
                      res.status(200).send(String(results.credit));
            }else   { res.status(202).send('no user');}
        });
    } else          { res.status(401).send('login first');}
}

function getScore(req, res){
    var user = req.user;
    if (user){
        mydb.score.findOne({
            where : {id: user},
            attributes : ['score']
        }).then((results) => {
            if (results){
                      res.status(200).send(String(results.credit));
            }else   { res.status(202).send('no user');}
        });
    } else          { res.status(401).send('login first');}
}

function foodlist(req,res){

}

function buyfood(req,res){

}