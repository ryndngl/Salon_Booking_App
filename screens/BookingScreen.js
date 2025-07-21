// screens/BookingScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function BookingScreen() {
  const navigation = useNavigation(); // Get navigation object

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFDAB9', '#FFC0CB', '#E0BBE4']} // Same gradient as HomeScreen
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#4A148C" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Book an Appointment</Text>
          <Text style={styles.subtitle}>
            Choose your preferred service, date, and time.
          </Text>

          {/* TODO: Dito mo ilalagay ang booking form, date/time pickers, etc. */}
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>
              Booking form and details will go here.
            </Text>
          </View>

          <TouchableOpacity style={styles.bookNowButton}>
            <Text style={styles.bookNowButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1, // Ensure button is on top
    padding: 5,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 20, // Adjust for back button
  },
  subtitle: {
    fontSize: 16,
    color: '#880E4F',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  placeholderBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0BBE4',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  bookNowButton: {
    width: '80%',
    height: 55,
    backgroundColor: '#FF80AB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF80AB',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
});
