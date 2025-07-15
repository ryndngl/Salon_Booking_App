// screens/LoginScreen.js
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,ImageBackground, KeyboardAvoidingView, Platform, Image, ActivityIndicator,
} from 'react-native';

// Firebase imports
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// Expo Google Auth Session imports
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Mahalaga: Tawagin ito sa pinaka-umpisa ng iyong App.js file
// WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for overall loading indicator
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // Get the authentication service from the Firebase app
  // NOTE: Mas maganda kung ang 'auth' object ay ipapasa mula sa App.js
  // o i-export mula sa App.js at i-import dito, para isang beses lang ang initialization.
  const auth = getAuth();

  // Google Sign-In configuration
  // Ito ang iyong Web Client ID na ibinigay mo: 365428725051-5v4p9o87g503iopgqf93kqs9j1iivjc9.apps.googleusercontent.com
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '365428725051-5v4p9o87g503iopgqf93kqs9j1iivjc9.apps.googleusercontent.com',
    androidClientId: '', // Ilagay dito kung mayroon kang Android client ID
    iosClientId: '',     // Ilagay dito kung mayroon kang iOS client ID
    expoClientId: '365428725051-5v4p9o87g503iopgqf93kqs9j1iivjc9.apps.googleusercontent.com', // Kadalasan pareho sa webClientId
  });

  // useEffect hook para i-handle ang response mula sa Google authentication
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        setLoading(true); // Simulan ang loading
        const credential = GoogleAuthProvider.credential(authentication.accessToken);
        signInWithCredential(auth, credential)
          .then(() => {
            console.log('Matagumpay na naka-log in gamit ang Google!');
            // Ang onAuthStateChanged listener sa App.js ang magre-redirect sa Home.
            // Kung gusto mo ng instant redirect, maaari mong gamitin:
            // navigation.replace('Home');
          })
          .catch((error) => {
            console.error("Error sa Google sign-in with Firebase:", error);
            Alert.alert("Error sa Google Sign-In", error.message);
          })
          .finally(() => {
            setLoading(false); // Tapusin ang loading
          });
      }
    } else if (response?.type === 'cancel') {
      Alert.alert("Google Sign-In", "Kinansela ang Google Sign-In.");
    } else if (response?.type === 'error') {
      console.error("Google Sign-In Error Response:", response.error);
      Alert.alert("Google Sign-In Error", "May problema sa Google Sign-In. Subukang muli. Error: " + (response.error?.message || "Unknown error."));
    }
  }, [response]); // Ang effect na ito ay tatakbo lang kapag nagbago ang 'response' object

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    setLoading(true); // Start loading
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert('Success', 'Successfully logged in!');
      console.log('User logged in:', user.email);
      navigation.replace('Home');
    } catch (error) {
      const errorMessage = error.message;
      Alert.alert('Login Error', errorMessage);
      console.error('Login Error:', errorMessage);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleGoogleSignIn = async () => {
    // I-disable ang button kung walang request object (hindi pa ready ang auth session)
    if (!request) {
      Alert.alert("Google Sign-In", "Google Sign-In is not ready yet. Please try again.");
      return;
    }
    setLoading(true); // Start loading for Google Sign-In
    try {
      await promptAsync(); // Ito ang magbubukas ng browser para sa Google Sign-In
      // Ang response ay hahawakan ng useEffect hook
    } catch (error) {
      console.error('Error initiating Google Sign-In:', error);
      Alert.alert('Google Sign-In Error', 'Could not initiate Google Sign-In. Please try again.');
      setLoading(false); // End loading if initiation fails
    }
  };

  const handleRegisterRedirect = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Feature to be implemented. Please contact support.');
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
            <Text style={styles.headerText}>Welcome Back!</Text>
            <Text style={styles.title}>Login to Your Salon Account</Text>

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading} // Disable input when loading
            />

            {/* Password input with show/hide toggle */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputField}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword} // Toggle based on showPassword state
                value={password}
                onChangeText={setPassword}
                editable={!loading} // Disable input when loading
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowPassword(!showPassword)} // Toggle showPassword state
                disabled={loading}
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

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton} disabled={loading}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? <ActivityIndicator color="#fff" /> : 'Log In'}
              </Text>
            </TouchableOpacity>

            {/* Separator or "OR" text */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Sign in with Google Button */}
            <TouchableOpacity
              style={[styles.googleButton, (!request || loading) && styles.disabledButton]} // I-disable kung hindi ready ang request o kung loading
              onPress={handleGoogleSignIn}
              disabled={!request || loading} // I-disable kung hindi ready ang request o kung loading
            >
              {loading ? (
                <ActivityIndicator color="#4A148C" /> // Loading indicator sa Google button
              ) : (
                <>
                  <Image
                    source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }} // Google icon
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegisterRedirect} disabled={loading}>
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.registerLink}>Register here.</Text>
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
  // New styles for password input with toggle icon
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
  forgotPasswordButton: {
    alignSelf: 'flex-end', // Align to the right
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4A148C', // Deep purple
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#FF80AB', // Vibrant pink button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 55,
    backgroundColor: '#FFFFFF', // White background for Google button
    borderColor: '#DDD', // Light gray border
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#4A148C', // Deep purple text for consistency
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: { // Style for disabled buttons
    opacity: 0.6,
  },
  registerText: {
    color: '#666',
    fontSize: 15,
    marginTop: 10,
  },
  registerLink: {
    color: '#4A148C', // Deep purple for the link
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
