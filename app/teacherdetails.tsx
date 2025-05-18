import { Text, View, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function Teacherdetails() {
  const {teacherId, name, bio, imageUrl} = useLocalSearchParams()
  const router = useRouter();
  // console.log(imageUrl)
  return (
    <SafeAreaView className="flex-1 bg-[#0077b6]">
      <StatusBar barStyle="light-content" />
      
      {/* Decorative elements */}
      <View className="absolute top-10 left-5">
        <View className="w-16 h-16 rounded-full bg-[#00b4d8] opacity-20" />
      </View>
      <View className="absolute bottom-10 right-5">
        <View className="w-24 h-24 rounded-full bg-[#90e0ef] opacity-20" />
      </View>
      <View className="absolute top-1/4 right-10">
        <View className="w-10 h-10 rounded-full bg-[#caf0f8] opacity-30" />
      </View>
      
      <View className="flex-1 p-5 justify-center items-center">
        {/* Teacher profile card with illustration style */}
        <View className="bg-white rounded-3xl shadow-xl p-8 items-center w-full max-w-md">
          {/* Avatar container with decorative elements */}
          <View className="relative mb-6">
            <View className="absolute -top-2 -left-2 w-[210px] h-[210px] rounded-full bg-[#caf0f8] opacity-30" />
            <View className="absolute -bottom-2 -right-2 w-[210px] h-[210px] rounded-full bg-[#90e0ef] opacity-30" />
            <Image
              source={{ uri: imageUrl?.toString() }}
              className="w-[200px] h-[200px] rounded-full border-4 border-white"
            />
          </View>
          
          {/* Name with decorative elements */}
          <View className="flex-row items-center mb-3">
            <View className="w-2 h-2 rounded-full bg-[#0077b6] mr-2" />
            <Text className="text-2xl font-bold text-[#1e293b]">{name}</Text>
            <View className="w-2 h-2 rounded-full bg-[#0077b6] ml-2" />
          </View>
          
          {/* Decorative line */}
          <View className="w-20 h-1 bg-[#0077b6] rounded-full mb-5" />
          
          {/* Bio with quote marks */}
          <View className="relative mb-6">
            <Text className="text-[#caf0f8] text-4xl absolute -top-4 -left-2">"</Text>
            <Text className="text-base text-center leading-6 text-gray-600 px-4">
              {bio}
            </Text>
            <Text className="text-[#caf0f8] text-4xl absolute -bottom-4 -right-2">"</Text>
          </View>
          
          {/* Back button with icon */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mt-4 bg-[#0077b6] py-3 px-8 rounded-full flex-row items-center"
          >
            <Ionicons name="arrow-back" size={18} color="white" />
            <Text className="text-white font-medium ml-2">Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}