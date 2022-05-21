const express = require('express');
const router = express.Router();
const mydb = require('./dbModel');
const Sequelize = require('sequelize');

const fs = require('fs');


router.get('/top:lim', rank10);
router.post('/buyfood', buyfood);
router.get('/use:food_name', usefood);
router.get('/foodlist', foodlist);

router.get('/credit', getCredit);
router.get('/score', getScore);
router.get('/addscore:pscore', putScore);
router.get('/addcoin:pcoin', putCoin);

router.get('/putachieve', plusAchieve);
router.get('/getachieve', getAchieve);

router.get('/analmal',(req,res) =>{
    res.sendFile('/home/ubuntu/nodejs/base/index.html');
    // res.sendFile('/base/index.html', { root : process.env.PWD });
});

router.get('/gpsData', getGpsData);
router.post('/gps/:animal', putGPS);

router.use(express.static('/home/ubuntu/nodejs/base'));
// router.use(express.static(process.env.PWD+'/base'));

module.exports = router;


function getAchieve(req,res){
    const user = req.user;
    if (user){
        mydb.user_achivement.findOne({
            where : { id : user},
            attributes : ['count']
        }).then((results) => {
            res.status(200).send(results.count.toString());
        });
    } else  res.status(401).send('login first');
}

function plusAchieve(req,res){
    const user = req.user;
    if (user){
        mydb.user_achivement.increment(
            { count : 1 },
            { where : { id : user }}
        ).then((results) => {
            res.status(200).send("achieve one");
        });
    } else          res.status(401).send('login first');
}

function putGPS(req, res){
    const { latitude, longitude } = req.body;
    mydb.gps.create({
        animal_name : req.params.animal,
        latitude : latitude,
        longitude : longitude
    });
}

function usefood(req,res){
    const user = req.user;
    const food_name = req.params.food_name;
    if (user){
        mydb.has_foods.findOne({
            where : {id:user},
            attributes : ['foods']
        }).then((results) => {
            if (results){
                results.foods[food_name] -=1;
                mydb.has_foods.update(
                    { foods : results.foods },
                    { where : { id:user}});
                    res.status(200).send('use '+food_name);
            } else  res.status(202).send('no user');
        });
    } else          res.status(401).send('login first');
}

function putScore(req,res){
    const user = req.user;
    const pscore = req.params.pscore;
    if (user) {
        mydb.score.increment(
            { score : pscore },
            { where : {id:user}})
            .then((results) => {
                res.status(200).send('add '+pscore+' score');
            });
    } else      res.status(401).send('login first');
}

function putCoin(req,res){
    const user = req.user;
    const pcoin = req.params.pcoin;
    if (user) {
        mydb.score.increment(
            { credit : pcoin },
            { where : {id:user}})
            .then((results) => {
                res.status(200).send('add '+pcoin+' credit');
            });
    } else      res.status(401).send('login first');
}

function buyfood(req,res){
    const user = req.user;
    const { food_name, cost } = req.body;
    if(user){
        mydb.has_foods.findOne({
            where : {id:user},
            attributes : ['foods']
        }).then((results) => {
            if (results){
                console.log(results.foods.hasOwnProperty(food_name))
                results.foods.hasOwnProperty(food_name) ?
                    results.foods[food_name] += 1 :
                    results.foods[food_name] = 1;
                mydb.has_foods.update(
                    { foods : results.foods },
                    { where : { id:user}}).then(() => {
                        mydb.score
                        .increment({credit:-cost}, {where:{id:user}})
                        .then(() => {
                            res.status(200).send('buy '+food_name);    
                        });
                    });
                console.log(user, "buy ", food_name);
            } else          res.status(202).send('no user');
        })
    } else                  res.status(401).send('login first');
}

function foodlist(req,res){
    var user = req.user;
    if (user){
        mydb.has_foods.findOne({
            where : {id: user},
            attributes : ['foods']
        }).then((results) => {
            if (results){
                    res.status(200).send(results.foods);
            }else   res.status(202).send('no user');
        })
    } else          res.status(401).send('login first');
}

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
    } else  res.status(401).send("Wrong Url");
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
                      res.status(200).send(String(results.score));
            }else   { res.status(202).send('no user');}
        });
    } else          { res.status(401).send('login first');}
}

function getGpsData(req,res){
    mydb.gps.findAll({
        attributes : [ 'animal_name', 'latitude', 'longitude']
    }).then((results) => {
        res.status(200).send(results);
    });
}