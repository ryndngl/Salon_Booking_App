import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const PaymentMethodScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();

  const handleConfirm = () => {
    if (!selectedMethod) {
      Alert.alert("Please select a payment method");
      return;
    }

    Alert.alert("Booking Confirmed", `Payment method: ${selectedMethod}`);

    // Later: navigation.navigate('BookingConfirmationScreen', {...route.params, paymentMethod: selectedMethod });
  };

  const paymentOptions = [
    {
      key: 'GCash',
      label: 'GCash',
      icon: <FontAwesome5 name="wallet" size={22} color="#6c5ce7" />,
    },
    {
      key: 'Cash on Service',
      label: 'Cash on Service',
      icon: <Ionicons name="cash" size={22} color="#00b894" />,
    },
    {
      key: 'Card',
      label: 'Credit/Debit Card',
      icon: <Ionicons name="card-outline" size={22} color="#0984e3" />,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Choose Payment Method</Text>

      {paymentOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.card,
            selectedMethod === option.key && styles.cardSelected,
          ]}
          onPress={() => setSelectedMethod(option.key)}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            {option.icon}
            <Text style={styles.cardText}>{option.label}</Text>
          </View>
          {selectedMethod === option.key && (
            <Ionicons name="checkmark-circle" size={22} color="#2ecc71" />
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2d3436',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardSelected: {
    borderColor: '#6c5ce7',
    backgroundColor: '#f3f0ff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3436',
  },
  button: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
