// autenticação de usuários

const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")

require("../models/User")
const User = mongoose.model('user')

module.exports = function(passport) {

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {

        User.findOne({email: email}).then((user) => {
            if (!user) {
                return done(null, false, {message: 'Este cadastro não existe!'})
            }
            else if (user.senha !== senha) {
                return done(null, false, {message: 'Senha incorreta!'})
            }
            else {
                return done(null, user)
            }
        })
    }));

// salva os dados do usuário em uma sessão

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    });
}