import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const KEY = 'photos';

export default function ProfileScreen() {
  const [count, setCount] = useState(0);
  const [first, setFirst] = useState(null);
  const [last, setLast] = useState(null);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      const list = raw ? JSON.parse(raw) : [];
      setCount(list.length);
      if (list.length > 0) {
        setLast(new Date(list[0].date));                    // plus récente (on fait unshift côté caméra)
        setFirst(new Date(list[list.length - 1].date));     // plus ancienne
      } else {
        setLast(null);
        setFirst(null);
      }
    } catch (e) {
      console.warn('Erreur chargement profil:', e);
    }
  }, []);

  // 1) Charger au montage
  useEffect(() => {
    load();
  }, [load]);

  // 2) Recharger à chaque fois que l’onglet redevient visible
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  // 3) Bouton Actualiser déclenche le même chargement + petit feedback
  const onRefresh = async () => {
    await load();
    // (optionnel) petit retour visuel
    // Alert.alert('Profil', 'Données mises à jour ');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/220?img=47' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Farah</Text>
      <Text style={styles.info}>Voyageuse passionnée </Text>

      <View style={styles.stats}>
        <Text style={styles.statText}>
           <Text style={styles.bold}>Nombre de photos :</Text> {count}
        </Text>
        <Text style={styles.statText}>
           <Text style={styles.bold}>Première photo :</Text> {first ? first.toLocaleString() : '—'}
        </Text>
        <Text style={styles.statText}>
           <Text style={styles.bold}>Dernière photo :</Text> {last ? last.toLocaleString() : '—'}
        </Text>
      </View>

      <Pressable style={styles.button} onPress={onRefresh}>
        <Text style={styles.buttonText}>🔄 Actualiser</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: '700' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#da09cfff',
    padding: 20,
    gap: 12,
  },
  avatar: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  info: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 16,
  },
  stats: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
  },
  statText: {
    fontSize: 16,
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#0a84ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
