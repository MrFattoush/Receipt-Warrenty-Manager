import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_URL } from '../config';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  ScanReceipt: undefined;
  ManuallyAdd: undefined;
  MetadataScreen: { imageUri: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ScanReceiptScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
  };

  const takePicture = async () => {
    if (!isCapturing) {
      setIsCapturing(true);
      try {
        // For now, we'll use image picker as a fallback
        // In a real implementation, you'd use CameraView.takePictureAsync()
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'images',
          allowsEditing: true,
          //aspect: [1, 2],
          quality: 0.8,
        });
        
        if (!result.canceled && result.assets[0]) {
          setCapturedImage(result.assets[0].uri);
          // Save to device's photo library
          if (hasMediaLibraryPermission) {
            await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
          }
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      console.log('Opening gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        //aspect: [1, 2],
        quality: 0.8,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets[0]) {
        console.log('Image selected:', result.assets[0].uri);
        setCapturedImage(result.assets[0].uri);
      } else {
        console.log('Gallery selection canceled');
      }
    } catch (error: any) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to select image from gallery');
    }
  };

  const uploadImage = async () => {
    if (!capturedImage) return;

    setIsUploading(true);
    try {
      // Create FormData for React Native
      const formData = new FormData();
      formData.append('image', {
        uri: capturedImage,
        type: 'image/jpeg',
        name: 'receipt.jpg',
      } as any);

      console.log('Uploading image:', capturedImage);
      console.log('FormData created');

      const response = await fetch(`${API_URL}/parse-receipt`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        Alert.alert('Success', 'Receipt uploaded successfully!');
        // Navigate to metadata screen with the image URI
        navigation.navigate('MetadataScreen', { imageUri: capturedImage });
      } else {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        Alert.alert('Upload Failed', `Server error: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', `Failed to upload receipt: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera Access Required</Text>
        <Text style={styles.subtitle}>Please enable camera access in your device settings to scan receipts.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={pickImageFromGallery}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Receipt Captured!</Text>
        <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={retakePicture}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.uploadButton]} 
            onPress={uploadImage}
            disabled={isUploading}
          >
            <Text style={styles.buttonText}>
              {isUploading ? 'Uploading...' : 'Upload Receipt'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Receipt</Text>
      <Text style={styles.subtitle}>Choose how you'd like to add your receipt</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.optionButton, styles.galleryOption]} 
          onPress={pickImageFromGallery}
        >
          <Text style={styles.optionIcon}>📷</Text>
          <Text style={styles.optionTitle}>Choose from Gallery</Text>
          <Text style={styles.optionSubtitle}>Select an existing photo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionButton, styles.cameraOption]} 
          onPress={takePicture}
          disabled={isCapturing}
        >
          <Text style={styles.optionIcon}>📸</Text>
          <Text style={styles.optionTitle}>Take New Photo</Text>
          <Text style={styles.optionSubtitle}>Use camera to capture receipt</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.captureArea} />
          </View>
        </CameraView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.captureButton]} 
          onPress={takePicture}
          disabled={isCapturing}
        >
          <Text style={styles.buttonText}>
            {isCapturing ? 'Capturing...' : 'Capture Photo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 50,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  galleryOption: {
    backgroundColor: '#f8f9fa',
  },
  cameraOption: {
    backgroundColor: '#f0f8ff',
  },
  optionIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureArea: {
    width: 200,
    height: 400,
    borderWidth: 2,
    borderColor: '#DD27F5',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  capturedImage: {
    width: 200,
    height: 400,
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureButton: {
    backgroundColor: '#DD27F5',
  },
  galleryButton: {
    backgroundColor: '#4CAF50',
  },
  retakeButton: {
    backgroundColor: '#ff6b6b',
  },
  uploadButton: {
    backgroundColor: '#2196F3',
  },
});
