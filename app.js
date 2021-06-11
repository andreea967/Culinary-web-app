const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
const app = express();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/comentarii";

const port = 7777;

const fs = require('fs');
app.use(cookieParser());

app.use(session({
    key: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'parola',
    cookie:{
        expires: 3600000
    }
}));
var sesiune = 0;

app.use(function(req, res, next){
    res.locals.user = req.session.username;
    next();
  
});

// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));

// la accesarea din browser adresei http://localhost:7777/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res

//citire ingrediente din ingrediente.json
let rawdata = fs.readFileSync('ingrediente.json');
let Ingrediente = JSON.parse(rawdata);

//citire date in users.json
raw = fs.readFileSync('users.json');
var users = JSON.parse(raw);

console.log(users);

app.get('/', (req, res) => {
    sesiune = req.session.username;
    res.render('retete', {user: sesiune });

});

app.get('/retete', (req, res) => {
    sesiune = req.session.username;

    res.render('retete',{user: sesiune});
});

app.get('/cheesecake', (req, res) => {
    sesiune = req.session.username;
    res.render('cheesecake', {ingredient: Ingrediente});
});

app.get('/salmon', (req, res) => {
    res.render('salmon', {ingredient: Ingrediente});
});

app.get('/carbonara', (req, res) => {
    res.render('carbonara', {ingredient: Ingrediente});

});
app.get('/tiramisu', (req, res) => {
    res.render('tiramisu', {ingredient: Ingrediente});
});
app.get('/pie', (req, res) => {
    res.render('pie', {ingredient: Ingrediente});
});
app.get('/soup', (req, res) => {
    res.render('soup', {ingredient: Ingrediente});
});
app.get('/paella', (req, res) => {
    res.render('paella', {ingredient: Ingrediente});
});
app.get('/pancake', (req, res) => {
    res.render('pancake', {ingredient: Ingrediente});
});
app.get('/login', (req,res)=>{
    sesiune = req.session.username;
    if(sesiune){
        res.redirect('/');
    }else{
        res.render('login')
    }
    console.log(users[0].nume);

});
app.post('/login', (req, res)=>{

    flag = 0;
    let user = req.body;
    console.log("Verificare user: ", user);
    let name = user.username;
    let parola = user.password;
    for(var i in users){
        if(name == users[i].nume  && parola == users[i].parola){
            sesiune = req.session;
            sesiune.username= name;
            console.log(sesiune.username)
            res.cookie("utilizator", {nume: name});
            flag = 1;
            res.redirect('/retete');

        }
    }
    if(flag == 0){
        res.redirect('/login');
    }
});

app.post('/logout', (req, res)=>{
    req.session.destroy((err)=>{
        if(err){
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.post('/comentarii', (req, res)=>{
    var a= req.body;
    var page = req.body.page_name;
    console.log(page);
    console.log(a);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Comentarii");
        dbo.collection("comments").insertOne(a, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
      });
      res.redirect(page);
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));