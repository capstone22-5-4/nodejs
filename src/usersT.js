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

user.sync({force:true}).then(() => {
    console.log('User Table connected');
    return user.create({
        user_id : 'first',
        salt_key : 'sampleSalt',
        password : 'samplePassword',
        phone : '01012345678'
    });
});

module.exports = user;