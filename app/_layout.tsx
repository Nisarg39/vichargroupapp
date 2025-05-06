import './globals.css';
import { Stack, useRouter } from "expo-router";
import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { useFonts } from "expo-font";
import axios from 'axios';
import { StudentContext, StudentProvider } from './context/StudentContext';
import { useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Create an auth context to share the state and setter
export const AuthContext = createContext({
  isSignedIn: false,
  setIsSignedIn: (value: boolean) => {},
});

export default function RootLayout() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [loaded, error] = useFonts({
    'BADABB': require('../assets/fonts/BADABB.ttf'),
    'Tektur': require('../assets/fonts/Tektur-Bold.ttf'),
  });

  // Wrap the component content with StudentProvider
  return (
    <SafeAreaProvider>
      <StudentProvider>
        <RootLayoutContent 
          isSignedIn={isSignedIn} 
          setIsSignedIn={setIsSignedIn} 
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          loaded={loaded}
        />
      </StudentProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutContent({ isSignedIn, setIsSignedIn, isLoading, setIsLoading, loaded }: { 
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  loaded: boolean;
}) {
  const router = useRouter();
  const { setStudentData } = useContext(StudentContext);

  useEffect(() => {
    // Check stored auth state on mount
    const checkAuthState = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem("isSignedIn");
        setIsSignedIn(storedAuth === "true");
      } catch (error) {
        console.error("Error reading auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if(!loaded){
      checkAuthState();
    }
  }, []);

  useEffect(() => {
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
        getStudentData();
        router.replace("/[drawer]/[tabs]/home");
      } else {
        router.replace("/signin");
      }
    }
  }, [isSignedIn, router, isLoading]);

  async function getStudentData(){
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/app/signin/getStudentDetails`,{
        token: token
      },{
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        }
      });

      if(response.data.success == true){
        setStudentData(response.data.student);
      }else{
        setStudentData(null);
        setIsSignedIn(false);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("isSignedIn");
        router.replace("/signin");
      }
    } catch (error) {
      console.error(error);
    }
  }
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
        <Stack.Screen name="subjects" options={{ headerShown: false }} />
        <Stack.Screen name="lectures" options={{ headerShown: false }} />
        <Stack.Screen name='videoplayer' options={{ headerShown: false }} />
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