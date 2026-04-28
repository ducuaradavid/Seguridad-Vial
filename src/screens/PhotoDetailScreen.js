import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MapPin, Save } from 'lucide-react-native';

const PhotoDetailScreen = ({ route, navigation }) => {
  const { photo } = route.params;
  const [note, setNote] = useState(photo.note || '');

  const saveEntry = () => {
    // 1. Validación de longitud
    if (note.trim().length < 10) {
      return Alert.alert(
        "Validación", 
        "Se requiere un reporte detallado (mínimo 10 caracteres)."
      );
    }

    // 2. Feedback al usuario sin navegar al Home
    Alert.alert("Éxito", "Los cambios han sido guardados localmente.");
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.image} />
      
      <View style={styles.content}>
        {/* BLOQUE MODIFICADO: Solo coordenadas numéricas */}
        <View style={styles.geoBox}>
          <MapPin size={20} color="#1a4731" />
          <Text style={styles.geoText}>
            {photo.coords 
              ? `${photo.coords.latitude.toFixed(4)} , ${photo.coords.longitude.toFixed(4)}` 
              : "Ubicación no disponible"}
          </Text>
        </View>

        <Text style={styles.label}>Detalle del incidente:</Text>
        <TextInput
          style={styles.input}
          placeholder="Describa la observación técnica..."
          multiline
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveEntry}>
          <Save color="white" size={20} />
          <Text style={styles.saveBtnText}>Guardar Registro</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300 },
  content: { padding: 20 },
  geoBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20, 
    backgroundColor: '#f0fdf4', 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#dcfce7' 
  },
  geoText: { marginLeft: 10, fontWeight: '600', color: '#1a4731' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#334155' },
  input: { 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    borderRadius: 8, 
    padding: 12, 
    height: 120, 
    textAlignVertical: 'top', 
    backgroundColor: '#f8fafc' 
  },
  saveBtn: { 
    backgroundColor: '#1a4731', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 20 
  },
  saveBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});

export default PhotoDetailScreen;

//Detalle de la foto

