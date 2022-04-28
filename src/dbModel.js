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

var to_feed = sequelize.define('to_feed', {
    id : { type : Sequelize.INTEGER, 
            allowNull : false,
            primaryKey : true },
    food_id : { type : Sequelize.INTEGER,
            defaultValue : 0,
            primaryKey : true }
}, { createdAt : false, updatedAt : false });


user.sync({force:true}).then(() => {
    console.log('User table connected');
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
        animals : { '앵무새' : 'undifined.jpg'},
    });
});
score.sync({force:true}).then(() => {console.log('user score table connected');
    score.create({
        id : 1
    });
});
animals.sync({force:true}).then(() => {console.log('base animal table connected');
    const animal_list = fs.readFileSync('./animals.txt', 'utf8').split('\n');
    for (const key of animal_list){
        animals.create({ animal_name : key }); 
    }
});
foods.sync({force:true}).then(() => {console.log('base food table connected');
    foods.create({
        food_name : 'dummy_food',
        image_url : 'dummy_food.png',
        food_cost : 100
    });
});
has_foods.sync({force:true}).then(() => {console.log('user foods table connected');
    has_foods.create({
        id : 1,
        foods : {}
    });
});
to_feed.sync({force:true}).then(() => {console.log('base achivemnets table connected');});
achivements.sync({force:true}).then(() => {console.log('base achivemnets table connected');});
user_achivement.sync({force:true}).then(() => {console.log('base achivemnets table connected');});


module.exports ={
    users : user,
    images : image,
    score : score,
    animals : animals,
    foods : foods,
    has_foods : has_foods,
    to_feed : to_feed,
    achivements : achivements,
    user_achivement : user_achivement
};