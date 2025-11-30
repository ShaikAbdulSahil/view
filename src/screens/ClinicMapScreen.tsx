import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Skeleton from '../components/Skeleton';

export default function ClinicMapScreen() {
  const [MapView, setMapView] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-maps').then((maps) => {
        setMapView(() => maps.default);
        setMarker(() => maps.Marker);
      });
    }
  }, []);

  const clinicLocation = {
    latitude: 28.6139,
    longitude: 77.209,
  };

  const clinicAddress = 'MyDent Clinic, Connaught Place, New Delhi - 110001';
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1753.6574034695534!2d77.2089776!3d28.6139394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36a73f0f1b%3A0x33cfb9aa12d14bb9!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001%2C%20India!5e0!3m2!1sen!2sin!4v1715060640000!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            onLoad={() => setMapLoaded(true)}
          ></iframe>
        ) : MapView && Marker ? (
          <>
            <MapView
              style={styles.map}
              initialRegion={{
                ...clinicLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onMapReady={() => setMapLoaded(true)}
            >
              <Marker coordinate={clinicLocation} title="Our Clinic" />
            </MapView>
            {!mapLoaded && (
              <View style={styles.mapOverlay} pointerEvents="none">
                <Skeleton width={'100%'} height={300} radius={8} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Skeleton width={'100%'} height={300} radius={8} />
          </View>
        )}
        {/* If using iframe, show skeleton until onLoad fires */}
        {Platform.OS === 'web' && !mapLoaded && (
          <View style={styles.mapOverlay} pointerEvents="none">
            <Skeleton width={'100%'} height={300} radius={8} />
          </View>
        )}
      </View>

      <Text style={styles.addressTitle}>Clinic Address:</Text>
      <Text style={styles.addressText}>{clinicAddress}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { position: 'relative', width: '100%', height: 300 },
  map: { width: '100%', height: 300 },
  mapPlaceholder: { width: '100%', height: 300, justifyContent: 'center', alignItems: 'center' },
  mapOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 300, justifyContent: 'center', alignItems: 'center' },
  addressTitle: { fontSize: 16, fontWeight: '600', margin: 12 },
  addressText: { fontSize: 14, marginHorizontal: 12, color: '#555' },
});