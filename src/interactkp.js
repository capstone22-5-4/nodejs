const express = require('express');
const router = express.Router();
const mydb = require('./dbModel');
const passport = require('passport');

const fs = require('fs');

router.use(express.static(process.env.PWD+'/base'));

router.post('/addscore', addscore);
router.post('/addfood', addfood);
router.get('/analmal',(req,res) =>{
    res.sendFile(process.env.PWD+'/base/index.html');
});

module.exports = router;

function addscore(req,res){
}

function addfood(req,res){    
}

