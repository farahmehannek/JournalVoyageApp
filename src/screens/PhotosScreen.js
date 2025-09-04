import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const KEY = 'photos';

async function readPhotos() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function writePhotos(list) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export default function PhotosScreen() {
  const [items, setItems] = useState([]);

  const load = useCallback(async () => {
    const list = await readPhotos();
    setItems(list);
    console.log('Photos chargées:', list.length); // visible dans la console Metro
  }, []);

  // Recharge quand on entre sur l’onglet
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const deleteOne = (id) => {
    Alert.alert('Supprimer ?', 'Retirer cette photo du journal ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const next = items.filter(it => it.id !== id);
          setItems(next);
          await writePhotos(next);
        }
      }
    ]);
  };

  const clearAll = () => {
    if (items.length === 0) return;
    Alert.alert('Tout effacer ?', 'Supprimer toutes les entrées ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Effacer',
        style: 'destructive',
        onPress: async () => {
          setItems([]);
          await writePhotos([]);
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
      <Image source={{ uri: item.uri }} style={{ width: '100%', height: 220 }} />
      <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontWeight: '600' }}>{new Date(item.date).toLocaleString()}</Text>
          <Text style={{ opacity: 0.7 }}>
            Lat: {item?.coords?.lat?.toFixed?.(4)}   Lon: {item?.coords?.lon?.toFixed?.(4)}
          </Text>
        </View>
        <Pressable
          onPress={() => deleteOne(item.id)}
          style={{ backgroundColor: '#ef4444', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>Supprimer</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Petit compteur visuel pour debug */}
      <Text style={{ marginBottom: 8, opacity: 0.7 }}>Total photos: {items.length}</Text>

      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id ?? it.uri)}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', marginTop: 60 }}>
            <Text>Aucune photo enregistrée pour l’instant.</Text>
          </View>
        }
      />

      {items.length > 0 && (
        <Pressable
          onPress={clearAll}
          style={{ position: 'absolute', right: 16, bottom: 16, backgroundColor: '#ef4444',
                   paddingVertical: 12, paddingHorizontal: 16, borderRadius: 999 }}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>Tout effacer</Text>
        </Pressable>
      )}
    </View>
  );
}
