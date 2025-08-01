import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { services } from './servicesData';
import BigServiceCard from '../components/cards/BigServiceCard';
import { getAuth } from 'firebase/auth';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [displayName, setDisplayName] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setDisplayName(currentUser?.displayName || 'Boss');
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setFilteredStyles([]);
        return;
      }

      const results = services.flatMap(service =>
        service.styles
          .filter(style =>
            style.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(style => ({
            ...style,
            serviceName: service.name,
          }))
      );

      setFilteredStyles(results);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const displayServices = [
    { name: 'Hair Cut', image: require('../assets/OurServicesImage/haircut.webp') },
    { name: 'Hair Color', image: require('../assets/OurServicesImage/haircolor.webp') },
    { name: 'Hair Treatment', image: require('../assets/OurServicesImage/hairtreatment.webp') },
    { name: 'Rebond & Forms', image: require('../assets/OurServicesImage/rebondandforms.webp') },
    { name: 'Nail Care', image: require('../assets/OurServicesImage/nailcare.webp') },
    { name: 'Foot Spa', image: require('../assets/OurServicesImage/footspa.webp') },
  ];

  const testimonials = [
    { id: 1, name: 'Ryan Laurence D.', feedback: 'Loved my new style!' },
    { id: 2, name: 'Joyce-Ann T.', feedback: 'Very professional team.' },
    { id: 3, name: 'Liam Lerio', feedback: 'Pagupit na kayo dito mga Gooding' },
    { id: 4, name: 'Malupiton', feedback: 'Solid dito Bossing' },
  ];

  const handleServicePress = serviceName => {
    const selectedService = services.find(s => s.name === serviceName);
    if (selectedService) {
      navigation.navigate('ServiceDetailScreen', { service: selectedService });
    }
  };

  const renderNonSearchContent = () => (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Icon name="person-circle-outline" size={70} color="#555" style={styles.profileIcon} />
          <View>
            <Text style={styles.headerGreeting}>Welcome back!</Text>
            <Text style={styles.headerName}>{displayName}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
          <View style={{ position: 'relative' }}>
            <Icon name="notifications" size={31} color="#ffcc00" />
            <View style={styles.notifBadge} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>Pamper Yourself Today!</Text>
        <Text style={[styles.bannerText, { fontSize: 14, marginTop: 5 }]}>
          Book your favorite salon service now.
        </Text>
      </View>

      <Text style={styles.servicesTitle}>Our Services</Text>
      <View style={styles.servicesContainer}>
        {displayServices.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={styles.serviceCard}
            onPress={() => handleServicePress(service.name)}
            activeOpacity={0.85}>
            <Image source={service.image} style={styles.serviceImage} resizeMode="cover" />
            <View style={styles.serviceLabelContainer}>
              <Text style={styles.serviceText}>{service.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.testimonialTitle}>What Our Clients Say</Text>
      {testimonials.map((item, index) => (
        <View key={index} style={styles.testimonialCard}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <Text style={styles.testimonialMessage}>{item.feedback}</Text>
        </View>
      ))}
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 20, backgroundColor: '#fff', zIndex: 1 }}>
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search styles or services..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Icon name="close-circle" size={20} color="#aaa" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        keyboardShouldPersistTaps="handled"
        data={searchQuery.trim() !== '' ? filteredStyles : []}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={searchQuery.trim() !== '' ? { gap: 16 } : null}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 130,
          paddingTop: 20,
          gap: 12,
        }}
        ListHeaderComponent={searchQuery.trim() === '' ? renderNonSearchContent : null}

        renderItem={({ item }) => (
           <BigServiceCard
           styleData={item}
           onImagePress={() => openImageModal(item.image)}
           onBookPress={() =>
           navigation.navigate('BookingFormScreen', {
           serviceName: item.serviceName,
           styleName: item.name,
          stylePrice: item.price,
               })
             }
          />
       )}

        ListEmptyComponent={
          searchQuery.trim() !== '' && filteredStyles.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
              No results found.
            </Text>
          ) : null
        }
      />

      {/* Fullscreen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <Image source={selectedImage} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;


// styles unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 130,
    paddingTop: 27,
  },
  searchBarWrapper: {
    marginBottom: 20,
  },
 searchBarContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 20,
  paddingHorizontal: 14,
  height: 48,
  marginTop: 45,
  borderWidth: 1,
  borderColor: '#D4D4D4',
  elevation: 3,
},
searchIcon: {
  marginRight: 8,
  color: '#d13f3f',
},
clearIcon: {
  marginLeft: 8,
  color: '#999',
},
searchInput: {
  flex: 1,
  fontSize: 16,
  color: '#000',
  paddingVertical: 10,
},

searchResultsSection: {
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    borderColor: '#D4D4D4',
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 12,
  },
  headerGreeting: {
    fontSize: 16,
    color: '#777',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  banner: {
    backgroundColor: '#d13f3f',
    height: 160,
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  servicesTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: '#d13f3f',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  serviceCard: {
    width: '48%',
    height: 210,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    elevation: 3,
    alignItems: 'center',
  },
  serviceImage: {
    width: '100%',
    height: '65%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  serviceLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  serviceText: {
    color: '#d13f3f',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  testimonialTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#d13f3f',
    marginBottom: 12,
    textAlign: 'center',
  },
  testimonialCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderColor: '#D4D4D4',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
    color: '#333',
  },
  testimonialMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
