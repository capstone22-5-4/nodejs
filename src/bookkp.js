const express = require('express');
const router = express.Router();

const fs = require('fs');
const userdb = require('./dbModel');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;

const multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, '/home/ubuntu/nodejs/user_images/');
        // callback(null, process.env.PWD+'/user_images/');
    },
    filename(req, file, callback){
        var user = req.user;
        var result = "undifined";
        if(user){
            result = user.toString() + '_' +Date.now().toString();
        }
        result += '.'+file.originalname.split(".").pop();
        callback(null,result);
    }
});

const upload = multer({
    storage, limits:{ files:10 }});

const animal_list = fs.readFileSync('./animals.txt', 'utf8').split('\n');

router.post('/upload/:animal',upload.single('image'), putImage);
router.get('/list/has', getHas);
router.get('/list/less', getLess);
router.get('/list/rand', getSomeBook);
router.get('/list/:nickname', getOtherBook);

router.use(express.static('/home/ubuntu/nodejs/user_images'));
// router.use(express.static(process.env.PWD + '/user_images'));

module.exports = router;



function putImage(req,res){
    const { filename } = req.file;
    var user = req.user;
    if(user){
        userdb.images.findOne({
            where: { id : user},
            attributes : ['animals'],
        }).then((results) => {
            var has_list = results.dataValues.animals;
            if (has_list[req.params.animal])
                fs.unlink('/home/ubuntu/nodejs/user_images/'+has_list[req.params.animal], function(err){
                    if(err)
                        console.log("Error : ", err);
                });
            has_list[req.params.animal] = filename;

            userdb.images.update( 
                { animals : has_list},
                { where: { id: user}}).then(() => {
                    userdb.score
                    .increment({score:10,credit:10}, {where:{id:user}})
                    .then((result) => {
                        res.status(200).send('update lists');
                    }).catch((err) => {
                        console.error(err);
                    });
                });
        });
    } else res.status(401).send('log in first');
}

function getHas(req,res){
    var user = req.user;
    if (user){
        userdb.images.findOne({
            where : {id: user},
            attributes : ['animals']
        }).then((results) => {
            if (results){
                var sendList = new Array();
                var index = 1;
                for (const key of Object.keys(results.animals)){
                    var data = new Object();
                    data.no = index++;
                    data.animalName = key;
                    data.photo = results.animals[key];
                    sendList.push(data);
                }
                                  res.status(200).send(JSON.stringify(sendList));
            }else               { res.status(202).send('no user');}
        });
    } else                      { res.status(401).send('login first');}
}

function getLess(req,res){
    var user = req.user;
    if (user){
        userdb.images.findOne({
            where : { id : user },
            attributes : ['animals']
        }).then((results) => {
            if (results){
                let less_animals = [];
                for (const i in animal_list)
                    less_animals.push(animal_list[i]);
                for (const key of Object.keys(results.animals)){
                    const idx = less_animals.indexOf(key);
                    if(idx != -1)
                        less_animals.splice(idx,1);
                }
                          res.status(200).send(less_animals);
            } else      { res.status(202).send('no user'); }
        });
    } else              { res.status(401).send('login first'); }
}

function getOtherBook(req,res){
    var user = req.user;
    if (user){
        userdb.users.findOne({
            where : {nickname : req.params.nickname },
            attributes : ['id']
        }).then((results) => {
            if (results){ 
                userdb.images.findOne({
                    where : { id : results.id },
                    attributes : ['animals']
                }).then((results2) => {
                    if (results2){
                        var sendList = new Array();
                        var index = 1;
                        for (const key of Object.keys(results2.animals)){
                            var data = new Object();
                            data.no = index++;
                            data.animalName = key;
                            data.photo = results2.animals[key];
                            sendList.push(data);
                        }
                        console.log(user, "visit", req.params.nickname, "force");
                                  res.status(200).send(JSON.stringify(sendList));
                    }else       { res.status(202).send('no user');}
                });
            } else              { res.status(202).send('check the nickname');}
        })
    } else                      { res.status(401).send('login first');}
}

async function getSomeBook(req,res){
    var user = req.user;
    if (user){
        const results = await userdb.images.findOne( 
            {order : Sequelize.literal('rand()'), 
            attributes : ['animals', 'id'],
            where : {
                [Op.not] : {id : user} 
        }});
        if(results){
            const somebody = await userdb.users.findOne(
                { where : { id : results.id},
                attributes : ['nickname']});
            var sendList = new Array();
            sendList.push(somebody.nickname);
            var index = 1;
            for (const key of Object.keys(results.animals)){
                var data = new Object();
                data.no = index++;
                data.animalName = key;
                data.photo = results.animals[key];
                sendList.push(data);
            }
            console.log(user, "visit", results.id, "rand");
                res.status(200).send(JSON.stringify(sendList));
        } else  res.status(401).send('no user without you');
    } else      res.status(401).send('login first');
}