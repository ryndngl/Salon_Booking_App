// App.js

// IMPORTANT: Ito ang kailangan mong ilagay sa pinaka-itaas ng file
// bago ang anumang React imports. Ito ay kritikal para sa expo-auth-session.
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

import  { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Animated, Dimensions, ImageBackground } from "react-native";

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTANT: Replace this firebaseConfig with your copied config from Firebase Console!
const firebaseConfig = {
  apiKey: "AIzaSyBAS409-zb6ET8ZQhSztD9pJNfHb3d5Mpk",
  authDomain: "salon-booking-app-2d85f.firebaseapp.com",
  projectId: "salon-booking-app-2d85f",
  storageBucket: "salon-booking-app-2d85f.firebasestorage.app",
  messagingSenderId: "365428725051",
  appId: "1:365428725051:web:49e45831f046fcbcac531e",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Import React Navigation components
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import your screen components
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

export default function App() {
  const [user, setUser] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false); // Bagong state para kontrolin ang overall app readiness

  // Animated value for the overall splash screen fade out
  const splashFadeOut = useRef(new Animated.Value(1)).current; // Nagsisimula sa fully opaque (1)

  useEffect(() => {
    let authUnsubscribe;
    let splashTimer;
    let firebaseLoaded = false; // Internal flag para sa Firebase loading status
    let splashAnimationTriggered = false; // Internal flag para sa splash animation status

    // Function na magche-check kung handa na ang app para mag-transition
    const checkAppReadiness = () => {
      // Mag-trigger ng fade out animation kapag parehong tapos na ang Firebase at ang minimum splash time
      if (firebaseLoaded && splashAnimationTriggered) {
        console.log("Firebase and minimum splash time met. Starting fade out.");
        Animated.timing(splashFadeOut, {
          toValue: 0, // Mag-fade out
          duration: 800, // Duration ng fade out
          useNativeDriver: true,
        }).start(() => {
          setIsAppReady(true); // Set app ready pagkatapos ng splash fade out animation
          console.log("App is ready! Transitioning to main content.");
        });
      }
    };

    // --- Firebase Auth State Listener ---
    authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("A user is logged in:", currentUser.email);
      } else {
        setUser(null);
        console.log("No user logged in (signed out)");
      }
      firebaseLoaded = true; // Firebase check is done
      console.log("Firebase loading finished.");
      checkAppReadiness(); // I-check kung handa na ang app
    });

    // --- Minimum Splash Screen Display Time & Animation Trigger ---
    // Ito ay magsisiguro na ang splash screen ay mananatili ng kahit ilang segundo
    const MIN_SPLASH_DISPLAY_TIME = 2000; // Minimum 2 seconds para makita ang image
    splashTimer = setTimeout(() => {
      splashAnimationTriggered = true; // Ang animation logic ay "na-trigger" pagkatapos ng delay na ito
      console.log("Minimum splash display time elapsed.");
      checkAppReadiness(); // I-check kung handa na ang app
    }, MIN_SPLASH_DISPLAY_TIME);

    // --- AsyncStorage Test (mula sa iyong original code) ---
    const testAsyncStorage = async () => {
      try {
        await AsyncStorage.setItem("myTestKey", "Hello from AsyncStorage!");
        const value = await AsyncStorage.getItem("myTestKey");
        console.log("AsyncStorage Test: Retrieved value:", value);
        if (value === "Hello from AsyncStorage!") {
          console.log("AsyncStorage is working correctly!");
        } else {
          console.warn("AsyncStorage Test: Value mismatch, might be an issue.");
        }
        await AsyncStorage.removeItem("myTestKey");
      } catch (e) {
        console.error("AsyncStorage Test Error:", e);
      }
    };
    testAsyncStorage();

    // Cleanup function
    return () => {
      if (authUnsubscribe) authUnsubscribe();
      if (splashTimer) clearTimeout(splashTimer);
    };
  }, []); // Runs only once on component mount

  // Render the splash screen if the app is not yet ready
  if (!isAppReady) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: splashFadeOut }]}>
        <ImageBackground
          source={require('./assets/BGIMG.jpg')} // Gamitin ang bagong image
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          {/* Walang text dito dahil kasama na sa image */}
        </ImageBackground>
      </Animated.View>
    );
  }

  // Render main app navigation kapag handa na ang app
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    // Walang background color, image na ang bahala
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Para kung may text ka pa rin na ilalagay, nasa gitna
    alignItems: 'center', // Para kung may text ka pa rin na ilalagay, nasa gitna
  },
  backgroundImageStyle: {
    resizeMode: 'cover', // Ensures the image covers the entire background
  },
  // Ang mga styles na ito ay mula sa iyong original App.js,
  // na maaaring gamitin sa ibang components o kung magbabago ang layout
  container: { // This style is not used by the splash screen
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
});
