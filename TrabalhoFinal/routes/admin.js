const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('user')
const { eAdmin } = require('../helpers/eAdmin')
const passport = require('passport')

router.get('/', (req, res) => {
    res.render("admin/index", {
        flag: true,
        title: 'Login Adiministação',
        style: 'styleAdmin.css'
    })
});

router.get('/home', eAdmin, (req, res) => {
    res.render("admin/home",{
        flag: true,
        title: 'Home',
        style: 'index.css'
    })
});

router.get('/editar/:id', eAdmin, (req, res) => {
    User.findOne({ _id: req.params.id }).then((user) => {
        res.render("admin/editar", { user: user })
    }).catch((err) => {
        req.flash('error_msg', 'Este cadastro não existe')
        res.redirect("admin/listar")
    })
});

router.post('/editar', eAdmin, (req, res) => {
    User.findOne({ _id: req.body.id }).then((user) => {
        user.tipoVacina = req.body.tipoVacina
        if ((req.body.tipoVacina === "Não aplicada" && req.body.dose1 != "Não aplicada") || (req.body.dose1 === "Não aplicada" && req.body.dose2 != "Não aplicada")) {
            req.flash('error_msg', 'Houve um erro ao atualizar')
            res.redirect("../admin/listar")
        } else {
            if (req.body.dose1 === "Não aplicada") {
                user.dose1 = "Não aplicada"
                user.dataDose1 = "Não aplicada"
                user.dose2 = "Não aplicada"
                user.dataDose2 = "Não aplicada"
            } else {
                user.dose1 = req.body.dose1
                user.dataDose1 = new Date().toLocaleString()
                if (req.body.dose2 === "Não aplicada")
                    user.dataDose2 = "Não aplicada"
                else {
                    user.dose2 = req.body.dose2
                    user.dataDose2 = new Date().toLocaleString()
                }
            }
            user.save().then(() => {
                req.flash('success_msg', 'Usuário atualizado com sucesso!')
                res.redirect("../admin/listar")
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao atualizar')
                res.redirect("../admin/listar")
            })
        }
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar')
        res.redirect("../admin/listar")
    })
});

router.post('/deletar', eAdmin, (req, res) => {
    User.remove({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'Usuário deletado com sucesso!')
        res.redirect("../admin/listar")
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar')
        res.redirect("../admin/listar")
    })
});

router.get('/listarVacinas', eAdmin, (req, res) => {
    res.render("admin/listarVacinas")
});

router.get('/listar', eAdmin, (req, res) => {
    User.find().then((users) => {
        console.log(users)
        res.render("admin/listar", { users: users })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar')
        res.redirect('/admin')
    });
});

router.get('/index', (req, res) => {
    res.render('admin/index')
});

router.post('/index', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '../home',
        failureRedirect: '../index',
        failureFlash: true
    })(req, res, next)

});

router.post('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Deslogado com sucesso!')
    res.redirect('/admin')
});

module.exports = router