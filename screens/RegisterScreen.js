// screens/RegisterScreen.js// screens/RegisterScreen.js
import { useState } from "react";
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
  Image,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState(""); // 👈 NEW: name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const auth = getAuth();

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth, email, password
      );

      // ✅ Update displayName with full name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      Alert.alert("Success", `Welcome, ${fullName}! Your account has been created.`);
      console.log("User registered:", userCredential.user.email);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
      console.error("Registration Error:", error.message);
    }
  };

  const handleLoginRedirect = () => {
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={{ uri: 'https://placehold.co/700x1200/FCE4EC/880E4F?text=Salon+Background' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Create Your Account</Text>

            {/* ✅ Full Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
            />

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

            {/* Password Input */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputField}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={{
                    uri: showPassword
                      ? 'https://img.icons8.com/material-outlined/24/000000/visible--v1.png'
                      : 'https://img.icons8.com/material-outlined/24/000000/invisible--v1.png'
                  }}
                  style={styles.togglePasswordIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputField}
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Image
                  source={{
                    uri: showConfirmPassword
                      ? 'https://img.icons8.com/material-outlined/24/000000/visible--v1.png'
                      : 'https://img.icons8.com/material-outlined/24/000000/invisible--v1.png'
                  }}
                  style={styles.togglePasswordIcon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

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
    borderColor: '#666',
    elevation: 2, // Android shadow
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
    color: '#880E4F', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#d13f3f', 
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 55, // Slightly taller input fields
    borderColor: '#666', // Light purple border
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
    borderColor: '#666',
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
    backgroundColor: '#4CAF50', // Vibrant pink button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Added margin top for button
    marginBottom: 25,
    borderColor: '#d13f3f', 
    elevation: 3,
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
    color: '#d13f3f', // Deep purple for the link
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
