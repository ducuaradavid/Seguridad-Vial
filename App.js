import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import PhotoDetailScreen from './src/screens/PhotoDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Bitácora Principal' }} />
        <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Capturar Evidencia' }} />
        <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} options={{ title: 'Detalle Protegido' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}