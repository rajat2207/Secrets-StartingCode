//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt=require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/usersDB', { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret="ThisisOurLongSecret";

userSchema.plugin(encrypt,{secret:secret, encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
})


app.post('/register', function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            // console.log("New User Added");
            res.render('secrets')
        }
    }
    )
})

app.post('/login', function (req, res) {
    const usrName=req.body.username;
    const pwd=req.body.password;

    User.find({email:usrName,password:pwd},function(err,result){
        if(err){
            console.log(err);
        }else if(result){
            res.render('secrets');
            // console.log('user found');
        }else{
            res.render('login');
        }
    })
})

app.listen(3000, function () {
    console.log("Server running on Port 3000");
})