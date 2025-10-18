# 🚀 Setup Guide - Getting Your App Running with Expo Go

## What I Changed
I've converted your React Native app to use **Expo**, which means you can now test it easily on your phone using **Expo Go** without needing Android Studio or Xcode!

### Changes Made:
1. ✅ Updated `package.json` with Expo dependencies
2. ✅ Configured `App.tsx` to show your LoginScreen
3. ✅ Updated `app.json` for Expo configuration
4. ✅ Updated `babel.config.js` and `metro.config.js` for Expo
5. ✅ Created assets folder

---

## 📱 Step-by-Step Setup Instructions

### Step 1: Clean Up Old Dependencies
First, let's remove the old node_modules and lock file:

```powershell
cd ReceiptManager
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

### Step 2: Install Expo CLI Globally
```powershell
npm install -g expo-cli
```

### Step 3: Install Dependencies
```powershell
npm install
```

This will install:
- Expo SDK (~52.0.0)
- React Native (compatible version)
- React Navigation (for future screens)
- Axios (for API calls)
- All necessary Expo packages

### Step 4: Install Expo Go on Your Phone
- **iOS**: Download "Expo Go" from the App Store
- **Android**: Download "Expo Go" from Google Play Store

### Step 5: Start the Development Server
```powershell
npm start
```

or

```powershell
npx expo start
```

This will:
1. Start the Metro bundler
2. Show you a QR code in the terminal
3. Open a browser window with the Expo DevTools

### Step 6: View Your App
**On Your Phone:**
1. Make sure your phone and computer are on the **same Wi-Fi network**
2. Open the Expo Go app
3. Scan the QR code from your terminal:
   - **iOS**: Use the Camera app to scan, it will prompt to open in Expo Go
   - **Android**: Use the "Scan QR Code" button inside Expo Go

**Your LoginScreen should now appear on your phone!** 🎉

---

## 🔧 Useful Commands

```powershell
npm start          # Start Expo dev server
npm run android    # Open on Android emulator (if installed)
npm run ios        # Open on iOS simulator (Mac only)
npm run web        # Run in web browser
```

---

## 🐛 Troubleshooting

### "Module not found" errors
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### Can't connect on Expo Go
- Ensure phone and computer are on the same Wi-Fi
- Try switching connection mode in Expo DevTools (tunnel/LAN/localhost)
- On Windows, you might need to allow Node.js through your firewall

### Metro bundler errors
```powershell
npx expo start --clear
```

---

## 📝 What's Next?

Your LoginScreen is now displayed! Next steps:
1. Test the login UI on your phone
2. Add more screens as needed
3. When ready to connect to backend, update the `handleLogin` function in `LoginScreen.tsx`

---

## 💡 Tips

- **Hot Reload**: Changes you make will automatically update on your phone
- **Shake to Debug**: Shake your phone to open the debug menu
- **Console Logs**: View logs in your terminal where you ran `npm start`
- **No Native Code**: With Expo, you don't need to touch the android/ios folders

---

## ⚠️ Important Notes

- The old `android` and `ios` folders are now ignored by Expo
- If you need custom native code later, you can use `npx expo prebuild`
- For production builds, use EAS Build (Expo's cloud build service)

Happy coding! 🎉


