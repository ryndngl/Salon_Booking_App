import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const GetStartedScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Elegant Header Text */}
        <Animatable.View animation="fadeInDown" delay={200} style={styles.headerWrapper}>
          <Text style={styles.brand}>Van’s Glow Up Salon</Text>
          <Text style={styles.tagline}>Beauty made personal</Text>
        </Animatable.View>

        {/* Main Image */}
        <Animatable.Image
          animation="fadeInUp"
          delay={400}
          source={require('../assets/Salon Banner.webp')}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Description */}
        <Animatable.View animation="fadeInUp" delay={600} style={styles.textContainer}>
          <Text style={styles.subtitle}>
            Step into elegance, where every detail is crafted for your glow.
          </Text>
        </Animatable.View>

        {/* Get Started Button */}
        <Animatable.View animation="bounceInUp" delay={800} style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </View>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  headerWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#d13f3f',
    textAlign: 'center',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#d13f3f',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  image: {
    width: width * 0.9,
    height: height * 0.45,
    marginVertical: 20,
  },
  textContainer: {
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#d13f3f',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    marginTop: 40,
  },
  button: {
    backgroundColor: '#d13f3f',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
