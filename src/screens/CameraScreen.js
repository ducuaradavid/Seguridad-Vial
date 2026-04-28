import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';

const CameraScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) return <View style={styles.container} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.textCenter}>Se requiere acceso a la cámara para generar registros de bitácora.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btnAction}>
          <Text style={{color: 'white'}}>Conceder Permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (isProcessing || !cameraRef.current) return; // Bloqueo anti-spam (Monkey Testing) [cite: 30]
    
    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      
      let location = null;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      }

      navigation.navigate('Home', { 
        newLog: { 
          uri: photo.uri, 
          coords: location?.coords, 
          date: new Date().toLocaleString() 
        } 
      });
    } catch (error) {
      Alert.alert("Error", "La captura fue interrumpida.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFillObject} ref={cameraRef} />
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={[styles.captureBtn, isProcessing && styles.btnDisabled]} 
          onPress={takePicture}
          disabled={isProcessing}
        >
          {isProcessing ? <ActivityIndicator color="#000" /> : <View style={styles.innerBtn} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  textCenter: { textAlign: 'center', color: 'white', padding: 20 },
  btnAction: { backgroundColor: '#2563eb', padding: 15, marginHorizontal: 50, borderRadius: 10, alignItems: 'center' },
  overlay: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  innerBtn: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#000' }
});

export default CameraScreen;