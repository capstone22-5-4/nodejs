const express = require('express');
const router = express.Router();
const mydb = require('./dbModel');
const Sequelize = require('sequelize');

const fs = require('fs');


router.get('/top:lim', rank10);
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

async function rank10(req,res){
    var limit = parseInt(req.params.lim)
    if(limit < 20){
    const results = await mydb.score.findAll({
        attributes : ['id', 'score',
        [Sequelize.literal('(RANK() OVER (ORDER BY score DESC))'), 'rank']],
        limit : parseInt(req.params.lim)});

    var resList = new Array();
    var index = 1;
    console.log(results)
    for (const element of results){
        var oneData = new Object();
        const results2 = await mydb.users.findOne({
            where : {id : element.id},
            attributes : ['nickname']
        });
        oneData.no = index++;
        oneData.score = element.score;
        oneData.nickname = results2.nickname;
        resList.push(oneData);
    }
            res.status(200).send(resList);
    } else            res.status(401).send("Wrong Url");
};

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