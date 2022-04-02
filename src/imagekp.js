const express = require('express');
const router = express.Router();

const fs = require('fs');
const mydb = require('./dbModel');
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
    storage,
    limits:{
        files:10,
    }
});

const animal_list = fs.readFileSync('./animals.txt', 'utf8').split('\n');

router.post('/:animal',upload.single('image'), putImage);
router.get('/books', getBooks);


router.use(express.static(__dirname + '/images'));

module.exports = router;

function putImage(req,res){
    const { filename } = req.file;
    var user = req.user;

    if(user){
        mydb.images.findOne({
            where: { id : user},
            attributes : ['animals'],
        }).then((results) => {
            var has_list = results.dataValues.animals;
            has_list[req.params.animal] = filename;

            mydb.images.update( 
                { animals : has_list},
                { where: { id: user}}).then(results => {
                    res.status(200).send('update lists');
                })
        });
    } else{
        res.status(401).send('log in first');
    }

    // console.log("body 데이터 : ", name);
    // console.log("폼에 정의된 필드명 : ", fieldname);
    // console.log("사용자가 업로드한 파일 명 : ", originalname);
    // console.log("파일의 엔코딩 타입 : ", encoding);
    // console.log("파일의 Mime 타입 : ", mimetype);
    // console.log("파일이 저장된 폴더 : ", destination);
    // console.log("destinatin에 저장된 파일 명 : ", filename);
    // console.log("업로드된 파일의 전체 경로 ", path);
    // console.log("파일의 바이트(byte 사이즈)", size);
}

function getBooks(req,res){
    var user = req.user;
    if (user)
        mydb.images.findOne({
            where : { id : user },
            attributes : ['animals']
        }).then((results, rejected) => {
            if (results){
                var less_animals = animal_list;
                for (const key of Object.keys(results.animals)){
                    const idx = less_animals.indexOf(key);
                    less_animals.splice(idx,1);
                }
                res_content = new Object ({has : results.animals, less : less_animals})
                res.status(200).send(res_content);
            }
            else res.status(202).send('no user');
        });
    else res.status(202).send('login first');
}