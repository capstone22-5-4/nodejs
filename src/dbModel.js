var Sequelize = require('sequelize');
const fs = require('fs');
var sequelize = new Sequelize('capstone', 'caps', 'caps54',{
    dialect : 'mysql',
    host : 'localhost',
    prot : 3306,
    pool : {
        max : 10,
        min : 0,
        idle : 10000
    },
    logging : false
});

var user = sequelize.define('users', {
    id : {       type : Sequelize.INTEGER,
                 primaryKey : true,
                 autoIncrement : true },
    email : {    type : Sequelize.STRING,
                 allowNull : false },
    nickname : { type : Sequelize.STRING,
                 allowNull : false },
    name : {     type : Sequelize.STRING,
                 allowNull : false },
    salt_key : { type : Sequelize.STRING(16),
                 allowNull : false },
    password : { type : Sequelize.STRING(64),
                 allowNull : false },
},{ updatedAt : false });

var image = sequelize.define('images', {
    id : {      type : Sequelize.INTEGER,
                primaryKey : true},
    animals : { type : Sequelize.JSON,
                allowNull: true },
},{ createdAt : false });

var score = sequelize.define('score', {
    id : {      type : Sequelize.INTEGER,
                primaryKey : true },
    score : {   type : Sequelize.INTEGER,
                defaultValue : 0 },
    credit : {  type : Sequelize.INTEGER,
                defaultValue : 0 }
},{ createdAt : false, updatedAt : false });

var has_foods = sequelize.define('user_foods', {
    id : {      type : Sequelize.INTEGER,
                primaryKey : true },
    foods : {   type : Sequelize.JSON, 
                defaultValue : 
                {"사과":0, "과일":0, "물고기":0, 
                "사료":0, "소고기":1, "지렁이":0, "풀":0 } }
}, { createdAt : false });

var user_achivement = sequelize.define('user_achive', {
    id : {    type : Sequelize.INTEGER,
              primaryKey : true },
    count : { type : Sequelize.INTEGER,
              defaultValue : 0 }
}, { updatedAt : false });

var gpsData = sequelize.define('gps', {
    id : { type : Sequelize.INTEGER,
            allowNull : false,
            autoIncrement : true,
            primaryKey : true },
    animal_name : { type : Sequelize.STRING,
                    allowNull : false },
    latitude : { type : Sequelize.DOUBLE,
                    allowNull : false },
    longitude : { type : Sequelize.DOUBLE, 
                    allowNull : false } 
}, { updatedAt : false});


user.sync({force:true}).then(() => {console.log('User table connected');
    user.create({
        email : 'first@abcd.efg',
        nickname : 'sample',
        name : 'caps',
        salt_key : 'sampleSalt',
        password : 'ac8d85f18cb8fd8e7f7b4dd0c23cf0a07675b3bf3e491bc62be070ee3699b50d',
    });});
image.sync({force:true}).then(() => {console.log('Image table connected');
    image.create({
        id : 1,
        animals : { '거북' : '1_dummy.jpg'},
    });});
score.sync({force:true}).then(() => {console.log('user score table connected');
    score.create({
        id : 1,
        credit : 10,
        score : 10
    });});
has_foods.sync({force:true}).then(() => {console.log('user foods table connected');
    has_foods.create({
        id : 1
    });});
gpsData.sync({force:true}).then(() => console.log('gps table connected'));
user_achivement.sync({force:true}).then(() => {console.log('base achivemnets table connected');});


module.exports ={
    users : user,
    images : image,
    score : score,
    has_foods : has_foods,
    gps : gpsData,
    user_achivement : user_achivement
};