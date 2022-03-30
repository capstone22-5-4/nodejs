const express = require('express');
const router = express.Router();

const fs = require('fs');
const mydb = require('./dbModel');
const passport = require('passport');

const multer = require('multer');
const upload = multer({
    dest: __dirname+'/images/'
});

const animal_list = fs.readFileSync('./animals.txt', 'utf8').split('\n');

router.post('/:animal',upload.single('image'), putImage);
router.get('/books', getBooks);

router.get('/bento', function(req, res){
    res.send('hello bento! <img src="/image/앵무새.jpg">')
});

router.use(express.static(__dirname+ '/images'));

module.exports = router;

function getBooks(req,res){
    var user = req.user;
    if (user)
        mydb.images.findOne({
            where : { user_id : user },
            attributes : ['animals']
        }).then((results, rejected) => {
            if (results){
                res.status(200).send(results.animals);
            }
            else res.status(202).send('no image');
        });
    else res.status(202).send('login first');
}

function putImage(req,res){
    const { filename } = req.file;
    const { name } = req.body;
    var user = req.user;
    if(user){
        mydb.images.findOrCreate({
            where: { user_id:user, animal_id:req.params.animal },
            defaults:{
                filename: filename
            }
        }).then((results) => {
            if(!results[1])
                res.status(202).send(`${req.params.animal} is already exists`);
            else
                res.status(200).send(`created`);
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