// load the things we need
'use strict'

import {
    createRequire
} from 'module';
const require = createRequire(
    import.meta.url);
import {
    fileURLToPath
} from 'url';
const __filename = fileURLToPath(
    import.meta.url);
import {
    dirname
} from 'path';
import {
    existsSync
} from 'fs';
const __dirname = dirname(__filename);

//Importamos dependencias
import express from 'express';
import request from 'request';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import enrollUser from './commercial-paper/organization/digibank/application/enrollUser.js';
import checkUsers from './checkUsers.js'
import pkg from './asset-transfer-basic/chaincode-javascript/lib/assetTransfer.js';
const { AssetExists, CreateAsset } = pkg;
//Requires para cargar/iniciar la base de datos MySQL
const db_bbdd_env = require('dotenv').config();
import Contract from './asset-transfer-basic/chaincode-javascript/lib/assetTransfer.js';
import conexion_db from './db.js';

//Iniciamos express + funciones importadas
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static('public'));

// set the view engine to ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//OJO con el orden del flash siempre al final y con session
app.use(session({
    secret: 'secret',
    name: 'uniqueSessionID',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

var ssn;

// index page
app.get('/', function (req, res) {
    res.render('pages/index');
});

// Index page
app.get('/index', function (req, res) {

    ssn = req.session;
    if (ssn.email) {
        console.log('Welcome back, ' + ssn.nombre + '!')
        res.render('pages/welcome', {
            username: email,
            data: results,
        });
    } else {
        console.log('Please login to view this page!');
        res.render('/pages/index');
    }
    //res.end();
    //res.render('pages/index');
});

// Sign In page
app.get('/sign_in', function (req, res) {
    res.render('pages/sign_in');
});

app.post('/sign_in', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    ssn = req.session;
    ssn.email = req.body.email;

    // Login Code
    if (email != undefined && password != undefined) {

        conexion_db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
            console.log('La cagaste 1!');
            console.log(results[0]);
            console.log(error);
            enrollUser.main_enrollUser(email);
            //User not found
            if (results.length == 0 && checkUsers(results[0].nombre) == false) {
                console.log('User/Password incorrect');
                req.flash('error', 'User/Password incorrect')
                res.render('/sign_in');
            }
            //User found
            /*else if (results[0].password == password && results[0].email == email) {
                //req.session.loggedIn = true;
                //req.session.username = username;
                //res.send("User OK");
                console.log('La cagaste 2!');
                res.render('pages/welcome', {
                    username: email
                });
            };*/
            // else if (results[0].password == password && results[0].email == email) {
            else {
                const hashedPassword = crypto.createHash('sha256').update(password).digest('base64');
                if (bcrypt.compare(password, hashedPassword)) {

                    //req.session.loggedIN = true;
                    //req.session.username = username;

                    console.log("---------> Login Successful")
                    console.log(password);
                    console.log(hashedPassword);

                    res.render('pages/welcome', {
                        username: email,
                        data: results,
                    });

                } else {
                    console.log("---------> Password Incorrect")

                    console.log(password);
                    console.log(hashedPassword);
                    //res.send("Password incorrect!")
                    console.log('User/Password incorrect');
                    req.flash('error', 'User/Password incorrect')
                    res.render('/sign_in');
                }
            }
        });
    };
});

// Welcome page
app.get('/welcome', function (req, res) {
    res.render('pages/welcome');
});

//View Info User
app.get('/addBol', function (req, res) {
    res.render('pages/addBol');
});

app.post('/addBol', function (req, res) {
    const email = req.body.email;
    const id = req.body.id;
    const ShipperName = req.body.ShipperName;
    const ShipperAddress = req.body.ShipperAddress;
    const ShipperCity = req.body.ShipperCity;
    const ShipperSID = req.body.ShipperSID;
    const ShipToName = req.body.ShipToName;
    const ShipToAddress = req.body.ShipToAddress;
    const ShipToCity = req.body.ShipToCity;
    const ShipToCID = req.body.ShipToCID;
    const BillToName = req.body.BillToName;
    const BillToAddress = req.body.BillToAddress;
    const BillToCity = req.body.BillToCity;
    const BillToTelephone = req.body.BillToTelephone;
    const CostumerOrderNumber = req.body.CostumerOrderNumber;
    const NumberPkgs = req.body.NumberPkgs;
    const Wgt = req.body.Wgt;
    const Pallet = req.body.Pallet;
    const AdditionalShipperInfo = req.body.AdditionalShipperInfo;
/*
    const ctx = Contract;
   

    if (AssetExists(ctx, id) != id) {
        req.flash('error', 'This ID already exists, we will create a new BoL')
        CreateAsset(ctx, id, ShipperName, ShipperAddress, ShipperCity, ShipperSID, ShipToName, ShipToAddress, ShipToCity, ShipToCID,
            BillToName, BillToAddress, BillToCity, BillToTelephone, CostumerOrderNumber, NumberPkgs, Wgt, Pallet, AdditionalShipperInfo);
        res.render('pages/welcome', {
            data: results,
        });
    }


*/



    res.render('pages/addBol');
});


// Register page
app.get('/register', function (req, res) {
    res.render('pages/register');
});

app.post('/register', function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (username != undefined && password != undefined && email != undefined) {
        conexion.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
            console.log(results[0]);
            //console.log(error);
            if (results.length > 0) {

                req.flash('error');
                res.send('This email already registered, try another user');
                //response.redirect('/register');
                //res.redirect('/welcome');
                res.render('/welcome', {
                    username: username
                });
                res.end();
            } else {
                conexion.query('INSERT INTO users (nombre, email, password) VALUES (?,?,?)', [username, email, password], function (error, results, fields) {
                    console.log('La cagaste 1!');
                    console.log(results[0]);
                    console.log(error);
                    res.end();
                });
            }
        });
    }
});

// FaQ page
app.get('/faq', function (req, res) {
    res.render('pages/faq');
});

// contact page
app.get('/contact', function (req, res) {
    res.render('pages/contact');
});

//Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/index');
    })
    //res.send('Thank you! Visit again')
});

app.listen(8080);
console.log('8080 is the magic port');