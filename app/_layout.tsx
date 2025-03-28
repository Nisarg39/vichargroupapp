import './globals.css';
import { Stack, useRouter } from "expo-router";
import { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";


// Create an auth context to share the state and setter
export const AuthContext = createContext({
  isSignedIn: false,
  setIsSignedIn: (value: boolean) => {},
});

export default function RootLayout() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const [loaded, error] = useFonts({
    'BADABB': require('../assets/fonts/BADABB.ttf'),
    'Tektur': require('../assets/fonts/Tektur-Bold.ttf'),
  });

  useEffect(() => {
    // Check stored auth state on mount
    const checkAuthState = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem("isSignedIn");
        setIsSignedIn(storedAuth === "true");
      } catch (error) {
        console.error("Error reading auth state:", error);
      } finally {
        setIsLoading(false); // Set loading to false when done
      }
    };

    if(!loaded){
      checkAuthState();
    }
  }, []);

  // Use useEffect to redirect based on auth state and store it
  useEffect(() => {
    // Only redirect if we're not in loading state
    if (!isLoading) {
      const storeAuthState = async () => {
        try {
          await AsyncStorage.setItem("isSignedIn", String(isSignedIn));
        } catch (error) {
          console.error("Error storing auth state:", error);
        }
      };
      storeAuthState();

      if (isSignedIn) {
        router.replace("/[drawer]/[tabs]/home");
      } else {
        router.replace("/signin");
      }
    }
  }, [isSignedIn, router, isLoading]);
  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
      }}
    >
      <Stack initialRouteName={isSignedIn ? "[drawer]" : "signin"}>
        <Stack.Screen name="[drawer]" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen
          name="notifications"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </AuthContext.Provider>
  );
}

