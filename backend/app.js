const { supabase } = require('./supabaseClient.js');

// IMPORTS 
// fs is a Node.js file system  tht allows us to read, write, delete files, etc.
const express = require('express');
var session = require('express-session');
var path = require('path');
var fs = require('fs');    
const cors = require('cors');
const multer = require('multer');   // helps handle photo uploads
const app = express();        // gives an express app instance

// multer for file uploads
const storage = multer.diskStorage({                          // creates a storage config for multer
    destination: function (req, file, cb) {                   // request file callback
        const uploadPath = path.join(__dirname, 'uploads');   // upload path -> folder names uploads
        if (!fs.existsSync(uploadPath)) {                     // if that path does not exists, make one
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);                                 // upload path to uploads folder directory  
    },
    filename: function (req, file, cb) {                                            // setting a function for filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);    // creates a unique string to prevent any name conflicts
        cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));      // creates a final filename
    }  
});

const upload = multer({ 
    storage: storage,                       // grabs previous storage object/definition
    limits: {
        fileSize: 10 * 1024 * 1024          // 10MB limit
    },
    fileFilter: function (req, file, cb) {              // makes sure if the image being uploaded is an image and not anything else
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// ----- HELPER FUNCTIONS (USERS for now) -----//

// loads users from JSON file
let users = [];
const usersPath = path.join(__dirname, 'database', 'users.json');
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

// REACT frontend access - Dynamic CORS for development
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Allow localhost and common development ports
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:19006',  // Expo development server
            'http://localhost:8081',   // Metro bundler
            'http://127.0.0.1:3000',
            'http://127.0.0.1:19006',
            'http://127.0.0.1:8081'
        ];
        
        // Allow any local network IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
        const localNetworkRegex = /^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/;
        
        if (allowedOrigins.includes(origin) || localNetworkRegex.test(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(session({               // session is a way to remember a specific user
    secret: 'rwm-secret-key',   // they need to have a 'locker key'
    resave: false,              // if nothing has been changed, no need to save the session
    saveUninitialized: false,   // don't create an empty session unless the user is actually active on it
    cookie: { maxAge: 3600000}  // 1 hour session cookie
}));

//app.set('screens', path.join(__dirname, 'screens'));    // tells express where to find the frontend
//app.set('view engine', 'ejs');                          // tells express what template engine to use

app.use(express.json());                                // lets express know that we are messing with JSON requests
app.use(express.urlencoded({extended: false}));         // helps understand form data
//app.use(express.static(path.join(__dirname, 'public')));    // tells express where the statics files are like css and images



// --- AUTHENTICATION - (LOGIN AND SIGNIN) --- //

// login check - if user exists then redirect to dashboard; else keep them at the login page
app.post('/login', async function(req, res){
    const { username, password } = req.body;

    return await getUserFromDB(req, res, username, password);

    // const user = getUserFromDB(username, password);      // NEED TO MAKE A FINDUSER FUNCTION PARSING
    // if (user) {
    //     req.session.userId = user.id;
    //     req.session.username = user.username;
    //     return res.json({success: true, user});      // NEED TO MAKE A DASHBOARD PAGE FOR LATER
    // } else {
    //     res.status(401).json({ success: false, message: 'Invalid credentials' });
    // }
});

getUserFromDB = async (req, res, username, password) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, password_hash')
        .eq('username', username)
        .single(); // single() ensures we get one object instead of an array
    
    if (error) {
        return res.status(401).json({ success: false, message: 'Username does not exist' });
    }

    if (data.password_hash !== password) {
        console.log(data)
        console.log(data.password_hash)
        console.log(password)
        return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    req.session.userId = data.id;
    req.session.username = username;

    return res.json({ success: true });
}

// signup check
app.post('/signup', async function(req, res){
    const {username, email, password} = req.body
    // add some validation
    if (!username || !email || !password){
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (password.length < 8){
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }
    if (username.length < 4) {
        return res.status(400).json({ success: false, message: 'Username must be at least 4 characters' });
    }

    return await addUserToDB(req, res, username, email, password)
});

addUserToDB = async (req, res, username, email, password) => {
    const {data, error} = await supabase
        .from('users')
        .insert([
            { username: username, email: email, password_hash: password }
        ]);
    
    if (error) {
        if (error.code === '23505') { // string comparison
            return res.status(400).json({ success: false, message: 'Username or email already exists.' });
        } 
        else {
            return res.status(400).json({ success: false, message: 'Signup failed. Please try again.' });
        }
    }

    const generatedUser = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single(); // single() ensures we get one object instead of an array

    req.session.userId = generatedUser.id;
    req.session.username = username;

    return res.json({success: true})
}

app.get('/logout', function(req, res){
    req.session.destroy();
    res.json('login', {error: null, success: null});
})

// ----- MANUALLY ENTERING DATA ----- //

app.post('/add-receipt', function(req, res){
    const {merchant, totalAmount, purchaseDate} = req.body;

    // validate user
    if (!req.session || !req.session.userId) {
        console.log('No session or userId found');
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    // validate data
    if (!merchant && !totalAmount && !purchaseDate){
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (!merchant){
        return res.status(400).json({ success: false, message: 'Missing merchant' });
    }
    if (!totalAmount){
        return res.status(400).json({success: false, message: 'Missing total amount'});
    }
    if (!purchaseDate){
        return res.status(400).json({success: false, message: 'Missing purchase date'});
    }

    // find user
    const user = findUserById(req.session.userId);
    if(!user){
        console.log('User ID not found:', req.session.UserId);
        return res.status(404).json({ success: false, message: 'User not found'});
    }

    const receipt = {
        id: user.receipts.length > 0 ? Math.max(...user.receipts.map(r => r.id)) + 1 : 1,
        filename: null,
        originalName: null,
        path: null,
        ocrData: null,
        uploadDate: new Date().toISOString(),
        metadata: {
            merchant: merchant,
            amount: totalAmount,
            date: purchaseDate,
            category: null
        }
    };

    console.log('Created manual data from receipt:', receipt);

    // add data to user's receiptData array
    user.receipts.push(receipt);
    const saveResult = saveUser();
    console.log('Save result:', saveResult);

    res.json({ 
        success: true, 
        message: 'Receipt data uploaded successfully',
        receipt: receipt
    });
});




// ----- RECEIPT MANAGEMENT ----- //
// Helper function to find user by ID
function findUserById(userId) {
    return users.find(u => u.id === userId);
}

// Upload receipt endpoint
app.post('/upload-receipt', upload.single('image'), function(req, res) {
    console.log('Upload request received');                                 // add some logs
    console.log('Session:', req.session);
    console.log('File:', req.file);
    console.log('Body:', req.body);

    // make sure the user is present
    if (!req.session || !req.session.userId) {
        console.log('No session or userId found');
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    // checks if file was uploaded
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    // makes sure user is found
    const user = findUserById(req.session.userId);
    if (!user) {
        console.log('User not found for ID:', req.session.userId);
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('User found:', user.username);

    // create receipt object
    const receipt = {
        id: user.receipts.length > 0 ? Math.max(...user.receipts.map(r => r.id)) + 1 : 1,
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        uploadDate: new Date().toISOString(),
        ocrData: null, // will be processed later with OCR
        metadata: {
            merchant: null,
            amount: null,
            date: null,
            category: null
        }
    };

    console.log('Created receipt:', receipt);

    // add receipt to user's receipts array
    user.receipts.push(receipt);
    const saveResult = saveUser();
    console.log('Save result:', saveResult);

    res.json({ 
        success: true, 
        message: 'Receipt uploaded successfully',
        receipt: receipt
    });
});

// Get user's receipts
app.get('/receipts', function(req, res) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = findUserById(req.session.userId);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
        success: true, 
        receipts: user.receipts 
    });
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//module.exports = app;

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));