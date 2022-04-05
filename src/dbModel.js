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
    email : { type : Sequelize.STRING,
                allowNull : false},
    nickname : { type : Sequelize.STRING,
                allowNull : false },
    name : { type : Sequelize.STRING,
                allowNull : false },
    salt_key : { type : Sequelize.STRING(16),
                    allowNull : false },
    password : { type : Sequelize.STRING(64),
                    allowNull : false },
},{
    updatedAt : false,
});

var image = sequelize.define('images', {
    id : { type : Sequelize.INTEGER,
            primaryKey : true},
    animals : { type : Sequelize.JSON,
                    allowNull: true },
},{
    createdAt : false
});

image.belongsTo(user, { as : 'user', foreignKey: 'id', targetKey : 'id'});

user.sync().then(() => {
    console.log('User Table connected');
    user.create({
        email : 'first@abcd.efg',
        nickname : 'sample',
        name : 'caps',
        salt_key : 'sampleSalt',
        password : 'ac8d85f18cb8fd8e7f7b4dd0c23cf0a07675b3bf3e491bc62be070ee3699b50d',
    });
});

image.sync().then(() => {
    console.log('Image Table connected');
    image.create({
        id : 1,
        animals : { '앵무새' : '앵무새.jpg'},
    })
});

module.exports ={
    users : user,
    images : image
};