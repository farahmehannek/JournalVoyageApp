
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Demande les permissions Caméra + Localisation (fine + coarse) */
async function requestPermissions() {
  if (Platform.OS === 'android') {
    const cam = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (cam !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Permission caméra refusée');
    }

    const coarse = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );
    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (
      coarse !== PermissionsAndroid.RESULTS.GRANTED &&
      fine !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      throw new Error('Permission localisation refusée');
    }
  }
}

/** Essaie d'obtenir une position avec plusieurs stratégies et délais */
function getLocationSmart() {
  const getPos = (opts) =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, opts);
    });

  // 1) Haute précision (jusqu'à 20s)
  const highAcc = getPos({
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
  });

  // 2) Fallback précision normale (jusqu'à 15s)
  const lowAcc = () =>
    getPos({
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 0,
    });

  // 3) Dernière position connue (jusqu'à 60 min d'âge, 5s de timeout)
  const lastKnown = () =>
    getPos({
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 60 * 60 * 1000,
    });

  return highAcc
    .catch(() => lowAcc())
    .catch(() => lastKnown());
}

async function savePhotoEntry(entry) {
  const key = 'photos';
  const raw = await AsyncStorage.getItem(key);
  const list = raw ? JSON.parse(raw) : [];
  list.unshift(entry);
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

export default function CameraScreen() {
  const [preview, setPreview] = useState(null);

  const takePhoto = async () => {
    try {
      await requestPermissions();

      const res = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: false,
        includeBase64: false,
        quality: 0.9,
      });

      if (res.didCancel) return;
      if (res.errorCode) throw new Error(res.errorMessage || res.errorCode);

      const asset = res.assets?.[0];
      if (!asset?.uri) throw new Error('Aucune image');

      // Récupérer la position GPS avec fallback
      const position = await getLocationSmart();

      const entry = {
        id: Date.now().toString(),
        uri: asset.uri,
        date: new Date().toISOString(),
        coords: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
      };

      await savePhotoEntry(entry);
      setPreview(entry.uri);
      Alert.alert(
        'Photo enregistrée',
        `Lat: ${entry.coords.lat.toFixed(4)}, Lon: ${entry.coords.lon.toFixed(4)}`
      );
    } catch (e) {
      Alert.alert('Erreur', String(e.message || e));
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 16 }}>
      {preview ? (
        <Image source={{ uri: preview }} style={{ width: 260, height: 380, borderRadius: 12 }} />
      ) : (
        <Text style={{ opacity: 0.7 }}>Aucune photo pour l’instant</Text>
      )}
      <Pressable
        onPress={takePhoto}
        style={{ backgroundColor: '#0a84ff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>📷 Prendre une photo</Text>
      </Pressable>
    </View>
  );
}
