import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavorites } from "../context/FavoritesContext";

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;
const categories = ['Men', 'Women', 'Kids'];

const ServiceDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { service } = route.params;

  const [selectedCategory, setSelectedCategory] = useState('Men');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Check if service data is valid before proceeding
  if (!service || !service.name || !service.styles) {
    // Navigate back to the previous screen if service data is missing
    navigation.goBack();
    return null;
  }

  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Mas specific na conditional checks para mas malinaw
  const isHairCut = service.name.trim().toLowerCase() === 'hair cut';
  const isFootSpa = service.name.trim().toLowerCase() === 'foot spa';

  // Na-fix na filtering logic
  const filteredStyles = service.styles.filter((style) => {
    if (isHairCut) {
      // Filter by category only for 'Hair Cut'
      return style.category === selectedCategory;
    }
    // Para sa ibang services (Nail Care, Foot Spa), ibalik lahat ng styles
    return true;
  });

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const goToBooking = (style) => {
    navigation.navigate('BookingFormScreen', {
      serviceName: service.name,
      styleName: style.name,
      stylePrice: style.price,
    });
  };

  const cardStyle = isFootSpa? styles.fullWidthCard : styles.card;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{service.name}</Text>

        {isHairCut && (
          <View style={styles.tabs}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.tabButton,
                  selectedCategory === category && styles.activeTab,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedCategory === category && styles.activeTabText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.grid}>
          {filteredStyles.map((style, index) => {
            const hasMultipleImages = Array.isArray(style.images);
            const favorite = isFavorite(style.name);

            return (
              <View
                key={index}
                style={cardStyle}
              >
                {/* Image */}
                {hasMultipleImages ? (
                  <View style={styles.footSpaImagesContainer}>
                    {style.images.map((img, idx) => (
                      <TouchableOpacity key={idx} onPress={() => openImageModal(img)}>
                        <Image source={img} style={styles.footSpaImage} />
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => openImageModal(style.image)}>
                    <View style={styles.imageWrapper}>
                      <Image source={style.image} style={isHairCut ? styles.image : styles.fullWidthImage} />
                    </View>
                  </TouchableOpacity>
                )}

                {/* Card Content */}
                <View style={styles.cardContent}>
                  <View style={styles.namePriceRow}>
                    <Text style={styles.styleName}>{style.name}</Text>
                    <Text style={styles.price}>₱{style.price}</Text>
                  </View>

                  {style.description && (
                    <Text style={styles.description}>
                      {style.description}
                    </Text>
                  )}

                  <View style={styles.bottomRow}>
                    <TouchableOpacity
                      style={styles.heartButton}
                      onPress={() => toggleFavorite(style)}
                    >
                      <Ionicons
                        name={favorite ? "heart" : "heart-outline"}
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.bookNowButton}
                      onPress={() => goToBooking(style)}
                    >
                      <Text style={styles.bookNowButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={selectedImage}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ServiceDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingTop: 3,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#7a0000',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    color: '#7a0000',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    width: cardWidth,
    overflow: 'hidden',
    elevation: 5,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
  },
  fullWidthCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    width: '100%',
    overflow: 'hidden',
    elevation: 5,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
    alignSelf: 'center',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fullWidthImage: {
    width: '100%',
    height: 200, // Adjust height as needed
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
    flex: 1, 
    justifyContent: 'space-between', 
  },
  namePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  styleName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d10000',
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 18, 
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap:6,
  },
  heartButton: {
    backgroundColor: "#007d3f",
    padding: 6,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  bookNowButton: {
    backgroundColor: "#007d3f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    elevation: 1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  footSpaImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 8 ,
  },
  footSpaImage: {
    width: (screenWidth - 64) / 3,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});