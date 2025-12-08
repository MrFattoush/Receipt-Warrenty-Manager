
# Receipt & Warranty Manager App

> A mobile application that helps users save, track, and manage receipts and warranty information using AI-powered OCR.

---

## 📋 Project Summary

### The Problem

People commonly lose their receipts or forget to keep track of warranty deadlines. Paper receipts are easy to throw away, misplace, or ignore until it's too late; often resulting in missed return windows or expired warranties.

### Our Solution

The **Receipt Manager App** digitizes receipts, extracts key details automatically, and keeps warranty reminders organized all in one place.

### What Makes Us Different

Our app uses **AI (Google Gemini)** to parse and automatically add receipt data into the user's account, providing superior accuracy for merchant identification compared to traditional OCR-only solutions.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Receipt Capture** | Take a photo of a receipt OR upload one from your gallery |
| **AI-Powered Extraction** | Automatically extract key information (merchant, date, amount) using Google Gemini |
| **Cloud Storage** | Store parsed data and receipt images securely in Supabase database |
| **Dashboard View** | View past receipts, warranties, and purchase metadata |
| **Manual Management** | Edit, delete existing receipts/warranties, or add new ones manually |
| **Smart Filtering** | Filter receipts/warranties by merchant name |

---

## Technical Architecture

<img width="769" height="351" alt="Screenshot 2025-12-07 223200" src="https://github.com/user-attachments/assets/bc309742-6f7a-4e59-94dd-d13483df4bae" />

### Frontend - React Native (Expo)

**Role in the Application:**
- Provides the user interface for scanning receipts, viewing history, editing metadata, and managing warranties
- Handles user interactions like login, upload, search, delete, and notifications

**Interactions with Other Components:**
- Sends images and form data to the backend via REST API
- Receives authenticated session tokens and receipt/warranty data from backend
- Uses OCR output (from backend) to auto-fill metadata fields

**Languages & Libraries:**
- React Native (TypeScript/JavaScript)
- Expo (mobile tooling)
- React Navigation
- Native device modules (camera, gallery, notifications)

---

### Backend - Node.js + Express

**Role in the Application:**
- Handles all business logic: authentication, receipt processing, metadata storage, and notifications
- Exposes REST API endpoints used by the mobile app
- Validates credentials, parses OCR results, and stores everything in the database

**Interactions with Other Components:**
- Communicates with PostgreSQL (Supabase) to retrieve and save user and receipt data
- Receives image uploads and processes OCR requests
- Sends results (receipts, warranty items, metadata) back to frontend

**Languages & Libraries:**
- Node.js (JavaScript/TypeScript)
- Express (REST API framework)
- Multer / FormData for image upload
- Bcrypt for password hashing
- Google Gemini API (for enhanced merchant identification accuracy)

---

### OCR Processing Component

**Role in the Application:**
- Extracts text from uploaded receipt images
- Identifies key fields like store name, date, cost, and warranty expiration
- Supplies structured metadata that can be saved into the database

**Interactions with Other Components:**
- Receives receipt images from frontend (through backend)
- Outputs parsed text to backend logic for clean formatting
- Backend sends parsed text back to frontend for user confirmation/editing

**Languages & Libraries:**
- Tesseract.js
- Google Gemini API
- Node.js
- Text parsing utilities (Regex, heic-convert, Sharp)

---

### PostgreSQL Database (Supabase)

**Role in the Application:**
- Stores all user accounts, receipts, warranty metadata, OCR results, and reminders
- Ensures data persistence, relational linking, and secure retrieval

**Interactions with Other Components:**
- Receives insert/select/update/delete commands from backend
- Sends stored receipt metadata back to backend for dashboard and search features
- Works with authentication logic to validate login credentials

**Languages & Libraries:**
- PostgreSQL
- Supabase (hosted DB + API tools)
- SQL queries written through Node.js (`pg` package)

---

## 👥 Team Members & Roles

| Team Member | Primary Role | Responsibilities |
|-------------|--------------|------------------|
| **Kai** | Frontend Developer | React Native UI development, OCR testing |
| **Jason** | Frontend Developer | React Native UI development, Code review |
| **Mo** | Backend Developer | Node.js/Express API, OCR processing (Lead), Database schema design & queries |
| **Dennis** | Backend Developer | Node.js/Express API, OCR testing, Database setup (Lead) |

### Component Ownership

| Component | Lead | Contributors |
|-----------|------|--------------|
| Frontend (React Native) | Kai & Jason | - |
| Backend (Node.js + Express) | Mo & Dennis | - |
| OCR Processing | Mo (Lead) | Dennis & Kai (Testing), Jason (Review) |
| PostgreSQL Database (Supabase) | Dennis (Lead & Setup) | Mo (Schema Design & Queries) |

---

# ENVIRONMENT

This guide will help you set up and run the Receipt Manager application on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Expo CLI** - Will be installed via npx
- **Expo Go app** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) or [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

---

## Required Libraries

### Backend Dependencies

The backend requires the following npm packages:

| Package | Version | Description |
|---------|---------|-------------|
| `express` | ^5.1.0 | Web framework for Node.js |
| `express-session` | ^1.18.0 | Session middleware for Express |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| `bcrypt` | ^6.0.0 | Password hashing library |
| `jsonwebtoken` | ^9.0.2 | JWT token generation and verification |
| `pg` | ^8.16.3 | PostgreSQL client for Node.js |
| `dotenv` | ^17.2.2 | Environment variable loader |
| `@supabase/supabase-js` | ^2.78.0 | Supabase client library |
| `multer` | ^2.0.2 | File upload middleware |
| `sharp` | ^0.34.5 | Image processing library |
| `tesseract.js` | ^6.0.1 | OCR (Optical Character Recognition) |
| `heic-convert` | ^2.1.0 | HEIC image format converter |

**Dev Dependencies:**
| Package | Version | Description |
|---------|---------|-------------|
| `nodemon` | ^3.1.10 | Auto-restart server on changes |
| `typescript` | ^5.9.2 | TypeScript compiler |
| `ts-node` | ^10.9.2 | TypeScript execution environment |
| `@types/express` | ^5.0.3 | TypeScript types for Express |
| `@types/node` | ^24.5.2 | TypeScript types for Node.js |

### Frontend (React Native/Expo) Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `expo` | 54.0.23 | Expo SDK |
| `react` | ^19.1.0 | React library |
| `react-native` | 0.81.5 | React Native framework |
| `@react-navigation/native` | ^7.1.18 | Navigation library |
| `@react-navigation/stack` | ^7.4.9 | Stack navigation |
| `expo-camera` | 17.0.9 | Camera access |
| `expo-image-picker` | ^17.0.8 | Image picker |
| `expo-image-manipulator` | ~14.0.7 | Image manipulation |
| `expo-media-library` | ^18.2.0 | Media library access |
| `expo-status-bar` | ~3.0.8 | Status bar control |
| `react-native-gesture-handler` | ^2.28.0 | Gesture handling |
| `react-native-safe-area-context` | ~5.6.0 | Safe area handling |
| `react-native-screens` | ~4.16.0 | Native screens |
| `multer` | ^2.0.2 | File handling |

**Dev Dependencies:**
| Package | Version | Description |
|---------|---------|-------------|
| `@babel/core` | ^7.20.0 | Babel compiler |
| `@types/react` | ~19.1.10 | TypeScript types for React |
| `typescript` | ~5.9.2 | TypeScript compiler |
| `nodemon` | ^3.1.10 | Auto-restart on changes |

---

## Step 1: Install Dependencies

### Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd fa25-fa25-team005-thehogriders/backend
   ```

2. Install all required dependencies:
   ```bash
   npm install
   ```

### Frontend (React Native/Expo) Setup

1. Open a **second terminal** and navigate to the ReceiptManager folder:
   ```bash
   cd fa25-fa25-team005-thehogriders/ReceiptManager
   ```

2. Install all required dependencies:
   ```bash
   npm install
   ```

---

## Step 2: Configure Environment File (env.js)

### Create/Update the env.js file

1. Navigate to `fa25-fa25-team005-thehogriders/backend/`
2. Create or update the `env.js` file with the following template:

```javascript
// Backend Environment Configuration
// Copy this file and replace the placeholder values with your own API keys

const SUPABASE_URL = "YOUR_SUPABASE_URL_HERE";
const SUPABASE_PUBLIC_KEY = "YOUR_SUPABASE_PUBLIC_KEY_HERE";
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

module.exports = {
  SUPABASE_URL,
  SUPABASE_PUBLIC_KEY,
  GEMINI_API_KEY
};
```

**Where to get these keys:**
- **SUPABASE_URL & SUPABASE_PUBLIC_KEY**: Create a project at [supabase.com](https://supabase.com) and find these in Project Settings → API
- **GEMINI_API_KEY**: Get from [Google AI Studio](https://aistudio.google.com/apikey)

---

## Step 3: Configure IP Address (config.ts)

**IMPORTANT:** For the app to work on your phone, you need to configure the correct IP address.

### Find Your Computer's IP Address:

**On Windows (PowerShell):**
```bash
ipconfig
```
Look for "Wireless LAN adapter Wi-Fi" → "IPv4 Address" (e.g., `xxx.xxx.x.xxx`)

**On Mac/Linux:**
```bash
ifconfig
# or
ip addr
```
Look for your local network IP (usually starts with `192.xxx.x.x` or `10.x.x.x`)

### Update the Config File:

1. Open `fa25-fa25-team005-thehogriders/ReceiptManager/config.ts`
2. Find line 16 and replace the IP address with **your computer's IP address**:
   
   ```typescript
   // Change this line:
   return 'http://xxx.xxx.x.xx:5000';
   
   // To your IP:
   return 'http://YOUR_IP_HERE:5000';
   ```
   
   Example:
   ```typescript
   return 'http://xxx.xxx.x.xxx:5000';
   ```

**Note:** Make sure your phone and computer are on the **same Wi-Fi network**!

---

## Step 4: Run the Application

### Terminal 1 - Start the Backend Server:

```bash
cd fa25-fa25-team005-thehogriders/backend
node app.js
```

You should see:
```
Backend running on http://localhost:5000
```

### Terminal 2 - Start the Expo Development Server:

```bash
cd fa25-fa25-team005-thehogriders/ReceiptManager
npx expo start
```

You should see a QR code in the terminal.

---

## Step 5: Run on Your Phone

1. Make sure your phone is connected to the **same Wi-Fi network** as your computer
2. Open the **Expo Go** app on your phone
3. Scan the QR code from Terminal 2
4. The app should load on your phone!

---

## Sample Configuration Files

### Sample `backend/env.js`:

```javascript
// ====================================================
// BACKEND ENVIRONMENT CONFIGURATION
// ====================================================
// Instructions:
// 1. Copy this entire code block
// 2. Create a file named 'env.js' in the 'backend' folder
// 3. Paste this code and replace the placeholder values
// ====================================================

const SUPABASE_URL = "https://your-project-id.supabase.co/";
const SUPABASE_PUBLIC_KEY = "your-supabase-anon-key-here";
const GEMINI_API_KEY = "your-gemini-api-key-here";

module.exports = {
  SUPABASE_URL,
  SUPABASE_PUBLIC_KEY,
  GEMINI_API_KEY
};
```

### Sample `ReceiptManager/config.ts` (IP Configuration Section):

```typescript
// In config.ts, find the getApiUrl function and update line 16:

const getApiUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      return 'http://localhost:5000';
    } else {
      // ========================================
      // UPDATE THIS IP TO YOUR COMPUTER'S IP
      // ========================================
      return 'http://PUT_YOUR_IP_HERE:5000';
      // Example: return 'http://192.168.1.100:5000';
    }
  } else {
    return 'https://your-production-server.com';
  }
};
```

---

## Troubleshooting

### Issue: "Cannot connect to backend" or network errors

**Solution:**
- Verify your IP address hasn't changed: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Update `config.ts` with the new IP
- Make sure both devices are on the same Wi-Fi network
- Check if Windows Firewall is blocking port 5000

### Issue: "Cannot find module 'express-session'" or similar

**Solution:**
- Make sure you ran `npm install` in the backend folder
- Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

### Issue: Expo app won't start

**Solution:**
- Clear Expo cache: `npx expo start -c`
- Make sure you ran `npm install` in the ReceiptManager folder
- Delete `node_modules` folder and reinstall: `rm -rf node_modules && npm install`

### Issue: Port 5000 already in use

**Solution:**
- Find and kill the process using port 5000, or
- Change the port in `backend/app.js` (line 159) and update `ReceiptManager/config.ts` accordingly

### Issue: Missing env.js or API key errors

**Solution:**
- Make sure you created the `env.js` file in the `backend` folder
- Verify all API keys are correctly filled in
- Check that the file exports the variables correctly

### Issue: Sharp or native module installation fails

**Solution:**
- On Windows, you may need to install build tools:
  ```bash
  npm install --global windows-build-tools
  ```
- On Mac, ensure Xcode Command Line Tools are installed:
  ```bash
  xcode-select --install
  ```

---

## Quick Reference

### Backend Terminal:
```bash
cd fa25-fa25-team005-thehogriders/backend
node app.js
```

### Frontend Terminal:
```bash
cd fa25-fa25-team005-thehogriders/ReceiptManager
npx expo start
```

### Update IP Address:
1. Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Find your IPv4 address
3. Update `ReceiptManager/config.ts` line 16
4. Restart the Expo server

---

## Additional Notes

- Keep both terminals running while developing
- Press `Ctrl+C` to stop the servers
- If your IP changes (e.g., after reconnecting to Wi-Fi), update `config.ts` and restart the Expo server
- The backend uses Supabase for database storage
- Make sure all API keys in `env.js` are valid before starting the server
