import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const BookingSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const bookingDetails = route.params?.bookingDetails || {
    name: 'Juan Dela Cruz',
    serviceName: 'Hair Cut',
    category: 'Men',
    style: 'Fade',
    date: '2025-07-25',
    time: '2:30 PM',
    paymentmethod: 'Gcash, Cash on Service, Card',
    price: 0,
    status: 'pending',
  };

  const handleEdit = () => {
    navigation.goBack();
  };

  const handleProceed = () => {
    navigation.navigate('PaymentMethodScreen', { bookingDetails });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Booking Summary</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{bookingDetails.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Service Name:</Text>
          <Text style={styles.value}>{bookingDetails.serviceName}</Text>
        </View>

        {bookingDetails.category ? (
          <View style={styles.row}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{bookingDetails.category}</Text>
          </View>
        ) : null}

        {bookingDetails.style ? (
          <View style={styles.row}>
            <Text style={styles.label}>Style:</Text>
            <Text style={styles.value}>{bookingDetails.style}</Text>
          </View>
        ) : null}

        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{bookingDetails.date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{bookingDetails.time}</Text>
        </View>

        <View style={[styles.row, { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 10, paddingTop: 10 }]}>
          <Text style={styles.label}>Estimated Price:</Text>
          <Text style={[styles.value, { fontWeight: 'bold', color: '#333' }]}>₱{bookingDetails.price}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default BookingSummaryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 200,
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#222',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
  },
  proceedButton: {
    flex: 1,
    marginLeft: 10,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  proceedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
