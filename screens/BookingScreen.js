import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useBooking } from '../context/BookingContext';

const BookingScreen = () => {
  const navigation = useNavigation();
  const { bookings } = useBooking();

  // Filter lang yung may paymentMethod
  const filteredBookings = bookings.filter(
    (item) => item.paymentMethod && item.name && item.date && item.time
  );

  // Remove duplicates
  const uniqueBookings = Array.from(
    new Map(
      filteredBookings.map((item) => [JSON.stringify(item), item])
    ).values()
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Bookings</Text>
      </View>
      <View style={styles.underline} />

      {/* Booking List */}
      {uniqueBookings.length > 0 ? (
        <FlatList
          data={uniqueBookings}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.detail}>Name: {item.name}</Text>
              <Text style={styles.detail}>Service: {item.serviceName}</Text>
              {item.category && (
                <Text style={styles.detail}>Category: {item.category}</Text>
              )}
              {item.style && (
                <Text style={styles.detail}>Style: {item.style}</Text>
              )}
              <Text style={styles.detail}>Date: {item.date}</Text>
              <Text style={styles.detail}>Time: {item.time}</Text>
              <Text style={styles.detail}>
                Payment Method: {item.paymentMethod}
              </Text>
              <Text style={styles.detail}>Price: ₱{item.price}</Text>
              {item.totalprice && (
                <Text style={styles.detail}>Total: ₱{item.totalprice}</Text>
              )}
              <Text style={styles.detail}>Status: {item.status}</Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have no bookings yet.</Text>
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
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    color: '#222',
  },
  underline: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fcebed',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
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
