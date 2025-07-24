import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { services } from './servicesData'; // servicesData = with styles and images

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const testimonials = [
    { id: 1, name: 'Ryan Laurence D.', feedback: 'Loved my new style!' },
    { id: 2, name: 'Joyce-Ann T.', feedback: 'Very professional team.' },
    { id: 3, name: 'Liam Lerio', feedback: 'Pagupit na kayo dito mga Gooding' },
    { id: 4, name: 'Malupiton', feedback: 'Solid dito Bossing' },
  ];

  const displayServices = [
    { name: 'Hair Cut', image: require('../assets/OurServicesImage/haircut.webp') },
    { name: 'Hair Color', image: require('../assets/OurServicesImage/haircolor.webp') },
    { name: 'Hair Treatment', image: require('../assets/OurServicesImage/hairtreatment.webp') },
    { name: 'Rebond & Forms', image: require('../assets/OurServicesImage/rebondandforms.webp') },
    { name: 'Nail Care', image: require('../assets/OurServicesImage/nailcare.webp') },
    { name: 'Foot Spa', image: require('../assets/OurServicesImage/footspa.webp') },
  ];

  const filteredServices = services
    .map((service) => {
      const query = searchQuery.toLowerCase();
      const isServiceMatch = service.name.toLowerCase().includes(query);
      const matchingStyles = service.styles.filter((style) =>
        style.name.toLowerCase().includes(query)
      );

      if (isServiceMatch || matchingStyles.length > 0) {
        return {
          name: service.name,
          image: displayServices.find((d) => d.name === service.name)?.image,
        };
      }

      return null;
    })
    .filter(Boolean);

  const matchingStyleCards = services.flatMap((service) =>
    service.styles
      .filter((style) =>
        style.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((style) => ({
        ...style,
        serviceName: service.name,
      }))
  );

  const handleServicePress = (serviceName) => {
    const selectedService = services.find((s) => s.name === serviceName);
    if (selectedService) {
      navigation.navigate('ServiceDetailScreen', { service: selectedService });
    } else {
      Alert.alert('Coming Soon', `${serviceName} services are still being prepared.`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome back, Boss!</Text>
          <Icon name="notifications-outline" size={29} color="#000" />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Pamper Yourself Today!</Text>
          <Text style={[styles.bannerText, { fontSize: 14, marginTop: 5 }]}>
            Book your favorite salon service now.
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.servicesTitle}>Our Services</Text>

        {/* Search Bar */}
        <View style={{ position: 'relative', marginBottom: 20 }}>
          <Icon
            name="search-outline"
            size={20}
            color="#888"
            style={{ position: 'absolute', top: 12, left: 15, zIndex: 1 }}
          />
          <TextInput
            placeholder="Search services or styles..."
            placeholderTextColor="#aaa"
            style={styles.searchBar}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Show search result cards if there's query */}
        {searchQuery && matchingStyleCards.length > 0 ? (
          <View style={styles.servicesContainer}>
            {matchingStyleCards.map((style, index) => (
              <View key={index} style={styles.serviceCard}>
                <Image
                  source={style.image}
                  style={styles.serviceImage}
                  resizeMode="cover"
                />
                <View style={styles.serviceLabelContainer}>
                  <Text style={styles.serviceText}>{style.name}</Text>
                  <Text style={{ color: '#555', fontSize: 13, marginTop: 4 }}>₱{style.price}</Text>
                  <TouchableOpacity
                    style={{
                      marginTop: 8,
                      backgroundColor: '#00802b',
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                    }}
                    onPress={() =>
                      navigation.navigate('BookingFormScreen', {
                        serviceName: style.serviceName,
                        styleName: style.name,
                        stylePrice: style.price,
                      })
                    }
                  >
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>
                      Book Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <>
            <View style={styles.servicesContainer}>
              {filteredServices.length === 0 ? (
                <View style={styles.noResultContainer}>
                  <Text style={styles.noResultIcon}>😕</Text>
                  <Text style={styles.noResultText}>No results found.</Text>
                  <Text style={styles.noResultSubtext}>Try searching with a different keyword.</Text>
                </View>
              ) : (
                filteredServices.map((service, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.serviceCard}
                    onPress={() => handleServicePress(service.name)}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={service.image}
                      style={styles.serviceImage}
                      resizeMode="cover"
                    />
                    <View style={styles.serviceLabelContainer}>
                      <Text style={styles.serviceText}>{service.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        )}

        {/* Testimonials */}
        <Text style={styles.testimonialTitle}>What Our Clients Say</Text>
        {testimonials.map((item, index) => (
          <View key={index} style={styles.testimonialCard}>
            <Text style={styles.testimonialName}>{item.name}</Text>
            <Text style={styles.testimonialMessage}>{item.feedback}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 130,
    paddingTop: 27,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerText: {
    fontSize: 20,
    color: '#111',
    fontWeight: '600',
  },
  banner: {
    backgroundColor: '#d13f3f',
    height: 160,
    marginVertical: 20,
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
  searchBar: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingLeft: 45,
    paddingRight: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderColor: '#d13f3f',
    borderWidth: 1.5,
    marginBottom: 20,
    color: '#000',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    position: 'relative',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    height: 210,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#eee',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  serviceImage: {
    width: '100%',
    height: '65%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#f2f2f2',
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
  noResultContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  noResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  noResultSubtext: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  
});

export default HomeScreen;
