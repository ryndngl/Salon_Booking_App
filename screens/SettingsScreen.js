// screens/SettingsScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, signOut } from 'firebase/auth'; // Import for Firebase Auth
import { useNavigation } from '@react-navigation/native'; // Import for navigation

export default function SettingsScreen() {
  const auth = getAuth();
  const navigation = useNavigation();

  // handleLogout function - Moved from HomeScreen.js
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
      // Navigate back to Login screen and clear navigation history
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout Error:', error.message);
      Alert.alert('Logout Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Settings</Text>
        <Text style={styles.subtitle}>
          Manage your app settings and account here.
        </Text>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e8f5e9', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#28a745', // Green color
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30, // Add margin bottom for spacing
  },
  logoutButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#dc3545', // Red color for logout
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
