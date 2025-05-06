import React from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions, Animated, Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

interface VideoLectureProps {
  lectures: any[]; // You can replace 'any' with a more specific type if you know the structure
}

const VideoLecture: React.FC<VideoLectureProps> = ({ lectures }) => {
    const { width: screenWidth } = Dimensions.get('window');

    return (
        <View className="flex-1">
            {lectures?.map((lecture, index) => (
                <View key={lecture?._id} style={{ marginBottom: screenWidth * 0.04 }} className='w-full'>
                    <TouchableOpacity 
                        className="bg-humpback-500 rounded-[20px]"
                        style={{
                            borderWidth: 3,
                            borderColor: '#2259A1',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                            transform: [{ translateY: 0 }],
                            padding: screenWidth * 0.04,
                        }}
                        activeOpacity={1}
                        pressRetentionOffset={{top: 10, left: 10, right: 10, bottom: 10}}
                        onPressIn={(e) => {
                            e.currentTarget.setNativeProps({
                                style: { transform: [{ translateY: 4 }], borderBottomWidth: 3, borderRightWidth: 3 }
                            })
                        }}
                        onPressOut={(e) => {
                            e.currentTarget.setNativeProps({
                                style: { transform: [{ translateY: 0 }], borderBottomWidth: 6, borderRightWidth: 6 }
                            })
                        }}
                    >
                        <View className="flex-row items-center">
                            <View className="items-center justify-center">
                                <View className="bg-white/30 rounded-full p-3" style={{shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
                                    <MaterialIcons name="video-library" size={24} color="white" />
                                </View>
                            </View>
                            <View className="flex-1 ml-4">
                                <View className="flex-row items-center">
                                    <Text className="text-base font-extrabold text-white mr-2">{index + 1}.</Text>
                                    <Text className="text-base font-extrabold text-white">{lecture?.title}</Text>
                                </View>
                                <Text className="text-sm text-white/80 mt-1">{lecture?.description}</Text>
                                <View className="flex-row items-center mt-3">
                                    <Image 
                                        source={{ uri: lecture?.teacher?.imageUrl }} 
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <Text className="text-sm text-white font-medium">{lecture?.teacher?.name}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    )
}

export default VideoLecture