import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions, Modal, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons'

interface VideoLectureProps {
  lectures: any[];
}

const VideoLecture: React.FC<VideoLectureProps> = ({ lectures }) => {
    const { width: screenWidth } = Dimensions.get('window');
    const router = useRouter();
    const [pressedStates, setPressedStates] = useState<{[key: string]: boolean}>({});
    const [sortBy, setSortBy] = useState<'lectures' | 'teacher'>('lectures');
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const getYoutubeVideoId = (url: string) => {
        if (!url) return null;
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getYoutubeThumbnail = (videoUrl: string) => {
        const videoId = getYoutubeVideoId(videoUrl);
        if (!videoId) return null;
        
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    };

    const handlePressIn = (lectureId: string) => {
        setPressedStates(prev => ({...prev, [lectureId]: true}));
    };

    const handlePressOut = (lectureId: string) => {
        setPressedStates(prev => ({...prev, [lectureId]: false}));
    };

    const handlePress = (videoUrl: string, lectureId: string) => {
        router.push({
            pathname: './videoplayer',
            params: { videoUrl }
        });
        
        setTimeout(() => {
            setPressedStates(prev => ({...prev, [lectureId]: false}));
        }, 100);
    };

    const teacherLectureCounts = lectures.reduce((acc, lecture) => {
        const teacherName = lecture?.teacher?.name || 'Unknown Teacher';
        acc[teacherName] = (acc[teacherName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const uniqueTeachers = Array.from(
        lectures.reduce((map, lecture) => {
            if (lecture?.teacher?.name) {
                map.set(lecture.teacher.name, {
                    name: lecture.teacher.name,

                    imageUrl: lecture.teacher.imageUrl,
                    lectureCount: teacherLectureCounts[lecture.teacher.name]
                });
            }
            return map;
        }, new Map())
        .values()
    );

    const sortedLectures = [...lectures].sort((a, b) => {
        if (sortBy === 'lectures') {
            return a.title?.localeCompare(b.title) || 0;
        } else {
            if (selectedTeacher) {
                if (a.teacher?.name === selectedTeacher && b.teacher?.name !== selectedTeacher) return -1;
                if (a.teacher?.name !== selectedTeacher && b.teacher?.name === selectedTeacher) return 1;
            }
            return a.teacher?.name?.localeCompare(b.teacher?.name) || 0;
        }
    });

    return (
        <View className="flex-1">
            <View className="mb-4 px-4">
                <Text className="text-gray-900 text-lg font-bold mb-2">
                    Total Lectures: {lectures.length}
                </Text>
            </View>

            <TouchableOpacity 
                onPress={() => setShowSortDropdown(true)}
                className="mb-4 px-4"
            >
                <View className="bg-humpback-500 px-4 py-2 rounded-full flex-row items-center justify-center">
                    <MaterialIcons name="sort" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white text-center">
                        {sortBy === 'lectures' ? 'Sort by Lectures' : 
                         selectedTeacher ? `Sorted by ${selectedTeacher}` : 'Sort by Teacher'}
                    </Text>
                </View>
            </TouchableOpacity>

            <Modal
                visible={showSortDropdown}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowSortDropdown(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View className="bg-white rounded-2xl w-[80%] max-h-[70%]">
                        <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
                            <Text className="text-xl font-bold text-center">Sort Options</Text>
                            <TouchableOpacity onPress={() => setShowSortDropdown(false)}>
                                <Ionicons name="close-circle" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView className="p-4">
                            <TouchableOpacity 
                                onPress={() => {
                                    setSortBy('lectures');
                                    setSelectedTeacher(null);
                                    setShowSortDropdown(false);
                                }}
                                className={`p-3 mb-2 rounded-lg flex-row items-center ${
                                    sortBy === 'lectures' ? 'bg-humpback-500' : 'bg-gray-100'
                                }`}
                            >
                                <MaterialIcons 
                                    name="sort-by-alpha" 
                                    size={20} 
                                    color={sortBy === 'lectures' ? 'white' : 'black'} 
                                    style={{ marginRight: 8 }}
                                />
                                <Text className={sortBy === 'lectures' ? 'text-white' : 'text-black'}>
                                    Sort by Lectures
                                </Text>
                            </TouchableOpacity>
                            
                            <View className="mb-2">
                                <Text className="text-lg font-bold mb-2">Sort by Teacher</Text>
                                {uniqueTeachers.map((teacher) => (
                                    <TouchableOpacity 
                                        key={teacher.name}
                                        onPress={() => {
                                            setSelectedTeacher(teacher.name);
                                            setSortBy('teacher');
                                            setShowSortDropdown(false);
                                        }}
                                        className={`flex-row items-center p-3 mb-2 rounded-lg ${
                                            selectedTeacher === teacher.name ? 'bg-humpback-500' : 'bg-gray-100'
                                        }`}
                                    >
                                        {teacher.imageUrl ? (
                                            <Image 
                                                source={{ uri: teacher.imageUrl }}
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                        ) : (
                                            <View className="w-10 h-10 rounded-full bg-gray-300 mr-3 items-center justify-center">
                                                <FontAwesome name="user" size={20} color="#666" />
                                            </View>
                                        )}





                                        <View className="flex-1">
                                            <Text className={`text-lg ${
                                                selectedTeacher === teacher.name ? 'text-white' : 'text-black'
                                            }`}>
                                                {teacher.name}
                                            </Text>
                                            <Text className={`text-sm ${
                                                selectedTeacher === teacher.name ? 'text-white/80' : 'text-gray-600'
                                            }`}>
                                                {teacher.lectureCount} lecture{teacher.lectureCount !== 1 ? 's' : ''}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                        <TouchableOpacity 
                            onPress={() => setShowSortDropdown(false)}
                            className="p-4 border-t border-gray-200"
                        >
                            <Text className="text-center text-humpback-500 font-bold">Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {sortedLectures?.map((lecture, index) => {
                if (!lecture) return null;
                const thumbnailUrl = getYoutubeThumbnail(lecture?.videoUrl);
                const isPressed = pressedStates[lecture?._id] || false;
                
                return (
                    <View key={lecture?._id} style={{ marginBottom: screenWidth * 0.04 }} className='w-full'>
                        <TouchableOpacity 
                            className="bg-humpback-500 rounded-[20px] overflow-hidden"
                            style={{
                                borderWidth: 3,
                                borderColor: '#2259A1',
                                borderBottomWidth: isPressed ? 3 : 6,
                                borderRightWidth: isPressed ? 3 : 6,
                                transform: [{ translateY: isPressed ? 4 : 0 }],
                            }}
                            activeOpacity={1}
                            pressRetentionOffset={{top: 10, left: 10, right: 10, bottom: 10}}
                            onPress={() => handlePress(lecture?.videoUrl, lecture?._id)}
                            onPressIn={() => handlePressIn(lecture?._id)}
                            onPressOut={() => handlePressOut(lecture?._id)}
                        >
                            {thumbnailUrl ? (
                                <View>
                                    <Image 
                                        source={{ uri: thumbnailUrl }}
                                        style={{ 
                                            width: '100%', 
                                            height: screenWidth * 0.35,
                                            borderTopLeftRadius: 16,
                                            borderTopRightRadius: 16
                                        }}
                                        resizeMode="cover"
                                    />
                                    <View 
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: 'rgba(0,0,0,0.4)'
                                        }}
                                    >
                                        <View style={{
                                            backgroundColor: 'rgba(255,255,255,0.25)',
                                            borderRadius: 50,
                                            padding: 15
                                        }}>
                                            <FontAwesome name="play" size={24} color="white" />
                                        </View>
                                    </View>
                                </View>
                            ) : null}
                            
                            <View className="p-4">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1 mr-2">
                                        <MaterialIcons name="video-library" size={20} color="white" style={{ marginRight: 8 }} />
                                        <Text className="text-white font-bold text-lg flex-1">
                                            {lecture?.title || `Lecture ${index + 1}`}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        {lecture?.teacher?.imageUrl ? (
                                            <Image 
                                                source={{ uri: lecture.teacher.imageUrl }}
                                                style={{ 
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 14,
                                                    borderWidth: 1,
                                                    borderColor: 'rgba(255,255,255,0.2)'
                                                }}
                                            />
                                        ) : (
                                            <FontAwesome name="user-circle" size={28} color="white" />
                                        )}
                                        <Text className="text-white/90 ml-2 text-sm font-medium">
                                            {lecture?.teacher?.name || 'Unknown Teacher'}
                                        </Text>
                                    </View>
                                </View>
                                {lecture?.description && (
                                    <View className="flex-row items-start mt-2">
                                        <MaterialIcons name="description" size={16} color="rgba(255,255,255,0.8)" style={{ marginRight: 8, marginTop: 2 }} />
                                        <Text className="text-white/80 text-sm leading-5 flex-1">
                                            {lecture.description}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    )
}

export default VideoLecture