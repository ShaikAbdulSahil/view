/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from '../components/Carousel';
import Skeleton from '../components/Skeleton';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import FeatureStats from '../components/FeatureStats';
import { getCenters } from '../api/centers-api';
import { getCarousels } from '../api/carousel-api';
import { normalizeScreenName } from '../utils/navigationHelpers';
import { CarouselItem } from './Home';

type RootStackParamList = {
  Centers: { selectedCity?: string };
  MydentCenters: undefined;
};

type CentersRouteProp = RouteProp<RootStackParamList, 'Centers'>;

export default function Centers() {
  const route = useRoute<CentersRouteProp>();
  const [selectedCity, setSelectedCity] = useState('All');
  const [centers, setCenters] = useState<
    { cityName: string; imageUrl: string; clinic: any[]; _id: string }[]
  >([]);
  const [servicesMap, setServicesMap] = useState<
    Record<
      string,
      {
        _id: string;
        title: string;
        description: string;
        image: string;
      }[]
    >
  >({});
  const [bottomCarousel, setBottomCarousel] = useState<CarouselItem[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const [centersLoading, setCentersLoading] = useState(true);
  const [centersImagesLoaded, setCentersImagesLoaded] = useState(false);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [carouselImagesLoaded, setCarouselImagesLoaded] = useState(false);

  useEffect(() => {
    setCentersLoading(true);
    let mounted = true;
    getCenters()
      .then((res) => {
        if (!mounted) return;
        const fetchedCenters = res.data;

        // Create a map of cityName -> services[]
        const newServiceMap: typeof servicesMap = {};
        fetchedCenters.forEach((center: any) => {
          if (center.cityName && center.services) {
            newServiceMap[center.cityName] = center.services;
          }
        });

        const allOption = { cityName: 'All', imageUrl: '', clinic: [] };
        setCenters([allOption, ...fetchedCenters]);
        setServicesMap(newServiceMap);

        // Prefetch clinic and service images
        const clinicUrls: string[] = [];
        fetchedCenters.forEach((c: any) => {
          (c.clinic || []).forEach((cl: any) => {
            if (cl.clinicImage) clinicUrls.push(cl.clinicImage);
          });
          (c.services || []).forEach((s: any) => {
            if (s.image) clinicUrls.push(s.image);
          });
        });

        if (clinicUrls.length === 0) {
          setCentersImagesLoaded(true);
        } else {
          Promise.all(clinicUrls.map((u) => Image.prefetch(u)))
            .then(() => setCentersImagesLoaded(true))
            .catch((e) => {
              console.warn('Centers image prefetch failed', e);
              setCentersImagesLoaded(true);
            });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch centers:', err);
        setCentersImagesLoaded(true);
      })
      .finally(() => {
        if (mounted) setCentersLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // 👇 Scroll to top on tab focus
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      const selected = route.params?.selectedCity;
      if (selected) {
        setSelectedCity(selected);
      }
    }, [route.params?.selectedCity]),
  );

  useEffect(() => {
    setCarouselLoading(true);
    let mounted = true;
    const fetchCarousels = async () => {
      try {
        const res = await getCarousels();

        const items = res.data.home.bottomCarousel.map((img: any) => ({
          uri: img.imageUrl,
          type: img.type,
          group: 'home',
          navigateTo: normalizeScreenName(img.screenName) || 'DefaultScreen',
        }));
        if (!mounted) return;
        setBottomCarousel(items);

        const urls = (res.data.home.bottomCarousel || []).map((i: any) => i.imageUrl).filter(Boolean);
        if (urls.length === 0) {
          setCarouselImagesLoaded(true);
        } else {
          Promise.all(urls.map((u: string) => Image.prefetch(u)))
            .then(() => setCarouselImagesLoaded(true))
            .catch((e) => {
              console.warn('Carousel prefetch failed', e);
              setCarouselImagesLoaded(true);
            });
        }
      } catch (error) {
        console.error('Failed to load carousels:', error);
        setCarouselImagesLoaded(true);
      } finally {
        if (mounted) setCarouselLoading(false);
      }
    };

    fetchCarousels();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredClinics =
    selectedCity === 'All'
      ? centers.flatMap((city) => city.clinic)
      : centers.find((city) => city.cityName === selectedCity)?.clinic || [];

  return (
    <ScrollView
      ref={scrollRef}
      style={{
        flex: 1,
        backgroundColor: '#f9f9f9',
      }}
    >
      {(carouselLoading || !carouselImagesLoaded) ? (
        <Skeleton width={'100%'} height={200} radius={10} style={{ marginBottom: 10 }} />
      ) : (
        <Carousel images={bottomCarousel} />
      )}

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Discover your nearest mydent experience centre
        </Text>
        <Text style={styles.headerSubtitle}>
          Transform your smile with precision and passion guided by our trusted
          orthodontic experts
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cityTabs}
      >
        {centersLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={{ marginRight: 10 }}>
              <Skeleton width={90} height={36} radius={20} />
            </View>
          ))
        ) : (
          centers.map((city) => (
            <TouchableOpacity
              key={city._id || city.cityName}
              onPress={() => setSelectedCity(city.cityName)}
              style={[
                styles.cityButton,
                selectedCity === city.cityName && styles.activeCityButton,
              ]}
            >
              <Text
                style={[
                  styles.cityButtonText,
                  selectedCity === city.cityName && styles.activeCityButtonText,
                ]}
              >
                {city.cityName}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={{ padding: 16 }}>
        {(centersLoading || !centersImagesLoaded) ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <View key={idx} style={styles.card}>
              <Skeleton width={'100%'} height={180} radius={8} />
              <View style={styles.infoContainer}>
                <Skeleton width={'60%'} height={16} radius={4} style={{ marginBottom: 8 }} />
                <Skeleton width={'80%'} height={12} radius={4} style={{ marginBottom: 6 }} />
                <Skeleton width={'40%'} height={12} radius={4} />
              </View>
            </View>
          ))
        ) : filteredClinics.length > 0 ? (
          filteredClinics.map((clinic) => (
            <View key={clinic._id || clinic.clinicName} style={styles.card}>
              {clinic.clinicImage ? (
                <Image
                  source={{ uri: clinic.clinicImage }}
                  style={styles.image}
                  fadeDuration={0}
                  resizeMethod="resize"
                />
              ) : (
                <View style={[styles.image, { backgroundColor: '#f0f0f0' }]} />
              )}
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{clinic.clinicName}</Text>

                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    color="#ff4d4d"
                    size={18}
                  />
                  <Text style={styles.address}>{clinic.address}</Text>
                </View>

                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name="clock"
                    color="#ff4d4d"
                    size={18}
                  />
                  <Text style={styles.time}>
                    {clinic.timeFrom} - {clinic.timeTo}
                  </Text>
                </View>

                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name="phone"
                    color="#ff4d4d"
                    size={18}
                  />
                  <Text
                    style={styles.phone}
                    onPress={() =>
                      Linking.openURL(`tel:${clinic.centerNumber}`)
                    }
                  >
                    {clinic.centerNumber}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.directionButton}
                  onPress={() => {
                    if (clinic.directions) {
                      Linking.openURL(clinic.directions);
                    } else {
                      Alert.alert('No directions link available');
                    }
                  }}
                >
                  <MaterialCommunityIcons name="map" color="#fff" size={18} />
                  <Text style={styles.directionText}>Directions</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ padding: 16, color: '#888' }}>
            No clinics available in this city.
          </Text>
        )}
      </View>

      {/* Services Section */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <Text style={styles.servicesTitle}>
          Services available at our centre
        </Text>
        <Text style={styles.servicesSubtitle}>Exclusive discounts</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedCity !== 'All' && servicesMap[selectedCity]?.length > 0 ? (
            servicesMap[selectedCity].map((service) => (
              <View key={service._id} style={styles.serviceCard}>
                <Image source={{ uri: service.image }} style={styles.image} />
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ padding: 8, color: '#999' }}>
              {selectedCity === 'All'
                ? 'Select a city to view services.'
                : 'No services available for this city.'}
            </Text>
          )}
        </ScrollView>
      </View>
      <FeatureStats />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  cityTabs: {
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  cityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#eaeaea',
    borderRadius: 20,
  },
  activeCityButton: {
    backgroundColor: '#ff4d4d',
  },
  cityButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  activeCityButtonText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 180,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  address: {
    marginLeft: 6,
    flex: 1,
    color: '#555',
    fontSize: 14,
  },
  time: {
    marginLeft: 6,
    color: '#555',
    fontSize: 14,
  },
  phone: {
    marginLeft: 6,
    color: '#555',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  directionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  directionText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53935',
    marginBottom: 4,
  },
  servicesSubtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  serviceCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  serviceInfo: {
    padding: 8,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  serviceDescription: {
    fontSize: 12,
    color: '#666',
  },
});
