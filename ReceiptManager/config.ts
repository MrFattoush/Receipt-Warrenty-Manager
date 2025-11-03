// API Configuration - Auto-detects environment
import { Platform } from 'react-native';

// Function to get the appropriate API URL based on platform
const getApiUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'web') {
      // Web browser - use localhost
      return 'http://localhost:5000';
    } else {
      // Mobile device - use your computer's IP
      // Update this IP when you change networks
      return 'http://192.168.1.20:5001';
    }
  } else {
    // Production mode - replace with your production server URL
    return 'https://your-production-server.com';
  }
};

export const API_URL = getApiUrl();

// Helper function to update IP address easily
export const updateApiUrl = (newIp: string) => {
  // This function can be called to update the IP programmatically
  // For now, just update the hardcoded IP above
  console.log(`To update API URL, change the IP in config.ts to: ${newIp}`);
};

// Instructions for finding your IP:
// Windows: Run 'ipconfig' in PowerShell, look for "Wireless LAN adapter Wi-Fi" -> IPv4 Address
// Mac/Linux: Run 'ifconfig' or 'ip addr', look for inet address
// Common IP ranges: 192.168.x.x, 10.x.x.x, 172.16-31.x.x

