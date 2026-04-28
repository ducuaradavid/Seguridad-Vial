import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Plus, Lock, FileText } from 'lucide-react-native';

const HomeScreen = ({ navigation, route }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // 1. Caso: Nuevo registro desde la cámara
    if (route.params?.newLog) {
      const newEntry = { 
        id: Date.now().toString(), 
        ...route.params.newLog,
        note: '' 
      };
      setLogs(prev => [newEntry, ...prev]);
      navigation.setParams({ newLog: undefined });
    }

    // 2. Caso: Actualizar registro (Clonación de estado)
    if (route.params?.updatedLog) {
      const { id, note } = route.params.updatedLog;
      
      setLogs(prevLogs => 
        prevLogs.map(item => 
          item.id === id 
            ? { ...item, note: note } // Clonamos el ítem con la nueva nota
            : item                    // Mantenemos el resto igual
        )
      );
      
      navigation.setParams({ updatedLog: undefined });
    }
  }, [route.params?.newLog, route.params?.updatedLog]);

  const openSecureGallery = async (item) => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verifica identidad para acceder a la bitácora',
      });
      if (result.success) {
        navigation.navigate('PhotoDetail', { photo: item });
      }
    } catch (e) { Alert.alert("Error", "Autenticación fallida"); }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Sin registros. Presiona + para capturar.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openSecureGallery(item)}>
            <Image source={{ uri: item.uri }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Registro de Evento</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
              
              {/* Visualización del dato guardado */}
              <View style={styles.notePreview}>
                <FileText size={14} color="#64748b" />
                <Text style={styles.cardNote} numberOfLines={1}>
                  {item.note ? item.note : "Sin descripción técnica..."}
                </Text>
              </View>

              <View style={styles.lockBadge}><Lock size={12} color="#fff" /><Text style={styles.lockText}>Protegido</Text></View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Camera')}>
        <Plus color="#FFF" size={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 15 },
  empty: { textAlign: 'center', marginTop: 50, color: '#64748b' },
  card: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 15, elevation: 2, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  cardImage: { width: '100%', height: 120 },
  cardContent: { padding: 12 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#1a4731' },
  cardDate: { color: '#64748b', fontSize: 12 },
  notePreview: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 5 },
  cardNote: { color: '#64748b', fontSize: 13, fontStyle: 'italic' },
  lockBadge: { flexDirection: 'row', backgroundColor: '#ca8a04', alignSelf: 'flex-start', padding: 4, borderRadius: 4, marginTop: 8 },
  lockText: { color: 'white', fontSize: 10, marginLeft: 4, fontWeight: 'bold' },
  fab: { position: 'absolute', right: 25, bottom: 25, backgroundColor: '#1a4731', width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});

export default HomeScreen;