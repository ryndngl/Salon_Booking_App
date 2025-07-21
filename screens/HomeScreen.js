//HomeScreen.js
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const services = [
    { name: 'Hair Cut', image: require('../assets/OurServicesImage/haircut.webp') },
    { name: 'Hair Color', image: require('../assets/OurServicesImage/haircolor.webp') },
    { name: 'Nail Care', image: require('../assets/OurServicesImage/nailcare.webp') },
    { name: 'Hair Treatment', image: require('../assets/OurServicesImage/hairtreatment.webp') },
    { name: 'Rebond & Forms', image: require('../assets/OurServicesImage/rebondandforms.webp') },
    { name: 'Foot Spa', image: require('../assets/OurServicesImage/footspa.webp') },
  ];

  const handleServicePress = (serviceName) => {
  if (serviceName === 'Hair Cut') {
    navigation.navigate('ServiceDetailScreen', {
      service: {
        name: 'Hair Cut',
        styles: [
          { name: 'Fade', image: require('../assets/Haircut/fade.webp') },
          { name: 'Layered', image: require('../assets/Haircut/layered.webp') },
          { name: 'Trim', image: require('../assets/Haircut/trim.webp') },
        ],
      },
    });
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
          <Icon name="notifications-outline" size={24} color="#000" />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={{ color: '#fff' }}>Banner Image Here</Text>
        </View>

        {/* Our Services */}
        <Text style={styles.servicesTitle}>Our Services</Text>
        <View style={styles.servicesContainer}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviceCard}
              onPress={() => handleServicePress(service.name)}
              activeOpacity={0.8}
            >
              <Image source={service.image} style={styles.serviceImage} resizeMode="cover" />
              <View style={styles.serviceLabelContainer}>
                <Text style={styles.serviceText}>{service.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 130,
    paddingTop: 27,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  headerText: {
    fontSize: 20,
    color: '#000',
    fontWeight: '600',
  },
  banner: {
    backgroundColor: '#000000',
    height: 150,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  servicesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '47%',
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  serviceImage: {
    width: '100%',
    height: '70%',
  },
  serviceLabelContainer: {
    flex: 1,
    backgroundColor: '#7a0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
});

export default HomeScreen;
