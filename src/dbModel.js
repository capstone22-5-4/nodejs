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
    id : { type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true },
    user_id : { type : Sequelize.STRING,
                allowNull : false },
    salt_key : { type : Sequelize.STRING(16),
                    allowNull : false },
    password : { type : Sequelize.STRING(64),
                    allowNull : false },
    phone : { type : Sequelize.STRING(11),
                allowNull : false },
});

var image = sequelize.define('images', {
    id : { type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true },
    user_id : { type : Sequelize.INTEGER,
                allowNull : false },
    animal_id : { type : Sequelize.INTEGER,
                    allowNull: false },
    image_url : { type : Sequelize.STRING(16),
                    allowNull : false }
});

user.sync({force:true}).then(() => {
    console.log('User Table connected');
    user.create({
        user_id : 'first',
        salt_key : 'sampleSalt',
        password : 'ac8d85f18cb8fd8e7f7b4dd0c23cf0a07675b3bf3e491bc62be070ee3699b50d',
        phone : '01012345678'
    });
});

image.sync({force:true}).then(() => {
    console.log('Image Table connected');
});

module.exports ={
    users : user,
    images : image
};