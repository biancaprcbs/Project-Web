const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('user')
const passport = require('passport')

function myIdade(dataNascimento) {
    var hoje = new Date()
    var diferencaAnos = hoje.getFullYear() - dataNascimento.getFullYear();
    if (new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) <
        new Date(hoje.getFullYear(), dataNascimento.getMonth(), dataNascimento.getDate()))
        diferencaAnos--;
    return diferencaAnos;
}


router.get('/', (req, res) => {
    res.render("user/login",{
        flag: true,
        title: 'Login',
        style: 'styleLogin.css'
    })
});

router.get('/duvidas', (req, res) => {
    res.render("user/duvidas",{
        flag: true,
        title: 'Dúvidas Frequentes',
        style: 'styleDuvida.css'
    })

    
});

router.get('/home', (req, res) => {
    res.render("user/home", {
        flag: true,
        title: 'Home',
        style: 'styleUserHome.css'
    })
});

router.get('/cadastrar', (req, res) => {
    res.render("user/cadastrar",{
        flag: true,
        title: 'Cadastrar',
        style: 'styleCadastro.css'
    })
});

router.post('/cadastrar/novo', (req, res) => {

    var erros = []
    var dataNascimento = new Date(req.body.dataNascimento)
    var idade = myIdade(dataNascimento)

    if (typeof req.body.nomeCompleto === undefined || req.body.nomeCompleto.length < 8) {
        erros.push({ texto: "Nome inválido" })
    }
    if (typeof req.body.cpf === undefined || req.body.cpf.length !== 14) {
        erros.push({ texto: "CPF inválido" })
    }
    if (typeof req.body.logradouro === undefined || req.body.logradouro.length < 5) {
        erros.push({ texto: "Endereço inválido" })
    }
    if (typeof req.body.bairro === undefined || req.body.bairro.length < 4) {
        erros.push({ texto: "Bairro inválido" })
    }
    if (typeof req.body.numero === undefined || req.body.numero.length <= 0) {
        erros.push({ texto: "Número de endereço inválido" })
    }
    if (typeof req.body.dataNascimento === undefined) {
        erros.push({ texto: "Data inválida" })
    }
    if (typeof req.body.celular === undefined || req.body.celular.length !== 13) {
        erros.push({ texto: "Número de celular inválido" })
    }
    if (typeof req.body.email === undefined || req.body.email.length < 5) {
        erros.push({ texto: "Email inválido" })
    }
    if (typeof req.body.senha === undefined || req.body.senha.length < 5) {
        erros.push({ texto: "Senha inválida" })
    }

    if (erros.length > 0) {
        res.render("user/cadastrar", { erros: erros })
    } else {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                req.flash('error_msg', 'Já existe um cadastro com este email!')
                res.render("user/cadastrar")
            } else {
                if (idade > 59 || req.body.profissao === "Profissional da saúde" || req.body.profissao === "Aposentado" || req.body.doenca === "sim") {
                    req.body.grupo = "Grupo A: prioridade absoluta"
                } else if (req.body.profissao !== "Outro" && req.body.profissao !== "Sem profissão") {
                    req.body.grupo = "Grupo B: prioridade moderada"
                }
                new User(req.body).save().then(() => {
                    req.flash('success_msg', 'Usuário cadastrado com sucesso!')
                    res.redirect("../login")
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao cadastrar! Tente novamente!')
                    console.error('Houve um erro no cadastro: ' + err)
                    res.redirect("../login")
                });
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect("../login")
        });
    }
});

router.get('/editar/:id', (req, res) => {
    User.findOne({ _id: req.params.id }).then((user) => {
        res.render("user/editar", { user: user,
            flag: true,
            title: 'Editar',
            style: 'styleEditar.css'
        })
    }).catch((err) => {
        req.flash('error_msg', 'Este cadastro não existe')
        res.redirect("../home")
    })
});

router.post('/editar/edit', (req, res) => {
    User.findOne({ _id: req.body.id }).then((user) => {

        var erros = []
        var dataNascimento = new Date(req.body.dataNascimento)
        var idade = myIdade(dataNascimento)

        if (typeof req.body.nomeCompleto === undefined || req.body.nomeCompleto.length < 8) {
            erros.push({ texto: "Nome inválido" })
        }
        if (typeof req.body.cpf === undefined || req.body.cpf.length !== 14) {
            erros.push({ texto: "CPF inválido" })
        }
        if (typeof req.body.logradouro === undefined || req.body.logradouro.length < 5) {
            erros.push({ texto: "Endereço inválido" })
        }
        if (typeof req.body.bairro === undefined || req.body.bairro.length < 4) {
            erros.push({ texto: "Bairro inválido" })
        }
        if (typeof req.body.numero === undefined || req.body.numero.length <= 0) {
            erros.push({ texto: "Número de endereço inválido" })
        }
        if (typeof req.body.dataNascimento === undefined) {
            erros.push({ texto: "Data inválida" })
        }
        if (typeof req.body.celular === undefined || req.body.celular.length !== 13) {
            erros.push({ texto: "Número de celular inválido" })
        }
        if (typeof req.body.email === undefined || req.body.email.length < 5) {
            erros.push({ texto: "Email inválido" })
        }
        if (typeof req.body.senha === undefined || req.body.senha.length < 5) {
            erros.push({ texto: "Senha inválida" })
        }

        if (erros.length > 0) {
            req.flash('error_msg', 'Houve um erro ao atualizar')
            res.redirect("../home", { erros: erros })
        } else {

            user.nomeCompleto = req.body.nomeCompleto
            user.sexo = req.body.sexo
            user.cartaoDoSus = req.body.cartaoDoSus
            user.cpf = req.body.cpf
            user.logradouro = req.body.logradouro
            user.bairro = req.body.bairro
            user.numero = req.body.numero
            user.complemento = req.body.complemento
            user.dataNascimento = req.body.dataNascimento
            user.celular = req.body.celular
            user.cor = req.body.cor
            user.profissao = req.body.profissao
            user.email = req.body.email
            user.senha = req.body.senha

            if (idade > 59 || req.body.profissao === "Profissional da saúde" || req.body.profissao === "Aposentado" || req.body.doenca === "sim") {
                user.grupo = "Grupo A: prioridade absoluta"
            } else if (req.body.profissao !== "Outro" && req.body.profissao !== "Sem profissão") {
                user.grupo = "Grupo B: prioridade moderada"
            } else {
                user.grupo = "Grupo C: prioridade baixa"
            }

            user.save().then(() => {
                req.flash('success_msg', 'Usuário atualizado com sucesso!')
                res.redirect("../home")
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao atualizar')
                res.redirect("../home")
            })

        }
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar')
        res.redirect("../home")
    })
});

router.get('/login', (req, res) => {
    res.render('user/login')
});

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: 'home',
        failureRedirect: 'login',
        failureFlash: true
    })(req, res, next)

});

router.post('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Deslogado com sucesso!')
    res.redirect('/user')
});

module.exports = router