import { View, Text, ScrollView, TouchableOpacity, SafeAreaView as RNSafeAreaView, Platform, StatusBar, Image, Dimensions, Animated } from "react-native";
import {useLocalSearchParams, useRouter } from "expo-router";
import VideoLecture from "@/components/classroom/lecture/videolecture";
import DPPs from "@/components/classroom/lecture/dpps";
import Exercises from "@/components/classroom/lecture/exercises";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function Lectures() {
  const {chapterId, chapterName, image, chapterIndex} = useLocalSearchParams();
  const offerAnimation = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const [lectures, setLectures] = useState([]);
    const [dpps, setDpps] = useState([]);
    const [exercises, setExercises] = useState([]);
  const [activeTab, setActiveTab] = useState('lectures');

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
            console.log(response.data.chapter.lectures[0].videoUrl);
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

  return (
    <RNSafeAreaView style={{
      flex: 1,
      backgroundColor: '#E6EEF5',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }}>
      <View className='w-full h-[12%] min-h-[80px] max-h-[100px] bg-humpback-500 justify-center items-center'>
        <View className='w-full px-5 flex-row items-center'>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{width: screenWidth * 0.15}}
            className="justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className='flex-1 items-center'>
            <View className="flex-row items-center justify-center">
              <Text className="text-2xl font-bold text-white tracking-wide">Chapter </Text>
              <Text className="text-2xl font-bold text-white tracking-wide">{chapterIndex}</Text>
            </View>
            <Text className="text-base text-white/80">{chapterName}</Text>
          </View>
          <View className='bg-white/30 rounded-full p-2' style={{shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
            <Image 
              source={{ uri: typeof image === 'string' ? image : image[0] }} 
              style={{
                width: screenWidth * 0.15,
                height: screenWidth * 0.15
              }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      <View className="flex-row justify-around p-3 bg-white shadow-sm">
        <TouchableOpacity 
          onPress={() => setActiveTab('lectures')}
          className={`px-6 py-2 rounded-full flex-row items-center space-x-2 ${activeTab === 'lectures' ? 'bg-humpback-500' : 'bg-gray-100'}`}
        >
          <MaterialIcons name="video-library" size={18} color={activeTab === 'lectures' ? 'white' : '#4A5568'} />
          <Text className={`${activeTab === 'lectures' ? 'text-white font-medium' : 'text-gray-700'}`}>Lectures</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('dpps')}
          className={`px-6 py-2 rounded-full flex-row items-center space-x-2 ${activeTab === 'dpps' ? 'bg-humpback-500' : 'bg-gray-100'}`}
        >
          <FontAwesome5 name="tasks" size={16} color={activeTab === 'dpps' ? 'white' : '#4A5568'} />
          <Text className={`${activeTab === 'dpps' ? 'text-white font-medium' : 'text-gray-700'}`}>DPPs</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('exercises')}
          className={`px-6 py-2 rounded-full flex-row items-center space-x-2 ${activeTab === 'exercises' ? 'bg-humpback-500' : 'bg-gray-100'}`}
        >
          <MaterialIcons name="fitness-center" size={18} color={activeTab === 'exercises' ? 'white' : '#4A5568'} />
          <Text className={`${activeTab === 'exercises' ? 'text-white font-medium' : 'text-gray-700'}`}>Exercises</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{
          paddingHorizontal: screenWidth * 0.04,
          paddingTop: screenWidth * 0.04,
          paddingBottom: screenWidth * 0.04
        }}
      >
        <View className="flex-1">
          {activeTab === 'lectures' && <VideoLecture lectures={lectures} />}
          {activeTab === 'dpps' && <DPPs dpps={dpps}/>}
          {activeTab === 'exercises' && <Exercises exercises={exercises}/>}
        </View>
      </ScrollView>
    </RNSafeAreaView>
  );
}