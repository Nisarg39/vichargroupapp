import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Image, Dimensions, Animated, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAnimatedStyle, withRepeat, withSequence, withTiming, useSharedValue } from 'react-native-reanimated';

const cardStyles = [
    'bg-[#1ecbe1]',
    'bg-fox-500',
    'bg-beetle-500',
    'bg-humpback-500'
];

const borderStyles = [
    '#0891B2',
    '#CC7800',
    '#B54FFF',
    '#2259A1'
];

export default function Subjects() {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const router = useRouter();
    const { subjects } = useLocalSearchParams();
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
    const subjectsArray = JSON.parse(subjects as string);
    const scaleValue = useSharedValue(1);

    // console.log(subjectsArray[0].chapters[2].serialNumber);

    // Calculate responsive sizes
    const isSmallScreen = screenWidth < 360;
    const headerHeight = screenHeight * 0.12;
    const iconSize = screenWidth * 0.06 > 24 ? 24 : screenWidth * 0.06;
    const headerFontSize = isSmallScreen ? 18 : 22;
    const subHeaderFontSize = isSmallScreen ? 13 : 16;

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scaleValue.value }]
        }
    });

    scaleValue.value = withRepeat(
        withSequence(
            withTiming(1.1, { duration: 800 }),
            withTiming(1, { duration: 800 })
        ),
        -1,
        true
    );

    // Calculate additional top padding for notch
    const topPadding = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

    return (
        <View style={{ flex: 1, backgroundColor: '#E6EEF5' }}>
            {/* Apply padding to the top of the SafeAreaView */}
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
                            style={{width: screenWidth * 0.12}}
                            className="justify-center"
                        >
                            <Ionicons name="arrow-back" size={iconSize} color="white" />
                        </TouchableOpacity>
                        <View className='flex-1 items-center'>
                            <Text 
                                className="text-white/80"
                                style={{ fontSize: subHeaderFontSize }}
                            >
                                Welcome back! 👋
                            </Text>
                            <Text 
                                style={{ fontSize: headerFontSize }} 
                                className="font-bold text-white tracking-wide"
                            >
                                Your Subjects
                            </Text>
                        </View>
                        <View style={{width: screenWidth * 0.12}} />
                    </View>
                </View>
                <ScrollView 
                    className='flex-1'
                    contentContainerStyle={{
                        paddingHorizontal: screenWidth * 0.04,
                        paddingTop: screenWidth * 0.04,
                        paddingBottom: screenWidth * 0.04
                    }}
                >
                    {subjectsArray.map((subject: any, index: number) => {
                        const cardStyle = cardStyles[index % 4];
                        const borderStyle = borderStyles[index % 4];
                        
                        return (
                            <View key={subject._id} className="my-2 items-center">
                                <TouchableOpacity 
                                    className={`${cardStyle} rounded-[20px] p-4`}
                                    style={{
                                        width: screenWidth - 32,
                                        borderWidth: 3,
                                        borderColor: borderStyle,
                                        borderBottomWidth: 6,
                                        borderRightWidth: 6,
                                        transform: [{ translateY: 0 }],
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
                                    onPress={() => setExpandedSubject(expandedSubject === subject._id ? null : subject._id)}
                                >
                                    <View className='flex-row items-center'>
                                        <View className='items-center justify-center'>
                                            <View className='bg-white/30 rounded-full p-2' style={{shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
                                                <Image 
                                                    source={{ uri: subject.image }}
                                                    className="w-[60px] h-[60px]"
                                                    resizeMode="contain"
                                                />
                                            </View>
                                        </View>
                                        <View className='flex-1 ml-4'>
                                            <Text numberOfLines={1} className='text-base font-extrabold text-white'>{subject.name}</Text>
                                            <View className='flex-row justify-between bg-white/10 rounded-lg p-2 mt-2'>
                                                <View className='flex-1 items-center'>
                                                    <Text className='text-[10px] text-white/80'>Chapters</Text>
                                                    <Text className='text-xs text-white font-semibold'>{subject.chapters?.length || 0}</Text>
                                                </View>
                                                <View className='flex-1 items-center border-l border-white/20'>
                                                    <Text className='text-[10px] text-white/80'>Progress</Text>
                                                    <Text className='text-xs text-white font-semibold'>0%</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    {expandedSubject === subject._id && subject.chapters && subject.chapters.length > 0 && (
                                        <View style={{ marginTop: screenWidth * 0.06 }}>
                                            {subject.chapters.map((chapter: any, chapterIndex: number) => (
                                                <View 
                                                    key={chapter._id}
                                                    style={{
                                                        marginBottom: screenWidth * 0.05,
                                                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                                                        shadowOffset: { width: 0, height: 4 },
                                                        shadowOpacity: 0.3,
                                                        shadowRadius: 5,
                                                        elevation: 8,
                                                    }}
                                                >
                                                    <TouchableOpacity 
                                                        className='bg-white/15 rounded-xl flex-row items-center'
                                                        style={{
                                                            padding: screenWidth * 0.04,
                                                            borderWidth: 1,
                                                            borderColor: 'rgba(255, 255, 255, 0.3)',
                                                            borderBottomWidth: 4,
                                                            borderRightWidth: 4,
                                                            transform: [{ translateY: 0 }],
                                                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                            marginHorizontal: 2,
                                                        }}
                                                        activeOpacity={0.9}
                                                        onPressIn={(e) => {
                                                            e.currentTarget.setNativeProps({
                                                                style: { 
                                                                    transform: [{ translateY: 3 }], 
                                                                    borderBottomWidth: 1, 
                                                                    borderRightWidth: 1,
                                                                    shadowOpacity: 0.1,
                                                                }
                                                            })
                                                        }}
                                                        onPressOut={(e) => {
                                                            e.currentTarget.setNativeProps({
                                                                style: { 
                                                                    transform: [{ translateY: 0 }], 
                                                                    borderBottomWidth: 4, 
                                                                    borderRightWidth: 4,
                                                                    shadowOpacity: 0.3,
                                                                }
                                                            })
                                                        }}
                                                        onPress={() => {
                                                            router.push({
                                                                pathname: '/lectures',
                                                                params: { 
                                                                    chapterId: chapter._id,
                                                                    chapterName: chapter.chapterName,
                                                                    image: chapter.image,
                                                                    chapterIndex: chapterIndex + 1,
                                                                }
                                                            })
                                                        }}
                                                    >
                                                        <View 
                                                            className='items-center justify-center'
                                                        >
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
                                                                    source={{ uri: chapter.image }}
                                                                    style={{
                                                                        width: screenWidth * 0.12,
                                                                        height: screenWidth * 0.12,
                                                                        borderRadius: screenWidth * 0.06
                                                                    }}
                                                                    resizeMode='cover'
                                                                />
                                                            </View>
                                                        </View>
                                                        <View className='flex-1 ml-4'>
                                                            <Text className='text-white font-semibold' style={{ fontSize: screenWidth * 0.04 }}>
                                                                {chapter.serialNumber}: {chapter.chapterName}
                                                            </Text>
                                                            <View className='flex-row items-center mt-1'>
                                                                <Text className='text-white/70' style={{ fontSize: screenWidth * 0.035 }}>
                                                                    {chapter.lectures?.length || 0} Lectures
                                                                </Text>
                                                                <Text className='text-white/70 mx-1' style={{ fontSize: screenWidth * 0.035 }}>•</Text>
                                                                <Text className='text-white/70' style={{ fontSize: screenWidth * 0.035 }}>
                                                                    {chapter.dpps?.length || 0} DPPs
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
            <StatusBar barStyle="light-content" backgroundColor="#2259A1" />
        </View>
    );
}