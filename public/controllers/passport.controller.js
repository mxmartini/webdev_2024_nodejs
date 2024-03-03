const LocalStrategy = require('passport-local').Strategy;
const usersController = require('./users.controller');

const passportController = {

    config(passport){

        passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => { 
            
            usersController.findByEmailAndPassword(email, password)
            .then(user => done(null, user))
            .catch(e => done(null, false, { message : e.message }))
            
        }));

        passport.serializeUser((user, done) => done(null, user.id));
        passport.deserializeUser((id, done) => done(null, usersController.findOne(id) ));
    },
}

module.exports = passportController;