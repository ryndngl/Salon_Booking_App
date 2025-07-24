import React, { useState, useEffect } from 'react';
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
import { services } from './servicesData';
import { getAuth } from 'firebase/auth';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setDisplayName(currentUser.displayName || 'Boss');
    } else {
      setDisplayName('Boss');
    }
  }, []);

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
   {/* Header Card */}
<View style={styles.headerContainer}>
  <View style={styles.headerLeft}>
    <Icon name="person-circle-outline" size={70} color="#555" style={styles.profileIcon} />
    <View>
      <Text style={styles.headerGreeting}>Welcome back! </Text>
      <Text style={styles.headerName}>{displayName}</Text>
    </View>
  </View>
  <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
  <View style={{ position: 'relative' }}>
    <Icon name="notifications" size={31} color="#f56a79" />
    <View style={styles.notifBadge} />
  </View>
</TouchableOpacity>
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
headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 40,
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
  searchBar: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingLeft: 45,
    paddingRight: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderColor: '#D4D4D4',
    borderWidth: 1,
    marginBottom: 20,
    color: '#000',
    elevation: 2,

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
    borderColor: '#D4D4D4',
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
