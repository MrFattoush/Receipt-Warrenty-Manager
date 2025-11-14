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
const bcrypt = require('bcrypt'); 
const Tesseract = require('tesseract.js');
const sharp = require('sharp');

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
        console.log(`Loaded ${users.length} users`);
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

    if (!(await bcrypt.compare(password, data.password_hash))) {
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
    const passwordHash = await bcrypt.hash(password, 10);

    const {data, error} = await supabase
        .from('users')
        .insert([
            { username: username, email: email, password_hash: passwordHash }
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
app.post('/add-receipt', async function (req, res) {
  const { merchant, totalAmount, purchaseDate, warrantyItem, warrantyExpiration } = req.body;

  console.log('Received /add-receipt request:', req.body);
  console.log('Session at /add-receipt:', req.session);

  // --- 1. Check if user is logged in ---
  if (!req.session || !req.session.userId) {
    console.log('No session or userId found');
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  // --- 2. Validate input fields ---
  if (!merchant || !totalAmount || !purchaseDate) {
    console.log('Validation failed: missing fields');
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // --- 3. Convert purchaseDate to YYYY-MM-DD for Supabase ---
  let formattedDate = null;
  try {
    const [month, day, year] = purchaseDate.split('/');
    if (!month || !day || !year || year.length !== 4) throw new Error('Invalid date format');
    formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } catch (err) {
    console.error('Date formatting error:', err);
    return res.status(400).json({ success: false, message: 'Purchase date must be MM/DD/YYYY' });
  }

  // --- 4. Convert amount to float ---
  const amount = parseFloat(totalAmount);
  if (isNaN(amount)) {
    return res.status(400).json({ success: false, message: 'Total amount must be a number' });
  }

  // --- 5. Format warranty expiration date (optional) ---
  let formattedWarrantyExp = null;
  if (warrantyExpiration && warrantyExpiration.trim() !== '') {
    try {
      const [month, day, year] = warrantyExpiration.split('/');
      if (!month || !day || !year || year.length !== 4) throw new Error('Invalid date format');
      formattedWarrantyExp = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (err) {
      console.error('Warranty date formatting error:', err);
      return res.status(400).json({ success: false, message: 'Warranty expiration must be MM/DD/YYYY' });
    }
  }

  // --- 6. Insert into Supabase ---

  try {
    const { data, error } = await supabase
      .from('receipts')
      .insert([
        {
          user_id: req.session.userId,
          store_name: merchant,
          amount: amount,
          receipt_date: formattedDate,
          upload_date: new Date().toISOString(),
          category: null,
          warranty_item: warrantyItem || null,
          warranty_exp_date: formattedWarrantyExp || null,
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ success: false, message: 'Failed to save receipt', error });
    }

    console.log('Inserted receipt into Supabase:', data);
    return res.json({ success: true, message: 'Receipt saved successfully', receipt: data[0] });

  } catch (err) {
    console.error('Unexpected server error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err });
  }
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
            category: null,
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

// function for preprocessiong image to better OCR parsing accuracy
async function preprocessImage(inputPath, outputPath){
    try {
        await sharp(inputPath)
            .grayscale()
            .normalize()
            .toFile(outputPath);

            console.log('Image preprocessed sucessfully');
            return outputPath;
    } catch (error) {
        console.error('Error with processing image:', error);
        throw error;
    }
}

// Parse Receipt 
function parseText(ocrText) {
    const result = {
        merchant: null,
        amount: null,
        date: null
    };

    console.log('Parsing OCR text...');

    // Extract amount - find all prices near payment keywords and pick the largest
    const amountRegex = /(?:Payment|Total|Amount Due|Balance|Grand Total|Due)[\s,:]*\$(\d+\.\d{2})/gi;
    const matches = ocrText.matchAll(amountRegex);
    let maxAmount = 0;

    for (const match of matches) {
        const amount = parseFloat(match[1]);
        if (amount > maxAmount) {
            maxAmount = amount;
        }
    }

    if (maxAmount > 0) {
        result.amount = maxAmount.toFixed(2);
    }

    const dateMatch = ocrText.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dateMatch) {
        result.date = `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`;
    }


    return result;

}



// Temporary receipts for parsing
app.post('/parse-receipt', upload.single('image'), async function(req, res){
    console.log('Running Parse');
    console.log('Session:', req.session);
    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.session || !req.session.userId){
        console.log('Authentication Error')
        return res.status(401).json({ success: false, message: 'Not Authenticated'});
    }
    
    if (!req.file){
        console.log('File Error')
        return res.status(404).json({success: false, message: 'Could not find file'});
    }

    const processedPath = req.file.path.replace('.jpg', '_processed.jpg');
    await preprocessImage(req.file.path, processedPath);
    

    const result = await Tesseract.recognize(
        processedPath,
        //req.file.path,
        'eng',
        //{logger: info => console.log(info)}
    );

    console.log('OCR Result:', result.data.text);

    const parsedData = parseText(result.data.text);
    console.log('Parsed Data:', parsedData);

    res.json({
        success: true,
        ocrText: result.data.text,
        parsedData: parsedData,     // sends parsed data to frontend
        message: 'OCR Completed'
    });

});

// // Get user's receipts
// app.get('/receipts', function(req, res) {
//     if (!req.session || !req.session.userId) {
//         return res.status(401).json({ success: false, message: 'Not authenticated' });
//     }

//     const user = findUserById(req.session.userId);
//     if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     res.json({ 
//         success: true, 
//         receipts: user.receipts 
//     });
// });

// GET /get-receipts
app.get('/get-receipts', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    // return rows where warranty_item is not null OR warranty_exp_date is not null
    const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', req.session.userId)
        .is('warranty_item', null)
        .is('warranty_exp_date', null)
        .order('receipt_date', { ascending: false });

    if (error) {
      console.error('Supabase get-receipts error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch receipts:', error });
    }

    console.log(data);
    return res.json({ success: true, receipts: data });
  } 
  catch (err) {
    console.error('Server error in /get-receipts:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /get-warranties
app.get('/get-warranties', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    // return rows where warranty_item is not null OR warranty_exp_date is not null
    const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', req.session.userId)
        .not('warranty_item', 'is', null)
        .not('warranty_exp_date', 'is', null)
        .order('warranty_exp_date', { ascending: true });

    if (error) {
      console.error('Supabase get-warranties error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch warranties', error });
    }

    // compute days_left and expiringSoon in server (so frontend is simpler)
    const today = new Date();
    const warrantiesWithMeta = data.map((row) => {
      let days_left = null;
      let expiringSoon = false;
      if (row.warranty_exp_date) {
        const exp = new Date(row.warranty_exp_date);
        // compute difference in days
        const diffMs = exp.setHours(0,0,0,0) - (new Date()).setHours(0,0,0,0);
        days_left = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        expiringSoon = days_left >= 0 && days_left <= 7; // within a week (including today)
      }
      return { ...row, days_left, expiringSoon };
    });

    return res.json({ success: true, warranties: warrantiesWithMeta });
  } catch (err) {
    console.error('Server error in /get-warranties:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//module.exports = app;

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));