# Troubleshooting Guide

## Issue 1: Gallery vs Camera Options Not Clear

### ✅ **FIXED**: Improved UI Design
- Added prominent option buttons at the top of the screen
- Clear visual distinction between "Choose from Gallery" and "Take New Photo"
- Added icons and descriptive text for each option

### How to Use:
1. **Gallery Option**: Tap the left button with 📷 icon to select existing photos
2. **Camera Option**: Tap the right button with 📸 icon to take a new photo
3. **Live Camera**: The camera preview is still available below the options

---

## Issue 2: Image Upload Not Working

### ✅ **FIXED**: Multiple Improvements Made

#### **Backend Debugging Added**
- Console logs for upload requests
- Session validation logging
- File upload verification
- User authentication checks

#### **Frontend Improvements**
- Better error handling with detailed messages
- Loading states for upload button
- Console logging for debugging
- Improved FormData configuration

#### **CORS Configuration Updated**
- Added mobile app origin to CORS settings
- Proper credentials handling

### **Testing Steps:**

1. **Start Backend Server:**
   ```bash
   cd backend
   node app.js
   ```
   Look for: `Backend running on http://localhost:5000`

2. **Check Console Logs:**
   - Open browser dev tools or React Native debugger
   - Look for console messages when selecting/uploading images

3. **Verify Upload Directory:**
   ```bash
   cd backend
   dir uploads
   ```
   Should show uploaded files after successful uploads

4. **Test Complete Flow:**
   - Login to your account
   - Go to Dashboard → New Receipt → Scan Receipt
   - Choose "Choose from Gallery" or "Take New Photo"
   - Select/capture an image
   - Tap "Upload Receipt"
   - Check console for success/error messages

### **Common Issues & Solutions:**

#### **"No session or userId found"**
- **Cause**: User not logged in or session expired
- **Solution**: Log out and log back in

#### **"No file uploaded"**
- **Cause**: FormData not properly configured
- **Solution**: Check console logs for FormData creation

#### **"User not found"**
- **Cause**: Session userId doesn't match any user in database
- **Solution**: Check users.json file and session data

#### **Network Error**
- **Cause**: Backend server not running or wrong API_URL
- **Solution**: 
  - Start backend server: `cd backend && node app.js`
  - Check API_URL in config.ts matches your server

### **Debug Information:**

#### **Frontend Console Logs:**
```
Opening gallery...
Gallery result: {canceled: false, assets: [...]}
Image selected: file:///...
Uploading image: file:///...
FormData created
Response status: 200
Upload successful: {...}
```

#### **Backend Console Logs:**
```
Upload request received
Session: {userId: 1, username: 'fattoush'}
File: {filename: 'receipt-1234567890.jpg', ...}
User found: fattoush
Created receipt: {...}
Save result: true
```

### **File Structure After Upload:**
```
backend/
├── uploads/
│   └── receipt-1234567890.jpg  ← Uploaded image
├── database/
│   └── users.json              ← Updated with receipt data
└── app.js
```

### **Next Steps:**
1. Test the complete flow
2. Check console logs for any errors
3. Verify files appear in backend/uploads directory
4. Check users.json for receipt data

If issues persist, check:
- Backend server is running
- User is logged in
- Network connectivity
- Console error messages

