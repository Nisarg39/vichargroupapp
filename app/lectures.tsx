import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Image, Dimensions, Animated, useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import VideoLecture from "@/components/classroom/lecture/videolecture";
import DPPs from "@/components/classroom/lecture/dpps";
import Exercises from "@/components/classroom/lecture/exercises";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function Lectures() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const {chapterId, chapterName, image, chapterIndex} = useLocalSearchParams();
  const offerAnimation = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const [lectures, setLectures] = useState([]);
  const [dpps, setDpps] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeTab, setActiveTab] = useState('lectures');
  
  // Calculate responsive sizes
  const isSmallScreen = screenWidth < 360;
  const headerHeight = screenHeight * 0.12;
  const iconSize = screenWidth * 0.06 > 24 ? 24 : screenWidth * 0.06;
  const imageSize = screenWidth * 0.12;
  const headerFontSize = isSmallScreen ? 18 : 22;
  const tabFontSize = isSmallScreen ? 12 : 14;
  const tabPadding = isSmallScreen ? { x: 4, y: 1 } : { x: 6, y: 2 };

  // Calculate additional top padding for notch
  const topPadding = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

  useEffect(() => {
    const pulseOffer = () => {
      Animated.sequence([
        Animated.timing(offerAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(offerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start(() => pulseOffer());
    };

    pulseOffer();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/api/app/signin/getChapterDetails`,
          {
            chapterId: chapterId,
            token: token,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          }
        );
        if (response.data.success == true) {
            setLectures(response.data.chapter.lectures);
            setDpps(response.data.chapter.dpps);
            setExercises(response.data.chapter.exercises);
        } else {
          console.log("Error fetching chapter details");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [chapterId]);

  // Responsive tab layout based on screen size
  const renderTabs = () => {
    if (isSmallScreen) {
      return (
        <View className="flex-row justify-around p-2 bg-white shadow-sm">
          {renderTab('lectures', 'video-library', 'Lectures')}
          {renderTab('dpps', 'tasks', 'DPPs', true)}
          {renderTab('exercises', 'fitness-center', 'Exercises')}
        </View>
      );
    }
    
    return (
      <View className="flex-row justify-around p-3 bg-white shadow-sm">
        {renderTab('lectures', 'video-library', 'Lectures')}
        {renderTab('dpps', 'tasks', 'DPPs', true)}
        {renderTab('exercises', 'fitness-center', 'Exercises')}
      </View>
    );
  };

  const renderTab = (tabName: any, iconName: any, label: any, isFontAwesome = false) => {
    const isActive = activeTab === tabName;
    const Icon = isFontAwesome ? FontAwesome5 : MaterialIcons;
    
    return (
      <TouchableOpacity 
        onPress={() => setActiveTab(tabName)}
        className={`px-${tabPadding.x} py-${tabPadding.y} rounded-full flex-row items-center space-x-1 ${isActive ? 'bg-humpback-500' : 'bg-gray-100'}`}
        style={{ paddingHorizontal: tabPadding.x * 4, paddingVertical: tabPadding.y * 4 }}
      >
        <Icon 
          name={iconName} 
          size={isSmallScreen ? 14 : 18} 
          color={isActive ? 'white' : '#4A5568'} 
        />
        <Text 
          className={`${isActive ? 'text-white font-medium' : 'text-gray-700'}`}
          style={{ fontSize: tabFontSize }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#E6EEF5' }}>
      <SafeAreaView style={{ 
        flex: 1, 
        paddingTop: Platform.OS === 'android' ? topPadding : 0 
      }}>
        <View 
          className='w-full bg-humpback-500 justify-center items-center'
          style={{ 
            height: headerHeight,
            minHeight: 70,
            maxHeight: 100,
            paddingTop: Platform.OS === 'ios' ? topPadding / 2 : 0
          }}
        >
          <View className='w-full px-3 flex-row items-center'>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ width: screenWidth * 0.12 }}
              className="justify-center"
            >
              <Ionicons name="arrow-back" size={iconSize} color="white" />
            </TouchableOpacity>
            
            <View className='flex-1 items-center'>
              <View className="flex-row items-center justify-center">
                <Text style={{ fontSize: headerFontSize }} className="font-bold text-white tracking-wide">
                  Chapter {chapterIndex}
                </Text>
              </View>
              <Text 
                className="text-white/80"
                style={{ fontSize: isSmallScreen ? 13 : 16 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {chapterName}
              </Text>
            </View>
            
            <View 
              className='bg-white/30 rounded-full p-2' 
              style={{
                shadowColor: '#000', 
                shadowOffset: {width: 0, height: 2}, 
                shadowOpacity: 0.25, 
                shadowRadius: 3.84, 
                elevation: 5
              }}
            >
              <Image 
                source={{ uri: typeof image === 'string' ? image : image[0] }} 
                style={{
                  width: imageSize,
                  height: imageSize
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        
        {renderTabs()}
        
        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            paddingHorizontal: screenWidth * 0.04,
            paddingTop: screenWidth * 0.04,
            paddingBottom: screenWidth * 0.08
          }}
        >
          <View className="flex-1">
            {activeTab === 'lectures' && <VideoLecture lectures={lectures} />}
            {activeTab === 'dpps' && <DPPs dpps={dpps}/>}
            {activeTab === 'exercises' && <Exercises exercises={exercises}/>}
          </View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#2259A1" />
    </View>
  );
}