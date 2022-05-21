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

var animals = sequelize.define('animals', {
    id : {          type : Sequelize.INTEGER,
                    primaryKey : true,
                    autoIncrement : true },
    animal_name : { type : Sequelize.STRING,
                    allowNull : false}
}, { createdAt : false, updatedAt : false });

var foods = sequelize.define('foods', {
    id : {          type : Sequelize.INTEGER,
                    primaryKey : true,
                    autoIncrement : true },
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
                defaultValue : 
                {"사과":0, "대나무":0, "물고기":0, 
                "사료":0, "소고기":0, "지렁이":0, "풀":0 } }
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


user.sync().then(() => {console.log('User table connected');});
image.sync().then(() => {console.log('Image table connected');});
score.sync().then(() => {console.log('user score table connected');});
animals.sync().then(() => {console.log('base animal table connected');});
foods.sync().then(() => {console.log('base food table connected');});
has_foods.sync().then(() => {console.log('user foods table connected');});
gpsData.sync().then(() => console.log('gps table connected'));
user_achivement.sync({force:true}).then(() => {console.log('base achivemnets table connected');});


module.exports ={
    users : user,
    images : image,
    score : score,
    animals : animals,
    foods : foods,
    has_foods : has_foods,
    gps : gpsData,
    user_achivement : user_achivement
};