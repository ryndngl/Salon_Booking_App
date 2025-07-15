HomeScreen.js

// screens/HomeScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  // Get the auth instance
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      // Attempt to log out using Firebase
      await signOut(auth);
      console.log('User logged out');
      // Redirect to Login screen after logout
      navigation.replace('Login');
    } catch (error) {
      // If there's a logout error
      console.error('Logout Error:', error.message);
      Alert.alert('Logout Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Van's Glow up Salon</Text>
      <Text style={styles.title}>Welcome Home, User!</Text>
      <Text style={styles.subtitle}>This is your main dashboard.</Text>

      {/* Button for logout */}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#dc3545', // Red color for logout
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
