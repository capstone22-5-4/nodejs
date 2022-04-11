const express = require('express');
const router = express.Router();

const fs = require('fs');
const userdb = require('./dbModel');
const passport = require('passport');

const multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, process.env.PWD+'/images/');
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
router.get('/list', getMyBook);
router.get('/list/:nickname', getOtherBook);

router.use(express.static(__dirname + '/images'));

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
            has_list[req.params.animal] = filename;

            userdb.images.update( 
                { animals : has_list},
                { where: { id: user}}).then(results => {
                    res.status(200).send('update lists');
                })
        });
    } else res.status(401).send('log in first');
}

function getMyBook(req,res){
    var user = req.user;
    if (user){
        userdb.images.findOne({
            where : { id : user },
            attributes : ['animals']
        }).then((results) => {
            if (results){
                var less_animals = animal_list;
                for (const key of Object.keys(results.animals)){
                    const idx = less_animals.indexOf(key);
                    less_animals.splice(idx,1);
                }
                          res.status(200).send({has : results.animals, less : less_animals});
            } else      { res.status(202).send('no user')}
        });
    } else              { res.status(401).send('login first');}
}

function getOtherBook(req,res){
    var user = req.user;
    if (user){
        userdb.user.findOne({
            where : {nickname : req.params.nickname },
            attributes : ['id']
        }).then((results) => {
            if (results){ 
                userdb.images.findOne({
                    where : { id : results.id },
                    attributes : ['animals']
                }).then((results) => {
                    if (results){
                        var less_animals = animal_list;
                        for (const key of Object.keys(results.animals)){
                            const idx = less_animals.indexOf(key);
                            less_animals.splice(idx,1);
                        }
                                  res.status(200).send({has : results.animals, less : less_animals});
                    } else      { res.status(202).send('no user')}
                });
            } else              { res.status(202).send('check the nickname');}
        })
    } else                      { res.status(401).send('login first');}
}
