import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import ScanReceiptScreen from './screens/ScanReceiptScreen';
import ManuallyAddScreen from './screens/ManuallyAddScreen';
import ViewReceiptsScreen from './screens/ViewReceiptsScreen';
import ViewWarrantiesScreen from './screens/ViewWarrantiesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ 
              headerLeft: () => null,  // Remove back button
              gestureEnabled: false     // Disable swipe-back gesture
            }}
          />
          <Stack.Screen name="ScanReceipt" component={ScanReceiptScreen} />
          <Stack.Screen name="ManuallyAdd" component={ManuallyAddScreen} />

          <Stack.Screen name="ViewReceipts" component={ViewReceiptsScreen} />
          <Stack.Screen name="ViewWarranties" component={ViewWarrantiesScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


