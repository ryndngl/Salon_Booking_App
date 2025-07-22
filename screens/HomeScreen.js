// Updated HomeScreen.js with layout: Banner, Our Services, Book Now, Testimonials
import {View, Text,StyleSheet,TouchableOpacity,ScrollView,SafeAreaView,Image,Alert,TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { services } from './servicesData';

 const HomeScreen = () => {
  const navigation = useNavigation();
        const testimonials = [
    { id: 1, name: 'Ryan Laurence D.', feedback: 'Loved my new style!' },
    { id: 2, name: 'Joyce-Ann T.', feedback: 'Very professional team.' },
    { id: 3, name: 'Liam Lerio', feedback: 'Pagupit na kayo dito mga Gooding' },
    { id: 4, name: 'Malupiton', feedback: 'Solid dito Bossing' },
    
  ];

  const handleServicePress = (serviceName) => {
  const selectedService = services.find(s => s.name === serviceName);

  if (selectedService) {
    navigation.navigate('ServiceDetailScreen', {
      service: selectedService,
    });
  } else {
    Alert.alert('Coming Soon', `${serviceName} services are still being prepared.`);
  }
};
   const displayServices = [
    { name: 'Hair Cut', image: require('../assets/OurServicesImage/haircut.webp') },
    { name: 'Hair Color', image: require('../assets/OurServicesImage/haircolor.webp') },
    { name: 'Hair Treatment', image: require('../assets/OurServicesImage/hairtreatment.webp') },
    { name: 'Rebond & Forms', image: require('../assets/OurServicesImage/rebondandforms.webp') },
    { name: 'Nail Care', image: require('../assets/OurServicesImage/nailcare.webp') },
    { name: 'Foot Spa', image: require('../assets/OurServicesImage/footspa.webp') },
  ];

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
          <Text style={[styles.bannerText, { fontSize: 14, marginTop: 5 }]}>Book your favorite salon service now.</Text>
        </View>

        {/* Our Services */}
        <Text style={styles.servicesTitle}>Our Services</Text>

        {/* Optional: Search Bar */}
        <TextInput
          placeholder="Search services..."
          placeholderTextColor="#aaa"
          style={styles.searchBar}
        />

        <View style={styles.servicesContainer}>
          {displayServices.map((service, index) => (
           <TouchableOpacity
             key={index}
             style={styles.serviceCard}
             onPress={() => handleServicePress(service.name)}
            activeOpacity={0.85}
           >
            <Image source={service.image} style={styles.serviceImage} resizeMode="cover" />
            <View style={styles.serviceLabelContainer}>
            <Text style={styles.serviceText}>{service.name}</Text>
           </View>
          </TouchableOpacity>
        ))}
        </View>

        {/* Book Now CTA */}
        <TouchableOpacity style={styles.bookNowCard}>
          <Text style={styles.bookNowText}>Ready for a new look?</Text>
          <Text style={styles.bookNowSubText}>Tap here to book your appointment now!</Text>
        </TouchableOpacity>

        {/* Customer Testimonials */}
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
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '47%',
    height: 170,
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
  },
  serviceImage: {
    width: '100%',
    height: '70%',
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
  },
  serviceText: {
    color: '#d13f3f',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bookNowCard: {
    backgroundColor: '#009900',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 25,
  },
  bookNowText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  bookNowSubText: {
    fontSize: 14,
    color: '#eee',
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
});

export default HomeScreen;
