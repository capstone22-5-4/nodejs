var Sequelize = require('sequelize');
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
                 allowNull : false},
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

var animals = sequelize.define('animals', {
    id : {          type : Sequelize.INTEGER,
                    primaryKey : true,
                    autoIncrement : true },
    animal_name : { type : Sequelize.STRING,
                    allowNull : false}
}, { createdAt : false, updatedAt : false });

var foods = sequelize.define('foods', {
    id : {          type : Sequelize.INTEGER,
                    primaryKey : true },
    food_name : {   type : Sequelize.STRING,
                    allowNull : false },
    image_url : {   type : Sequelize.STRING,
                    allowNull : false },
    food_cost : {   type : Sequelize.INTEGER,
                    allowNull : false }
}, { createdAt : false, updatedAt : false });

var has_foods = sequelize.define('user_foods', {
    id : {      type : Sequelize.INTEGER,
                primaryKey : true },
    foods : {   type : Sequelize.JSON, 
                defaultValue : {} }
}, { createdAt : false });

var achivements = sequelize.define('achivement', {
    id : {              type : Sequelize.INTEGER,
                        primaryKey : true,
                        autoIncrement : true },
    achivement_name : { type : Sequelize.STRING,
                        allowNull : false },
    score : {           type : Sequelize.INTEGER,
                        defaultValue : 0 }
}, { createdAt : false, updatedAt : false });

var user_achivement = sequelize.define('user_achive', {
    id : {  type : Sequelize.INTEGER,
            primaryKey : true },
    achives : { type : Sequelize.JSON,
                defaultValue : {} }
}, { updatedAt : false });

// var to_feed = sequelize.define('to_feed', {
//     id : { type : Sequelize.INTEGER, 
//             allowNull : false },
//     food_id : { type : Sequelize.INTEGER,
//             defaultValue : 0 }
// }, { createdAt : false, updatedAt : false });


user.sync({force:true}).then(() => {console.log('User table connected');});
image.sync({force:true}).then(() => {console.log('Image table connected');});
score.sync({force:true}).then(() => {console.log('user score table connected');});
animals.sync({force:true}).then(() => {console.log('base animal table connected');});
foods.sync({force:true}).then(() => {console.log('base food table connected');});
has_foods.sync({force:true}).then(() => {console.log('user foods table connected');});
achivements.sync({force:true}).then(() => {console.log('base achivemnets table connected');});
user_achivement.sync({force:true}).then(() => {console.log('base achivemnets table connected');});

user.create({
    email : 'first@abcd.efg',
    nickname : 'sample',
    name : 'caps',
    salt_key : 'sampleSalt',
    password : 'ac8d85f18cb8fd8e7f7b4dd0c23cf0a07675b3bf3e491bc62be070ee3699b50d',
});

image.create({
    id : 1,
    animals : { '앵무새' : '앵무새.jpg'},
});

module.exports ={
    users : user,
    images : image
};