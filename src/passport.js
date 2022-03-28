const LocalStrategy = require('passport-local').Strategy;
const mydb = require('./dbModel')
const crypto = require('crypto');

module.exports = (passport) => {
    var strategy = new LocalStrategy({
        usernameField:'id',
        passwordField:'pw',
    },login);
    
    passport.use(strategy);
    passport.serializeUser(function(id, done){
        console.log(id,'log in session');
        done(null, id);
    });
    
    passport.deserializeUser(function(id,done) {
        console.log('read user info');
        done(null,id);
    });   
}

function login(id,pw, done){    
    mydb.users.findOne({
        where: {user_id : id},
        attributes: ['id','user_id','salt_key', 'password']
    })
    .then((results, rejected) => {
        if(rejected){
            console.log(`rejected ${rejected}`);
            return done(err);
        }
        if (!results){
            return done(null,false, { message : 'Incorrect id'});
        } 

        const valid = crypto
        .createHash('sha256')
        .update(pw+results.salt_key)
        .digest('hex')
        if(!(results.password === valid)){
            return done(null,false, { message : 'Incorrect pw'});
        }
        return done(null,results.id)
    });
}