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

 const isHairCut = service.name.trim().toLowerCase() === 'hair cut';

const filteredStyles = service.styles.filter((style) => {
  if (isHairCut) {
    return style.category === selectedCategory;
  }
  return true; // show all styles for non-haircut services
});

console.log('Filtered styles:', filteredStyles);


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

    return (
      <View
        key={index}
        style={hasMultipleImages ? styles.footSpaCard : styles.card}
      >
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
              <Image source={style.image} style={styles.image} />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.styleName}>{style.name}</Text>
          {/* Optional subtitle for Foot Spa */}
          {hasMultipleImages && (
            <Text style={styles.footSpaSubtitle}>with Manicure and Pedicure</Text>
          )}
          <Text style={styles.price}>₱{style.price}</Text>

          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={() => goToBooking(style)}
          >
            <Text style={styles.bookNowButtonText}>Book Now</Text>
          </TouchableOpacity>
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
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Image source={selectedImage} style={styles.fullscreenImage} resizeMode="contain" />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
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
  cardContent: {
    padding: 10,
    alignItems: 'center',
  },
  styleName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d10000',
    marginTop: 4,
    textAlign: 'center',
  },
  bookNowButton: {
    marginTop: 12,
    backgroundColor: '#007d3f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  // Modal styles
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
  // Custom Foot Spa Card styles
  footSpaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
  },
  footSpaImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  footSpaImage: {
    width: (screenWidth - 64) / 3,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  footSpaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  footSpaSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },
});
