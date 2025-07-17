// screens/LoginScreen.js
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground, KeyboardAvoidingView, Platform, Image, ActivityIndicator,
} from 'react-native';

// Firebase imports
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// Expo Google Auth Session imports
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser'; 

// Tandaan: Ang 'WebBrowser.maybeCompleteAuthSession();' ay dapat nasa pinaka-umpisa ng iyong App.js file.

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth();

  // Direktang ipapasa ang LITERAL na string ng tamang Expo proxy redirect URI.
  // Ito ang URI na nakarehistro sa Google Cloud Console para sa iyong Web application client ID.
  const expoRedirectUri = 'https://auth.expo.io/@ryandingle01/SalonBookingApp';

  // Your Web Client ID from Google Cloud Console
  const googleWebClientId = '365428725051-kmjh4jtck7n6kgs4etn8vvscj5228a56.apps.googleusercontent.com';

  // We are no longer using Google.useAuthRequest directly for the prompt
  // Instead, we will construct the Google OAuth URL manually and use WebBrowser.openAuthSessionAsync
  // The 'request' and 'response' objects from Google.useAuthRequest are not directly used here for the prompt,
  // but we keep the hook for consistency with Firebase credential handling if needed in future.
  const [request, response, promptAsync] = Google.useAuthRequest({
    // ITO ANG INAYOS! Dapat tugma sa googleWebClientId sa taas.
    webClientId: '365428725051-kmjh4jtck7n6kgs4etn8vvscj5228a56.apps.googleusercontent.com', 
    androidClientId: '365428725051-3sss7nglu1bqmv121dl8hcjk561rnm7a.apps.googleusercontent.com',
    iosClientId: '',
    // ITO RIN ANG INAYOS! Dapat tugma sa googleWebClientId sa taas.
    expoClientId: '365428725051-kmjh4jtck7n6kgs4etn8vvscj5228a56.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri: expoRedirectUri, 
    useProxy: true, 
  });

  useEffect(() => {
    console.log("DEBUG: useEffect - Google Auth Response Type:", response?.type);
    console.log("DEBUG: useEffect - Full Response Object:", response); 

    if (response?.type === 'success') {
      console.log("DEBUG: useEffect - Auth successful via Google.useAuthRequest response.");
      const { authentication } = response;
      if (authentication?.accessToken || authentication?.idToken) { 
        const credential = GoogleAuthProvider.credential(authentication.idToken || authentication.accessToken); 
        signInWithCredential(auth, credential)
          .then(() => {
            console.log('DEBUG: useEffect - Matagumpay na naka-log in gamit ang Google (Firebase).');
            navigation.replace('Home'); 
          })
          .catch((error) => {
            console.error("DEBUG: useEffect - Firebase signInWithCredential error:", error);
            let userFriendlyMessage = 'May problema sa Google Sign-In. Subukang muli.';
            switch (error.code) {
              case 'auth/invalid-credential':
                userFriendlyMessage = 'Invalid Google account credentials. Please try again.';
                break;
              case 'auth/account-exists-with-different-credential':
                userFriendlyMessage = 'Mayroon ka nang account gamit ang ibang paraan ng pag-sign in. Subukang mag-log in gamit ang email/password o ibang provider.';
                break;
              case 'auth/cancelled-popup-request':
                userFriendlyMessage = 'Kinansela ang Google Sign-In. Subukang muli.';
                break;
              default:
                userFriendlyMessage = 'Google Sign-In failed. ' + error.message;
            }
            Alert.alert("Error sa Google Sign-In", userFriendlyMessage);
          })
          .finally(() => {
            setIsSigningInWithGoogle(false);
          });
      } else {
        Alert.alert("Google Sign-In", "Authentication successful but no access token received.");
        setIsSigningInWithGoogle(false);
      }
    } else if (response?.type === 'cancel') {
      console.log("DEBUG: useEffect - Google Sign-In cancelled.");
      Alert.alert("Google Sign-In", "Kinansela ang Google Sign-In.");
      setIsSigningInWithGoogle(false);
    } else if (response?.type === 'error') {
      console.error("DEBUG: useEffect - Google Sign-In error response:", response.error);
      let userFriendlyMessage = 'May problema sa Google Sign-In. Subukang muli.';
      if (response.error && response.error.message) {
        userFriendlyMessage = 'Google Sign-In error: ' + response.error.message;
      }
      Alert.alert("Google Sign-In Error", userFriendlyMessage);
      setIsSigningInWithGoogle(false);
    }
  }, [response, auth, navigation]); 

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    setIsLoggingIn(true);
    setIsSigningInWithGoogle(false);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert('Success', 'Successfully logged in!');
      console.log('User logged in:', user.email);
      navigation.replace('Home');
    } catch (error) {
      let userFriendlyMessage = 'May hindi inaasahang error na naganap. Pakisubukan muli.';
      switch (error.code) {
        case 'auth/invalid-credential':
          userFriendlyMessage = 'Mali ang email o password. Pakisuri ang iyong credentials.';
          break;
        case 'auth/user-disabled':
          userFriendlyMessage = 'Ang iyong account ay na-disable. Pakikontak ang suporta.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          userFriendlyMessage = 'Mali ang email o password. Pakisuri ang iyong credentials.';
          break;
        case 'auth/invalid-email':
          userFriendlyMessage = 'Ang email address ay hindi valid.';
          break;
        case 'auth/network-request-failed':
          userFriendlyMessage = 'Walang koneksyon sa internet. Pakisuri ang iyong koneksyon.';
          break;
        default:
          userFriendlyMessage = 'Nabigo ang pag-login. ' + error.message;
      }
      Alert.alert('Login Error', userFriendlyMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // UPDATED: Manual Google Sign-in Flow (using hardcoded redirect URI with URLSearchParams)
  const handleGoogleSignIn = async () => {
    setIsSigningInWithGoogle(true);
    setIsLoggingIn(false);

    let result = null; 

    try {
      const params = new URLSearchParams({
        client_id: googleWebClientId,
        redirect_uri: expoRedirectUri,
        response_type: 'id_token', 
        scope: 'openid profile email', 
        nonce: Math.random().toString(36).substring(2),
        prompt: 'select_account' 
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

      console.log("DEBUG: handleGoogleSignIn - Constructed Google Auth URL:", authUrl);
      console.log("DEBUG: handleGoogleSignIn - Expected Expo Redirect URI:", expoRedirectUri);
      console.log("DEBUG: handleGoogleSignIn - Attempting to open WebBrowser...");

      result = await WebBrowser.openAuthSessionAsync(authUrl, expoRedirectUri); 
      console.log("DEBUG: handleGoogleSignIn - WebBrowser.openAuthSessionAsync result:", result);

      if (result.type === 'success' && result.url) {
        console.log("DEBUG: handleGoogleSignIn - WebBrowser session successful. Redirect URL:", result.url);
        const redirectUri = new URL(result.url);
        const idToken = redirectUri.searchParams.get('id_token');
        
        console.log("DEBUG: handleGoogleSignIn - Raw redirect URL search params:", redirectUri.search);
        console.log("DEBUG: handleGoogleSignIn - Retrieved id_token from URL:", idToken ? "Exists" : "Does NOT exist", idToken ? "Length: " + idToken.length : "");

        if (idToken) {
          console.log("DEBUG: handleGoogleSignIn - Attempting Firebase signInWithCredential with ID Token...");
          const credential = GoogleAuthProvider.credential(idToken);
          
          await signInWithCredential(auth, credential)
            .then(() => {
              console.log('DEBUG: handleGoogleSignIn - ✅ Matagumpay na naka-log in gamit ang Google (Firebase).');
              Alert.alert("Success", "Successfully logged in with Google!"); 
              navigation.replace('Home');
            })
            .catch((firebaseError) => {
              console.error("DEBUG: handleGoogleSignIn - Firebase signInWithCredential failed:", firebaseError);
              let userFriendlyMessage = 'May problema sa Firebase Google Sign-In. Subukang muli.';
              switch (firebaseError.code) {
                case 'auth/invalid-credential':
                  userFriendlyMessage = 'Invalid Google credential. Please ensure your Firebase project is correctly linked to Google Cloud project and Google Sign-In is enabled.';
                  break;
                case 'auth/account-exists-with-different-credential':
                  userFriendlyMessage = 'Mayroon ka nang account gamit ang ibang paraan ng pag-sign in. Subukang mag-log in gamit ang email/password o ibang provider.';
                  break;
                case 'auth/popup-closed-by-user':
                  userFriendlyMessage = 'Kinansela ang Google Sign-In popup.';
                  break;
                case 'auth/network-request-failed':
                  userFriendlyMessage = 'Walang koneksyon sa internet. Pakisuri ang iyong koneksyon.';
                  break;
                default:
                  userFriendlyMessage = `Firebase Sign-In failed: ${firebaseError.message}`;
              }
              Alert.alert("Google Sign-In Error", userFriendlyMessage);
            });
        } else {
          Alert.alert("Google Sign-In", "❌ Walang ID token na nakuha sa redirect URL. Pakisuri ang Google Cloud Console settings at OAuth consent screen.");
          console.error("DEBUG: handleGoogleSignIn - Redirect URL (no ID token):", result.url); 
        }
      } else if (result.type === 'cancel' || result.type === 'dismiss') {
        console.log("DEBUG: handleGoogleSignIn - WebBrowser session cancelled or dismissed.");
        Alert.alert("Google Sign-In", "❌ Kinansela ang Google Sign-In.");
      } else {
        console.error('DEBUG: handleGoogleSignIn - WebBrowser session error (unexpected type):', result); 
        Alert.alert('Google Sign-In Error', '❌ May problema sa Google Sign-In. Subukang muli.');
      }
    } catch (error) {
      console.error('DEBUG: handleGoogleSignIn - ❌ Overall Error initiating Google Sign-In:', error);
      Alert.alert('Google Sign-In Error', `❌ Hindi masimulan ang Google Sign-In. Error: ${error.message || 'Unknown error'}. Pakisubukan muli.`);
    } finally {
      setIsSigningInWithGoogle(false);
      console.log("DEBUG: handleGoogleSignIn - Finally block executed. isSigningInWithGoogle set to false.");
    }
  };

  const handleRegisterRedirect = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Feature to be implemented. Please contact support.');
  };

  const anyLoading = isLoggingIn || isSigningInWithGoogle;

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
              editable={!anyLoading}
            />

            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputField}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!anyLoading}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={anyLoading}
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

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton} disabled={anyLoading}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={anyLoading}>
              <Text style={styles.buttonText}>
                {isLoggingIn ? <ActivityIndicator color="#fff" /> : 'Log In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separatorLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, isSigningInWithGoogle && styles.disabledButton]}
              onPress={handleGoogleSignIn}
              disabled={isSigningInWithGoogle || isLoggingIn}
            >
              {isSigningInWithGoogle ? (
                <ActivityIndicator color="#4A148C" />
              ) : (
                <>
                  <Image
                    source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegisterRedirect} disabled={anyLoading}>
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
    backgroundColor: '#FCE4EC',
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
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
    color: '#4A148C',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#E0BBE4',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
    fontSize: 16,
    color: '#333',
  },
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
    paddingRight: 10,
  },
  passwordInputField: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
  },
  togglePasswordButton: {
    padding: 5,
  },
  togglePasswordIcon: {
    width: 24,
    height: 24,
    tintColor: '#888',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4A148C',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#FF80AB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#FF80AB',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
    backgroundColor: '#FFFFFF',
    borderColor: '#DDD',
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
    color: '#4A148C',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerText: {
    color: '#666',
    fontSize: 15,
    marginTop: 10,
  },
  registerLink: {
    color: '#4A148C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
