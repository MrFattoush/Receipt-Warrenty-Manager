
// imports 
const express = require('express');
var session = require('express-session');
var path = require('path');
var fs = require('fs');

// ----- HELPER FUNCTIONS -----//

// loads users from JSON file
let users = [];
const usersPath = path.join(__dirname, 'users.json');
try {
    if (fstat.existsSync(usersPath)){
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        console.log('Loaded ${users.length} users');
    }
} catch (error) {
    console.error('Error loading users:', error);
}


// --- AUTHENTICATION - (LOGIN AND SIGNIN) --- //

// access control - checks if the user is logged in
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

// ----- LOGIN ----- >>
// rendering login page - sends GET request for server
app.get('/login', function (req, res) {
    res.render('login', {error: null});
});

// login check - if user exists then redirect to dashboard; else keep them at the login page
app.post('login', function(req, res){
    const { username, password } = req.body;

    const user = findUser(username, password);      // NEED TO MAKE A FINDUSER FUNCTION PARSING
    if (user) {
        req.session.userId = user.id;
        req.session.username = user.username;
        res.redirect('/dashboard/${user.id}');      // NEED TO MAKE A DASHBOARD PAGE FOR LATER
    } else {
        res.render('login', {error: 'Invalid username or password' });
    }
});

