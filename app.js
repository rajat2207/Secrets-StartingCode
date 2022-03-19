//jshint esversion:6
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const md5=require(md5);
const bcrypt =require('bcrypt');
const saltRounds=10;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/usersDB', { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

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

    bcrypt.hash(req.body.password,saltRounds,function(err,hash){

        const newUser = new User({
            email: req.body.username,
            password: hash
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
})

app.post('/login', function (req, res) {
    const usrName=req.body.username;
    const pwd=req.body.password;

    User.find({email:usrName},function(err,result){
        if(err){
            console.log(err);
        }else if(result){
            bcrypt.compare(pwd,result.password,function(err,result2){
                if(result2){
                    res.render('secrets');
                }else{
                    res.render('login');
                }
            });
        }else{
            res.render('login');
        }
    })
})

app.listen(3000, function () {
    console.log("Server running on Port 3000");
})