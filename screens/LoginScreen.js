// screens/LoginScreen.js
import { useState, useEffect } from "react";
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
  ActivityIndicator,
  Modal, // Added for the forgot password modal
  Pressable, // Added for the modal backdrop
} from "react-native";

// Firebase imports
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail, // Added for forgot password functionality
} from "firebase/auth";

// Expo Google Auth Session imports
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();
// Tandaan: Ang 'WebBrowser.maybeCompleteAuthSession();' ay dapat nasa pinaka-umpisa ng iyong App.js file.

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // New states for Forgot Password functionality
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);

  const auth = getAuth();

  // Direktang ipapasa ang LITERAL na string ng tamang Expo proxy redirect URI.
  // Ito ang URI na nakarehistro sa Google Cloud Console para sa iyong Web application client ID.
  const expoRedirectUri = "https://auth.expo.io/@ryandingle01/SalonBookingApp";

  // Your Web Client ID from Google Cloud Console
   const googleWebClientId =
    "365428725051-kmjh4jtck7n6kgs4etn8vvscj5228a56.apps.googleusercontent.com";

  // We are no longer using Google.useAuthRequest directly for the prompt
  // Instead, we will construct the Google OAuth URL manually and use WebBrowser.openAuthSessionAsync
  // The 'request' and 'response' objects from Google.useAuthRequest are not directly used here for the prompt,
  // but we keep the hook for consistency with Firebase credential handling if needed in future.
  const [request, response, promptAsync] = Google.useAuthRequest({
    // ITO ANG INAYOS! Dapat tugma sa googleWebClientId sa taas.
    webClientId:
      "365428725051-kmjh4jtck7n6kgs4etn8vvscj5228a56.apps.googleusercontent.com",
    androidClientId:
      "365428725051-3sss7nglu1bqmv121dl8hcjk561rnm7a.apps.googleusercontent.com",
    iosClientId: "",
    // ITO RIN ANG INAYOS! Dapat tugma sa googleWebClientId sa taas.
    expoClientId:
      "365428725051-kmjh4jtck7n6kgs4etn8vvscj5228a56.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    redirectUri: expoRedirectUri,
    useProxy: true,
  });

  useEffect(() => {
    console.log(
      "DEBUG: useEffect - Google Auth Response Type:",
      response?.type
    );
    console.log("DEBUG: useEffect - Full Response Object:", response);
    console.log("DEBUG: useEffect - Auth Request Object:", request);
    if (response?.type === "success") {
      console.log(
        "DEBUG: useEffect - Auth successful via Google.useAuthRequest response."
      );
      const { authentication } = response;
      if (authentication?.accessToken || authentication?.idToken) {
        const credential = GoogleAuthProvider.credential(
          authentication.idToken || authentication.accessToken
        );
        signInWithCredential(auth, credential)
          .then(() => {
            console.log(
              "DEBUG: useEffect - Successfully logged in with Google (Firebase)."
            );
            navigation.replace("MainTabs");
          })
          .catch((error) => {
            console.error(
              "DEBUG: useEffect - Firebase signInWithCredential error:",
              error
            );
            let userFriendlyMessage =
              "There was a problem with Google Sign-In. Please try again.";
            switch (error.code) {
              case "auth/invalid-credential":
                userFriendlyMessage =
                  "Invalid Google account credentials. Please try again.";
                break;
              case "auth/account-exists-with-different-credential":
                userFriendlyMessage =
                  "You already have an account using a different sign-in method. Try logging in using the same email/password or a different provider.";
                break;
              case "auth/cancelled-popup-request":
                userFriendlyMessage = "Google Sign-In canceled. Try again.";
                break;
              default:
                userFriendlyMessage = "Google Sign-In failed. " + error.message;
            }
            Alert.alert("Google Sign-In Error", userFriendlyMessage);
          })
          .finally(() => {
            setIsSigningInWithGoogle(false);
          });
      } else {
        Alert.alert(
          "Google Sign-In",
          "Authentication successful but no access token received."
        );
        setIsSigningInWithGoogle(false);
      }
    } else if (response?.type === "cancel") {
      console.log("DEBUG: useEffect - Google Sign-In cancelled.");
      Alert.alert("Google Sign-In", "Google Sign-In canceled");
      setIsSigningInWithGoogle(false);
    } else if (response?.type === "error") {
      console.error(
        "DEBUG: useEffect - Google Sign-In error response:",
        response.error
      );
      let userFriendlyMessage =
        "There was a problem with Google Sign-In. Try again..";
      if (response.error && response.error.message) {
        userFriendlyMessage = "Google Sign-In error: " + response.error.message;
      }
      Alert.alert("Google Sign-In Error", userFriendlyMessage);
      setIsSigningInWithGoogle(false);
    }
  }, [response, auth, navigation, request]);

  // function para sa Email/Password Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setIsLoggingIn(true);
    setIsSigningInWithGoogle(false);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      Alert.alert("Success", "Successfully logged in!");
      console.log("User logged in:", user.email);
      navigation.replace("MainTabs");
    } catch (error) {
      let userFriendlyMessage =
        "An unexpected error occurred. Please try again.";
      switch (error.code) {
        case "auth/invalid-credential":
          userFriendlyMessage =
            "Incorrect email or password. Please check your credentials.";
          break;
        case "auth/user-disabled":
          userFriendlyMessage =
            "Your account has been disabled. Please contact support.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          userFriendlyMessage =
            "Incorrect email or password. Please check your credentials..";
          break;
        case "auth/invalid-email":
          userFriendlyMessage = "The email address is invalid.";
          break;
        case "auth/network-request-failed":
          userFriendlyMessage =
            "There is no internet connection. Please check your connection.";
          break;
        default:
          userFriendlyMessage = "Login failed. " + error.message;
      }
      Alert.alert("Login Error", userFriendlyMessage);
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
        response_type: "id_token",
        scope: "openid profile email",
        nonce: Math.random().toString(36).substring(2),
        prompt: "select_account",
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

      console.log(
        "DEBUG: handleGoogleSignIn - Constructed Google Auth URL:",
        authUrl
      );
      console.log(
        "DEBUG: handleGoogleSignIn - Expected Expo Redirect URI:",
        expoRedirectUri
      );
      console.log(
        "DEBUG: handleGoogleSignIn - Attempting to open WebBrowser..."
      );

      result = await WebBrowser.openAuthSessionAsync(authUrl, expoRedirectUri);
      console.log(
        "DEBUG: handleGoogleSignIn - WebBrowser.openAuthSessionAsync result:",
        result
      );

      if (result.type === "success" && result.url) {
        console.log(
          "DEBUG: handleGoogleSignIn - WebBrowser session successful. Redirect URL:",
          result.url
        );
        const redirectUri = new URL(result.url);
        const idToken = redirectUri.searchParams.get("id_token");

        console.log(
          "DEBUG: handleGoogleSignIn - Raw redirect URL search params:",
          redirectUri.search
        );
        console.log(
          "DEBUG: handleGoogleSignIn - Retrieved id_token from URL:",
          idToken ? "Exists" : "Does NOT exist",
          idToken ? "Length: " + idToken.length : ""
        );

        if (idToken) {
          console.log(
            "DEBUG: handleGoogleSignIn - Attempting Firebase signInWithCredential with ID Token..."
          );
          const credential = GoogleAuthProvider.credential(idToken);

          await signInWithCredential(auth, credential)
            .then(() => {
              console.log(
                "DEBUG: handleGoogleSignIn - Successfully logged in with Google (Firebase)."
              );
              Alert.alert("Success", "Successfully logged in with Google!");
              navigation.replace("Home");
            })
            .catch((firebaseError) => {
              console.error(
                "DEBUG: handleGoogleSignIn - Firebase signInWithCredential failed:",
                firebaseError
              );
              let userFriendlyMessage =
                "There is a problem with Firebase Google Sign-In. Please try again.";
              switch (firebaseError.code) {
                case "auth/invalid-credential":
                  userFriendlyMessage =
                    "Invalid Google credential. Please ensure your Firebase project is correctly linked to Google Cloud project and Google Sign-In is enabled.";
                  break;
                case "auth/account-exists-with-different-credential":
                  userFriendlyMessage =
                    "You already have an account using a different sign-in method. Try logging in using the same email/password or a different provider.";
                  break;
                case "auth/popup-closed-by-user":
                  userFriendlyMessage = "Google Sign-In popup canceled.";
                  break;
                case "auth/network-request-failed":
                  userFriendlyMessage =
                    "There is no internet connection. Please check your connection.";
                  break;
                default:
                  userFriendlyMessage = `Firebase Sign-In failed: ${firebaseError.message}`;
              }
              Alert.alert("Google Sign-In Error", userFriendlyMessage);
            });
        } else {
          Alert.alert(
            "Google Sign-In",
            "No ID token was obtained from the redirect URL. Please check the Google Cloud Console settings and OAuth consent screen."
          );
          console.error(
            "DEBUG: handleGoogleSignIn - Redirect URL (no ID token):",
            result.url
          );
        }
      } else if (result.type === "cancel" || result.type === "dismiss") {
        console.log(
          "DEBUG: handleGoogleSignIn - WebBrowser session cancelled or dismissed."
        );
        Alert.alert("Google Sign-In", "Google Sign-In canceled.");
      } else {
        console.error(
          "DEBUG: handleGoogleSignIn - WebBrowser session error (unexpected type):",
          result
        );
        Alert.alert(
          "Google Sign-In Error",
          "There was a problem with Google Sign-In. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "DEBUG: handleGoogleSignIn -  Overall Error initiating Google Sign-In:",
        error
      );
      Alert.alert(
        "Google Sign-In Error",
        `Unable to start Google Sign-In.. Error: ${
          error.message || "Unknown error"
        }. Please try again.`
      );
    } finally {
      setIsSigningInWithGoogle(false);
      console.log(
        "DEBUG: handleGoogleSignIn - Finally block executed. isSigningInWithGoogle set to false."
      );
    }
  };

  const handleRegisterRedirect = () => {
    navigation.navigate("Register");
  };

  // UPDATED: handleForgotPassword to show modal
  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
    setForgotPasswordEmail(email); // Pre-fill with current email if available
  };

  // NEW: Function to send password reset email
  const sendResetEmail = async () => {
    if (!forgotPasswordEmail) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setIsSendingPasswordReset(true);
    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      Alert.alert(
        "Password Reset",
        `A password reset link has been sent to ${forgotPasswordEmail}. Please check your inbox and spam folder.`
      );
      setShowForgotPasswordModal(false); // Close modal on success
      setForgotPasswordEmail(""); // Clear email input
    } catch (error) {
      let userFriendlyMessage =
        "Failed to send password reset email. Please try again.";
      switch (error.code) {
        case "auth/invalid-email":
          userFriendlyMessage = "The email address is not valid.";
          break;
        case "auth/user-not-found":
          userFriendlyMessage =
            "There is no user record corresponding to this email address. It may have been deleted.";
          break;
        case "auth/network-request-failed":
          userFriendlyMessage =
            "No internet connection. Please check your connection.";
          break;
        default:
          userFriendlyMessage = `Error: ${error.message}`;
      }
      Alert.alert("Password Reset Error", userFriendlyMessage);
    } finally {
      setIsSendingPasswordReset(false);
    }
  };

  const anyLoading =
    isLoggingIn || isSigningInWithGoogle || isSendingPasswordReset;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={{
          uri: "https://placehold.co/700x1200/FCE4EC/880E4F?text=Salon+Background",
        }}
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
                      ? "https://img.icons8.com/material-outlined/24/000000/visible--v1.png"
                      : "https://img.icons8.com/material-outlined/24/000000/invisible--v1.png",
                  }}
                  style={styles.togglePasswordIcon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordButton}
              disabled={anyLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={anyLoading}
            >
              {isLoggingIn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separatorLine} />
            </View>

            <TouchableOpacity
              style={[
                styles.googleButton,
                isSigningInWithGoogle && styles.disabledButton,
              ]}
              onPress={handleGoogleSignIn}
              disabled={isSigningInWithGoogle || isLoggingIn}
            >
              {isSigningInWithGoogle ? (
                <ActivityIndicator color="#4A148C" />
              ) : (
                <>
                  <Image
                    source={{
                      uri: "https://img.icons8.com/color/48/000000/google-logo.png",
                    }}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleButtonText}>
                    Sign in with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRegisterRedirect}
              disabled={anyLoading}
            >
              <Text style={styles.registerText}>
                Don't have an account?{" "}
                <Text style={styles.registerLink}>Register here.</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Forgot Password Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showForgotPasswordModal}
        onRequestClose={() => setShowForgotPasswordModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowForgotPasswordModal(false)} // Close modal when pressing outside
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalDescription}>
              Enter your email address to receive a password reset link.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={forgotPasswordEmail}
              onChangeText={setForgotPasswordEmail}
              editable={!isSendingPasswordReset}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={sendResetEmail}
              disabled={isSendingPasswordReset}
            >
              {isSendingPasswordReset ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text> // Dito mo ilagay ang style
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setShowForgotPasswordModal(false)}
              disabled={isSendingPasswordReset}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCE4EC",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 5,
    color: "#880E4F",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#4A148C",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 55,
    borderColor: "#E0BBE4",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#F8F8F8",
    fontSize: 16,
    color: "#333",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 55,
    borderColor: "#E0BBE4",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#F8F8F8",
    paddingRight: 10,
  },
  passwordInputField: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
  },
  togglePasswordButton: {
    padding: 5,
  },
  togglePasswordIcon: {
    width: 24,
    height: 24,
    tintColor: "#888",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#4A148C",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#FF80AB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#FF80AB",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 16,
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 55,
    backgroundColor: "#FFFFFF",
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
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
    color: "#4A148C",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerText: {
    color: "#666",
    fontSize: 15,
    marginTop: 10,
  },
  registerLink: {
    color: "#4A148C",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  // Styles for the Forgot Password Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
  },
  modalContent: {
    width: "85%",
    maxWidth: 350,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4A148C",
  },
  modalDescription: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF80AB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#FF80AB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalCancelButton: {
    backgroundColor: "#E0E0E0",
    shadowColor: "transparent",
    elevation: 0,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  modalCancelButtonText: {
    color: "#4A148C",
    fontSize: 17,
    fontWeight: "bold",
  },
});
