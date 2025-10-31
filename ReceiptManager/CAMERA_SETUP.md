# Camera Setup Guide

## Overview
This guide explains how to set up and use the camera functionality in the Receipt Manager app.

## Features Implemented

### 1. Camera Access
- **Scan Receipt Screen**: Users can access the camera to take photos of receipts
- **Permission Handling**: Automatic camera and media library permission requests
- **Fallback Options**: Gallery access when camera permissions are denied

### 2. Image Capture
- **Live Camera Preview**: Real-time camera view with capture area overlay
- **Photo Capture**: Tap to capture receipt images
- **Image Preview**: Review captured images before uploading
- **Retake Option**: Users can retake photos if not satisfied

### 3. Image Storage
- **Backend Storage**: Images are uploaded to the backend server
- **User Association**: Each receipt is linked to the logged-in user
- **File Management**: Images are stored in `/backend/uploads/` directory
- **Database Integration**: Receipt metadata stored in user's receipt array

### 4. Gallery Integration
- **Photo Library Access**: Users can select existing images from their gallery
- **Image Editing**: Basic cropping and editing capabilities
- **Media Library**: Automatic saving of captured photos to device gallery

## Technical Implementation

### Dependencies Added
```bash
npm install expo-camera expo-image-picker expo-media-library
```

### Backend Dependencies
```bash
npm install multer
```

### Key Files Modified
1. **ScanReceiptScreen.tsx**: Main camera interface
2. **MetadataScreen.tsx**: Receipt details entry with image preview
3. **app.json**: Camera and media library permissions
4. **backend/app.js**: Receipt upload endpoints
5. **backend/database/users.json**: User data structure with receipts array

### API Endpoints
- `POST /upload-receipt`: Upload receipt image
- `GET /receipts`: Get user's receipts
- `GET /uploads/:filename`: Serve uploaded images

## Usage Flow

1. **Access Camera**: Tap "New Receipt" → "Scan Receipt"
2. **Grant Permissions**: Allow camera and media library access
3. **Capture Image**: Position receipt in frame and tap "Capture"
4. **Review Image**: Preview captured image
5. **Upload**: Tap "Upload Receipt" to save to backend
6. **Add Details**: Navigate to metadata screen to add receipt information

## Permissions Required

### iOS (Info.plist)
- `NSCameraUsageDescription`: Camera access for receipt scanning
- `NSPhotoLibraryUsageDescription`: Photo library access for image selection

### Android (AndroidManifest.xml)
- `android.permission.CAMERA`: Camera access
- `android.permission.READ_EXTERNAL_STORAGE`: Read photos
- `android.permission.WRITE_EXTERNAL_STORAGE`: Save photos

## Next Steps for OCR Integration

To add OCR functionality:

1. **Install OCR Library**: Add a library like `react-native-text-detector` or `expo-google-vision`
2. **Process Images**: Send captured images to OCR service
3. **Extract Data**: Parse receipt text for amount, merchant, date
4. **Auto-fill Metadata**: Pre-populate metadata screen with extracted data
5. **Manual Review**: Allow users to edit auto-extracted information

## Troubleshooting

### Common Issues
1. **Camera Permission Denied**: Check device settings and app permissions
2. **Upload Fails**: Verify backend server is running and accessible
3. **Image Not Displaying**: Check file path and image format
4. **Navigation Issues**: Ensure all screen types are properly defined

### Development Notes
- Camera functionality uses `expo-camera` with `CameraView` component
- Image picker provides fallback camera functionality
- Backend uses `multer` for file upload handling
- Images are stored with unique filenames to prevent conflicts
