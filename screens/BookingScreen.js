import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (route.params) {
      setBooking(route.params);
    }
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Booking</Text>
      </View>
      <View style={styles.underline} />

      {/* Content */}
      {booking ? (
        <View style={styles.card}>
          <Text style={styles.confirmation}>✅ Booking Confirmed!</Text>
          <Text style={styles.detail}>Service: {booking.service}</Text>
          <Text style={styles.detail}>Date: {booking.date}</Text>
          <Text style={styles.detail}>Time: {booking.time}</Text>
          <Text style={styles.detail}>Payment Method: {booking.paymentMethod}</Text>
          <Text style={styles.detail}>Status: {booking.status}</Text>
          {booking.price && (
            <Text style={styles.detail}>Total Price: {booking.price}</Text>
          )}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have no booking information.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    color: '#f56a79',
  },
  underline: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fcebed',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
  },
  confirmation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
    color: '#2d3436',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});
