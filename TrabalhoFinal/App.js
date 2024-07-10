// Carregando módulos
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const admin = require("./routes/admin");
const user = require("./routes/user");
const path = require('path');
const passport = require('passport');
require('./config/auth')(passport)
require('./models/User')
const User = mongoose.model('user')

// Sessão
app.use(session({
    secret: "TrabalhoFinal",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handlebars
app.engine(
    "handlebars",
    handlebars({
        defaultLayout: "main",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    })
);
app.set('view engine', 'handlebars');

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/bdVacina', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then((result) => {
    console.log('Banco conectado com sucesso!')
}).catch((err) => {
    console.error('Houve um error ao se conectar ao banco: ' + err)
});

// Public
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.get('/', (req, res) => {
    res.render('index', {
        flag: true,
        title: 'Vacina',
        style: 'style.css'
    })
})
app.use('/admin', admin);
app.use('/user', user);

// Outros
const port = 8081;
app.listen(port, () => {
    console.log("Servidor rodando!")
});

User.findOne({ email: "admin@adm.com" }).then((user) => {
    if (user) {
        console.log('Adm já no banco!')
    } else {
        const newUser = {
            email: "admin@adm.com",
            senha: "admin",
            eAdmin: 1
        }

        new User(newUser).save().then(() => {
            console.log("Adm adicionado ao banco!")
        }).catch((err) => {
            console.error('Houve um erro: ' + err)
        });
    }
}).catch((err) => {
    console.log('Houve um erro interno')
});