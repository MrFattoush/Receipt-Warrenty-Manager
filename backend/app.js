
// IMPORTS 
// fs is a Node.js file system  tht allows us to read, write, delete files, etc.
const express = require('express');
var session = require('express-session');
var path = require('path');
var fs = require('fs');    
const cors = require('cors');                 
const app = express();        // gives an express app instance

// ----- HELPER FUNCTIONS (USERS for now) -----//

// loads users from JSON file
let users = [];
const usersPath = path.join(__dirname, 'users.json');
try {
    if (fs.existsSync(usersPath)){
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        console.log('Loaded ${users.length} users');
    }
} catch (error) {
    console.error('Error loading users:', error);
}

function saveUser(){
    try {
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        return true;
    } catch (error){
        console.error('Error saving users:', error);
        return false;
    }
}

// finds user in json file
function findUser(username, password){
    return users.find(u => u.username === username && u.password && password);
    //parses through json file and checks the name username of each section
    // if the username and the password of the input matches the stored data, accept user; else don't return anything
}

// checks for if username already exists
function checkUserExists(username){
    return users.find(u => u.username === username);
}

// checks for if email already exists
function checkEmailExists(email){
    return users.find(u => u.email === email);
}

// --- SESSION MIDDLEWARE --- //
// (This is super important because it gives a foundation of how the app communicates with users and remember who they are :D )

// REACT frontend access
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(session({               // session is a way to remember a specific user
    secret: 'rwm-secret-key',   // they need to have a 'locker key'
    resave: false,              // if nothing has been changed, no need to save the session
    saveUnitialized: false,     // don't create an empty session unless the user is actually active on it
    cookie: { maxAge: 3600000}  // 1 hour session cookie
}));

//app.set('screens', path.join(__dirname, 'screens'));    // tells express where to find the frontend
//app.set('view engine', 'ejs');                          // tells express what template engine to use

app.use(express.json());                                // lets express know that we are messing with JSON requests
app.use(express.urlencoded({extended: false}));         // helps understand form data
//app.use(express.static(path.join(__dirname, 'public')));    // tells express where the statics files are like css and images



// --- AUTHENTICATION - (LOGIN AND SIGNIN) --- //

// access control - checks if the user is logged in
// function requireAuth(req, res, next) {
//     if (req.session && req.session.userId) {
//         next();
//     } else {
//         res.redirect('/login');
//     }
//}

// ----- LOGIN ----- >>
// rendering login page - sends GET request for server
// app.get('/login', function(req, res) {
//     res.render('login', {error: null});
// });

// login check - if user exists then redirect to dashboard; else keep them at the login page
app.post('login', function(req, res){
    const { username, password } = req.body;

    const user = findUser(username, password);      // NEED TO MAKE A FINDUSER FUNCTION PARSING
    if (user) {
        req.session.userId = user.id;
        req.session.username = user.username;
        return res.json({success: true, user});      // NEED TO MAKE A DASHBOARD PAGE FOR LATER
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// ----- SIGNUP --- >>

// app.get('/signup', function(req, res){
//     res.render('signup', {error: null, success: null});
// });

app.post('signup', function(req, res){
    const {username, email, password, confirmPassword} = req.body
    // add some validation
    if (!username || !email || !password || !confirmPassword){
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (password.length < 8){
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }
    if (password != confirmPassword){
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    if (username.length < 3) {
        return res.status(400).json({ success: false, message: 'Username needs to be at least 4 characters long' });
    }
    if (checkUserExists(username)){
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    if (checkEmailExists(email)){
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // creates a new user and then pushes it to JSON db
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: username,
        email: email,
        password: password
    };
    users.push(newUser);
    saveUser();         // added

    // auto login after signup
    req.session.userId = newUser.id;
    req.session.username = newUser.username;
    return res.json({success: true, user: newUser});
});

app.get('logout', function(req, res){
    req.session.destroy();
    res.json('login', {error: null, success: null});
})

//module.exports = app;

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));