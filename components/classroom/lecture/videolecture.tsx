import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ImageStyle,
  Dimensions, 
  Modal, 
  ScrollView, 
  Platform,
  StatusBar 
} from 'react-native'
import { useRouter } from 'expo-router'
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons'
import { renderLatex } from '@/utils/textUtils';

interface VideoLectureProps {
  lectures: any[];
}

const VideoLecture: React.FC<VideoLectureProps> = ({ lectures }) => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const router = useRouter();
    const [pressedStates, setPressedStates] = useState<{[key: string]: boolean}>({});
    const [sortBy, setSortBy] = useState<'lectures' | 'teacher'>('lectures');
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    // console.log(lectures)
    const getYoutubeVideoId = (url: string) => {
        if (!url) return null;
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const calculateThumbnailDimensions = (): ImageStyle => {
        const baseHeight = screenWidth * 0.35;
        const minHeight = 180; // Minimum height to prevent cropping
        const maxHeight = 250; // Maximum height to maintain aspect ratio

        return {
            width: '100%',
            height: Math.min(Math.max(baseHeight, minHeight), maxHeight),
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
        };
    };

    const getSafeAreaInsets = () => {
        const statusBarHeight = StatusBar.currentHeight || 0;
        const bottomInset = Platform.OS === 'ios' ? 20 : 0;
        
        return {
            top: statusBarHeight,
            bottom: bottomInset
        };
    };

    const getResponsiveStyles = () => {
        const safeArea = getSafeAreaInsets();
        
        return {
            container: {
                paddingTop: safeArea.top,
                paddingBottom: safeArea.bottom
            },
            lectureItem: {
                marginBottom: screenWidth * 0.04,
                paddingHorizontal: 15
            }
        };
    };

    const renderVideoThumbnail = (lecture: any, thumbnailUrl: string) => {
        return (
            <View style={{ position: 'relative' }}>
                <Image 
                    source={{ uri: thumbnailUrl }}
                    style={calculateThumbnailDimensions()}
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
                    <View 
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            borderRadius: 50,
                            padding: 15
                        }}
                    >
                        <FontAwesome name="play" size={24} color="white" />
                    </View>
                </View>
            </View>
        );
    };

    const getYoutubeThumbnail = (videoUrl: string) => {
        const videoId = getYoutubeVideoId(videoUrl);
        return videoId 
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
            : null;
    };

    const getFallbackThumbnail = (lecture: any) => {
        const thumbnailUrl = getYoutubeThumbnail(lecture?.videoUrl);
        const fallbackImage = 'https://via.placeholder.com/300x169.png?text=Lecture+Thumbnail';
        
        return thumbnailUrl || fallbackImage;
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
            // If sorting by lectures, use serialNumber as primary sort
            return (a.serialNumber || 0) - (b.serialNumber || 0);
        } else {
            if (selectedTeacher) {
                if (a.teacher?.name === selectedTeacher && b.teacher?.name !== selectedTeacher) return -1;
                if (a.teacher?.name !== selectedTeacher && b.teacher?.name === selectedTeacher) return 1;
            }
            // If sorting by teacher, use serialNumber as secondary sort
            return (a.serialNumber || 0) - (b.serialNumber || 0);
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
                                {uniqueTeachers.map((teacher: any) => (
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
                const thumbnailUrl = getFallbackThumbnail(lecture);
                const isPressed = pressedStates[lecture?._id] || false;
                
                return (
                    <View key={lecture?._id} style={{ marginBottom: screenWidth * 0.04, overflow: 'visible' }} className='w-full'>
                        <TouchableOpacity 
                            className="bg-humpback-500 rounded-[20px]"
                            style={{
                                borderWidth: 3,
                                borderColor: '#2259A1',
                                borderBottomWidth: isPressed ? 3 : 6,
                                borderRightWidth: isPressed ? 3 : 6,
                                transform: [{ translateY: isPressed ? 4 : 0 }],
                                overflow: 'visible',
                                minHeight: 'auto',
                            }}
                            activeOpacity={1}
                            pressRetentionOffset={{top: 10, left: 10, right: 10, bottom: 10}}
                            onPress={() => handlePress(lecture?.videoUrl, lecture?._id)}
                            onPressIn={() => handlePressIn(lecture?._id)}
                            onPressOut={() => handlePressOut(lecture?._id)}
                        >
                            <View style={{ overflow: 'visible', minHeight: 'auto' }}>
                                {renderVideoThumbnail(lecture, thumbnailUrl)}
                                
                                <View className="p-4" style={{ overflow: 'visible' }}>
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center flex-1 mr-2">
                                            <Text className="text-white font-bold mr-2">
                                                #{lecture?.serialNumber || index + 1}
                                            </Text>
                                            <Text className="text-white font-bold text-lg flex-1">
                                                {lecture?.title || `Lecture ${index + 1}`}
                                            </Text>
                                        </View>
                                        <TouchableOpacity 
                                            onPress={() => {
                                                if (lecture?.teacher?._id) {
                                                    router.push({
                                                        pathname: './teacherdetails',
                                                        params: { 
                                                            teacherId: lecture.teacher._id ,
                                                            name: lecture.teacher.name,
                                                            bio: lecture.teacher.bio,
                                                            imageUrl: lecture.teacher.imageUrl,
                                                        }
                                                    })
                                                }
                                            }}
                                            className="flex-row items-center"
                                        >
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
                                        </TouchableOpacity>                                </View>
                                    {lecture?.description && (
                                        <View style={{ 
                                            marginTop: 10,
                                            paddingTop: 5,
                                            borderTopWidth: 1,
                                            borderTopColor: 'rgba(255,255,255,0.1)',
                                            minHeight: 40,
                                            overflow: 'visible',
                                        }}>
                                            <View style={{ 
                                                flexDirection: 'row',
                                                alignItems: 'flex-start',
                                                width: '100%',
                                                overflow: 'visible',
                                            }}>
                                                <MaterialIcons 
                                                    name="description" 
                                                    size={16} 
                                                    color="rgba(255,255,255,0.8)" 
                                                    style={{ marginRight: 8, marginTop: 2, alignSelf: 'flex-start' }} 
                                                />
                                                
                                                <View style={{ 
                                                    flex: 1,
                                                    minHeight: 35,
                                                    overflow: 'visible',
                                                }}>
                                                    {renderLatex(lecture.description, { 
                                                        fontSize: 14,
                                                        color: 'rgba(255,255,255,0.8)',
                                                        lineHeight: 20,
                                                        minHeight: 35,
                                                        width: '100%',
                                                    })}
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    )
}

export default VideoLecture