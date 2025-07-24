import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';


const GetStartedScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.replace('Login'); // 🔁 replace para hindi na makabalik sa get started
  };
  return (
    <LinearGradient
      colors={['#f8bbd0', '#ce93d8', '#ba68c8']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animatable.View animation="fadeInDown" delay={200} duration={1200}>
          <MaterialCommunityIcons
            name="face-woman-shimmer"
            size={90}
            color="#fff"
            style={styles.icon}
          />
        </Animatable.View>

        <Animatable.Text
          animation="fadeInUp"
          delay={600}
          duration={1200}
          style={styles.title}
        >
          Van's Glow-Up Salon
        </Animatable.Text>

        <ShimmerPlaceholder
          visible={true}
          style={styles.subtitleShimmer}
          shimmerStyle={{ borderRadius: 10 }}
        >
          <Animatable.Text
            animation="fadeIn"
            delay={1000}
            duration={1200}
            style={styles.subtitle}
          >
            Glow with Confidence
          </Animatable.Text>
        </ShimmerPlaceholder>

        <Animatable.View animation="bounceIn" delay={1500}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </LinearGradient>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fce4ec',
    textAlign: 'center',
    marginBottom: 50,
  },
  subtitleShimmer: {
    width: 200,
    height: 20,
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#ba68c8',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
