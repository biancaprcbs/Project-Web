// controlando o acesso dos usuários

module.exports = {

    eAdmin: function(req, res, next) {
        if (req.isAuthenticated() && req.user.eAdmin === 1) {
            return next();
        }

        req.flash('error_msg', 'Para acessar, você precisa ser um Admin!')
        res.redirect('/')
    }
}