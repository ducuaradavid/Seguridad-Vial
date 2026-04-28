import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Fingerprint } from 'lucide-react-native';

const LoginScreen = ({ navigation }) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (!savedBiometrics) {
        return Alert.alert('Error', 'No hay datos biométricos configurados.');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Ingresa a tu Bitácora Segura',
        disableDeviceFallback: false,
      });

      if (result.success) {
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Error de Seguridad', 'No se pudo verificar la identidad.');
    }
  };

  return (
    <View style={styles.container}>
      <Fingerprint size={80} color="#1a4731" />
      <Text style={styles.title}>Bitácora Industrial</Text>
      <TouchableOpacity 
        style={[styles.button, !isBiometricSupported && styles.disabled]} 
        onPress={handleBiometricAuth}
        disabled={!isBiometricSupported}
      >
        <Text style={styles.buttonText}>Desbloquear Acceso</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginVertical: 20, color: '#1a4731' },
  button: { backgroundColor: '#1a4731', padding: 15, borderRadius: 8, width: '80%', alignItems: 'center' },
  disabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default LoginScreen;