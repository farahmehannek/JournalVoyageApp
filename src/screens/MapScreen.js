import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'photos';

export default function MapScreen() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem(KEY);
      const list = raw ? JSON.parse(raw) : [];
      const withCoords = list.filter(p => p?.coords?.lat && p?.coords?.lon);
      setPhotos(withCoords);
    };
    load();
  }, []);

  if (photos.length === 0) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <Text>Aucune photo géolocalisée trouvée.</Text>
      </View>
    );
  }

  const first = photos[0];

  return (
    <View style={{ flex: 1 }}>
      <MapLibreGL.MapView
        style={{ flex: 1 }}
        styleURL="https://demotiles.maplibre.org/style.json"
      >
        <MapLibreGL.Camera
          zoomLevel={12}
          centerCoordinate={[first.coords.lon, first.coords.lat]}
        />

        {photos.map(p => (
          <MapLibreGL.PointAnnotation
            key={String(p.id)}
            id={String(p.id)}
            coordinate={[p.coords.lon, p.coords.lat]}
          >
            <View style={{ backgroundColor: 'white', padding: 4, borderRadius: 4 }}>
              <Image source={{ uri: p.uri }} style={{ width: 40, height: 40, borderRadius: 6 }} />
            </View>
          </MapLibreGL.PointAnnotation>
        ))}
      </MapLibreGL.MapView>
    </View>
  );
}
