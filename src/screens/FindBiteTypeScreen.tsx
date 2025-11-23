/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { getCarousels } from '../api/carousel-api';
import Carousel from '../components/Carousel';
import { CarouselItem } from './Home';
import VIDEO_1 from '../../assets/static_assets/VIDEO_1.png';
import VIDEO_2 from '../../assets/static_assets/VIDEO_2.png';
import VIDEO_3 from '../../assets/static_assets/VIDEO_3.png';
import VIDEO_4 from '../../assets/static_assets/VIDEO_4.png';
import VIDEO_5 from '../../assets/static_assets/VIDEO_5.png';
import VIDEO_6 from '../../assets/static_assets/VIDEO_6.png';
import VIDEO_7 from '../../assets/static_assets/VIDEO_7.png';
import VIDEO_8 from '../../assets/static_assets/VIDEO_8.png';
import VIDEO_9 from '../../assets/static_assets/VIDEO_9.png';


const categories = [
  { title: 'Under bite', icon: VIDEO_1 },
  { title: 'Open bite', icon: VIDEO_2 },
  { title: 'Crooked teeth', icon: VIDEO_3 },
  { title: 'Gap teeth', icon: VIDEO_4 },
  {
    title: 'Deep bite',
    icon: VIDEO_5,
  },
  {
    title: 'Cross bite',
    icon: VIDEO_6,
  },
  {
    title: 'Forwardly placed teeth',
    icon: VIDEO_7,
  },
  {
    title: 'Teeth Spacings',
    icon: VIDEO_8,
  },
  { title: 'Jaw correction', icon: VIDEO_9 },
];

export default function FindBiteTypeScreen({ navigation }: any) {
  const [carousel, setCarousel] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const res = await getCarousels();
        setCarousel(
          res.data.biteTypeCarousel.map((img: any) => ({
            uri: img.imageUrl,
            type: img.type,
            group: 'biteType',
            navigateTo: img.screenName || 'DefaultScreen',
          })),
        );
      } catch (error) {
        console.error('Failed to load carousels:', error);
      }
    };

    fetchCarousels();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Carousel images={carousel} />

      {/* Section Title */}
      <Text style={styles.sectionTitle}>
        Discover your bite type and See the transformation
      </Text>

      {/* Grid */}
      <View style={styles.grid}>
        {categories.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.card}
            onPress={() =>
              navigation.navigate('BiteTypeVideosScreen', { title: item.title })
            }
          >
            <Image source={{ uri: item.icon }} style={styles.icon} fadeDuration={0} resizeMethod="resize" />
            <Text style={styles.label}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },

  label: {
    textAlign: 'center',
    fontSize: 12,
  },
});
