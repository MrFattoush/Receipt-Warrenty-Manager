# Setup Instructions for Receipt Manager App

This guide will help you set up and run the Receipt Manager application on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Expo CLI** - Will be installed via npx
- **Expo Go app** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) or [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

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

   This will install:
   - express
   - express-session
   - cors
   - bcrypt
   - jsonwebtoken
   - pg (PostgreSQL)
   - dotenv
   - And all dev dependencies

### Frontend (React Native/Expo) Setup

1. Open a **second terminal** and navigate to the ReceiptManager folder:
   ```bash
   cd fa25-fa25-team005-thehogriders/ReceiptManager
   ```

2. Install all required dependencies:
   ```bash
   npm install
   ```

   This will install:
   - expo
   - react
   - react-native
   - react-navigation
   - And all other dependencies

## Step 2: Configure IP Address

**IMPORTANT:** For the app to work on your phone, you need to configure the correct IP address.

### Find Your Computer's IP Address:

**On Windows (PowerShell):**
```bash
ipconfig
```
Look for "Wireless LAN adapter Wi-Fi" → "IPv4 Address" (e.g., `192.168.1.123`)

**On Mac/Linux:**
```bash
ifconfig
# or
ip addr
```
Look for your local network IP (usually starts with `192.168.x.x` or `10.x.x.x`)

### Update the Config File:

1. Open `fa25-fa25-team005-thehogriders/ReceiptManager/config.ts`
2. Replace the IP address on line 10 with **your computer's IP address**:
   ```typescript
   export const API_URL = 'http://YOUR_IP_HERE:5000';
   ```
   
   Example:
   ```typescript
   export const API_URL = 'http://192.168.1.123:5000';
   ```

**Note:** Make sure your phone and computer are on the **same Wi-Fi network**!

## Step 3: Run the Application

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

## Step 4: Run on Your Phone

1. Make sure your phone is connected to the **same Wi-Fi network** as your computer
2. Open the **Expo Go** app on your phone
3. Scan the QR code from Terminal 2
4. The app should load on your phone!

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
3. Update `ReceiptManager/config.ts` line 10
4. Restart the Expo server

---

## Additional Notes

- Keep both terminals running while developing
- Press `Ctrl+C` to stop the servers
- If your IP changes (e.g., after reconnecting to Wi-Fi), update `config.ts` and restart the Expo server
- The backend uses a JSON file (`database/users.json`) to store user data

