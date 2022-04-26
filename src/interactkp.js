const express = require('express');
const router = express.Router();
const mydb = require('./dbModel');
const passport = require('passport');

const fs = require('fs');


router.get('/rank', ranklist);
router.post('/addscore', addscore);
router.post('/buyfood', buyfood);
router.get('/shop', foodlist);
router.get('/analmal',(req,res) =>{
    res.sendFile('/base/index.html', { root : process.env.PWD });
});

router.use(express.static(process.env.PWD+'/base'));

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

function foodlist(req,res){

}



function addscore(req,res){

}

function buyfood(req,res){

}