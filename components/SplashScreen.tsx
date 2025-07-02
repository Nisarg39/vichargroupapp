import React, { useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);
  const slideAnim = new Animated.Value(0);

  useEffect(() => {
    // Add your splash screen animation logic here
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

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
    <View style={styles.container}>
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim }
          ]
        }
      ]}>
        <Text style={styles.title}>Vichar Group</Text>
        <ActivityIndicator size="large" color="#1CB0F6" style={styles.loader} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1CB0F6',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;