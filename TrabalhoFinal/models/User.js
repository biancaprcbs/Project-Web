const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Model - usuário 
const userSchema = new Schema({
    nomeCompleto: {
        type: String,
        require: true
    },
    sexo: {
        type: String,
        require: true
    },
    cartaoDoSus: {
        type: String,
    },
    cpf: {
        type: String,
        require: true
    },
    logradouro: {
        type: String,
        require: true
    },
    bairro: {
        type: String,
        require: true
    },
    numero: {
        type: String,
        require: true
    },
    complemento: {
        type: String,
    },
    dataNascimento: {
        type: Date,
        require: true
    },
    celular: {
        type: String,
        require: true
    },
    cor: {
        type: String,
        require: true
    },
    profissao: {
        type: String,
        require: true
    },
    doenca: {
        type: String,
        require: true
    },
    grupo: {
        type: String,
        default: "Grupo C: prioridade baixa"
    },
    tipoVacina: {
        type: String,
        default: "Não aplicada"
    },
    dose1: {
        type: String,
        default: "Não aplicada"
    },
    dose2: {
        type: String,
        default: "Não aplicada"
    },
    dataDose1: {
        type: String,
        default: "Não aplicada"
    },
    dataDose2: {
        type: String,
        default: "Não aplicada"
    },
    email: {
        type: String,
        require: true
    },
    senha: {
        type: String,
        require: true
    },
    eAdmin: {
        type: Number,
        default: 0
    }
});

// Collection
mongoose.model('user', userSchema);