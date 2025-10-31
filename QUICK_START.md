# Quick Start Guide

## TL;DR - Run These Commands

### First Time Setup:

**Terminal 1 - Backend:**
```powershell
cd fa25-fa25-team005-thehogriders\backend
npm install
```

**Terminal 2 - Frontend:**
```powershell
cd fa25-fa25-team005-thehogriders\ReceiptManager
npm install
```

**Update IP Address:**
1. Run `ipconfig` in PowerShell
2. Find your "IPv4 Address" under "Wireless LAN adapter Wi-Fi"
3. Edit `ReceiptManager\config.ts` line 10 and replace with your IP

### Every Time You Run the App:

**Terminal 1 - Start Backend:**
```powershell
cd fa25-fa25-team005-thehogriders\backend
node app.js
```
✅ Should see: `Backend running on http://localhost:5000`

**Terminal 2 - Start Expo:**
```powershell
cd fa25-fa25-team005-thehogriders\ReceiptManager
npx expo start
```
✅ Should see: QR code in terminal

**On Your Phone:**
1. Install **Expo Go** app from App Store/Play Store
2. Connect to the **same Wi-Fi** as your computer
3. Scan the QR code from Terminal 2
4. App should load!

---

## What's Fixed

✅ Added `express-session` to backend dependencies  
✅ Fixed users.json file path  
✅ All dependencies installed  
✅ Ready to run!

## Alternative: Using an Emulator

**Don't have a phone?** You can use an emulator:

- **Android**: Update `config.ts` → `http://10.0.2.2:5000` then run `npx expo start` and press `a`
- **iOS (Mac only)**: Update `config.ts` → `http://localhost:5000` then run `npx expo start` and press `i`

## Need Help?

- `SETUP_INSTRUCTIONS.md` - Detailed setup + troubleshooting
- `DEVELOPMENT_TIPS.md` - Developer workflow, tips & tricks
- `NEW_USER_CHECKLIST.md` - Step-by-step checklist

