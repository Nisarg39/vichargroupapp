import React, { useEffect } from 'react';
import { View, Image, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);
  const slideAnim = new Animated.Value(0);

  useEffect(() => {
    // Ensure splash screen shows for the full animation duration
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Start animation sequence
    Animated.sequence([
      // First fade and scale the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        })
      ]),
      // Then slide the entire splash screen to the left
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX: slideAnim }]
      }}
    >
      <LinearGradient
        colors={['#1a5fb4', '#ffffff', '#ffffff', '#1a5fb4']}
        locations={[0, 0.3, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Animated.Image 
          source={require('../assets/images/vicharLogo.png')}
          style={{ 
            width: width * 0.5,
            height: width * 0.5,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }}
          resizeMode="contain"
        />
        <ActivityIndicator 
          style={{ position: 'absolute', bottom: height * 0.2 }}
          size="large" 
          color="#0066cc" 
        />
      </LinearGradient>
    </Animated.View>
  );
};

export default SplashScreen;