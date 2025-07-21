// ServiceDetailScreen
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ServiceDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { service } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{service.name}</Text>
      {service.styles.map((style, index) => (
        <View key={index} style={styles.card}>
          <Image source={style.image} style={styles.image} />
          <Text style={styles.styleName}>{style.name}</Text>
        </View>
      ))}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('BookingScreen', { serviceName: service.name })}
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ServiceDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  card: {
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  styleName: {
    fontSize: 18,
    padding: 8,
    color: '#000',
  },
  bookButton: {
    backgroundColor: '#7a0000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
