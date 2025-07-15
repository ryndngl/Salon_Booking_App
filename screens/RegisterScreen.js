// screens/RegisterScreen.js
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image, // Import Image for the eye icon
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  // Get the authentication service from the Firebase app
  const auth = getAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required information.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Password and confirmation password do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    try {
      // Attempt to register using Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      Alert.alert("Success", "Account created successfully!");
      console.log("User registered:", user.email);
      // Redirect to Login screen after successful registration
      navigation.navigate("Login");
    } catch (error) {
      // If there's a registration error, display the error message
      const errorMessage = error.message;
      Alert.alert("Registration Error", errorMessage);
      console.error("Registration Error:", errorMessage);
    }
  };

  const handleLoginRedirect = () => {
    // Redirect to Login screen
    navigation.navigate("Login");
  };

  return (
    // KeyboardAvoidingView helps prevent the keyboard from obscuring input fields
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ImageBackground can be used for a subtle background image or a color overlay */}
      <ImageBackground
        source={{ uri: 'https://placehold.co/700x1200/FCE4EC/880E4F?text=Salon+Background' }} // Placeholder image, replace with a real salon image
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Main content wrapper */}
          <View style={styles.card}>
            <Text style={styles.headerText}>Join Our Salon Community!</Text>
            <Text style={styles.title}>Create Your Account</Text>

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password Input with show/hide toggle */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputField}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword} // Toggle based on showPassword state
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowPassword(!showPassword)} // Toggle showPassword state
              >
                <Image
                  source={{
                    uri: showPassword
                      ? 'https://img.icons8.com/material-outlined/24/000000/visible--v1.png' // Eye open icon
                      : 'https://img.icons8.com/material-outlined/24/000000/invisible--v1.png' // Eye closed icon
                  }}
                  style={styles.togglePasswordIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input with show/hide toggle */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputField}
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirmPassword} // Toggle based on showConfirmPassword state
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle showConfirmPassword state
              >
                <Image
                  source={{
                    uri: showConfirmPassword
                      ? 'https://img.icons8.com/material-outlined/24/000000/visible--v1.png' // Eye open icon
                      : 'https://img.icons8.com/material-outlined/24/000000/invisible--v1.png' // Eye closed icon
                  }}
                  style={styles.togglePasswordIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            {/* Login Redirect Link */}
            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Login here.</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCE4EC', // Light pink background for a salon feel
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%', // Adjusted width for better mobile display
    maxWidth: 400, // Max width for larger screens
    backgroundColor: '#fff',
    borderRadius: 20, // More rounded corners for a softer look
    padding: 30,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15, // Android shadow
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
    color: '#880E4F', // Darker pink/maroon for salon theme
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4A148C', // Deep purple for elegance
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 55, // Slightly taller input fields
    borderColor: '#E0BBE4', // Light purple border
    borderWidth: 1,
    borderRadius: 10, // Rounded input fields
    paddingHorizontal: 20,
    marginBottom: 15, // Reduced margin for a tighter look
    backgroundColor: '#F8F8F8', // Off-white input background
    fontSize: 16,
    color: '#333',
  },
  // Styles for password input with toggle icon (reused from LoginScreen)
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderColor: '#E0BBE4',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
    paddingRight: 10, // Add padding for the icon
  },
  passwordInputField: {
    flex: 1, // Take up remaining space
    height: '100%',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    // No border here as the container has it
  },
  togglePasswordButton: {
    padding: 5,
  },
  togglePasswordIcon: {
    width: 24,
    height: 24,
    tintColor: '#888', // Make the icon color subtle
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#FF80AB', // Vibrant pink button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Added margin top for button
    marginBottom: 25,
    shadowColor: '#FF80AB', // Pink shadow for button
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.5, // Slightly spaced letters
  },
  loginText: {
    color: '#666',
    fontSize: 15,
    marginTop: 10,
  },
  loginLink: {
    color: '#4A148C', // Deep purple for the link
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
