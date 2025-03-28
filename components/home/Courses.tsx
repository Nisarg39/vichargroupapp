import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';

const courseCardBase = "p-5 rounded-2xl shadow-lg justify-center items-center min-h-[22%] transform perspective-1000 backface-visible-hidden";

const cardStyles = [
    'bg-cardinal-500',
    'bg-fox-500',
    'bg-beetle-500',
    'bg-humpback-500'
];

const borderStyles = [
    '#FF1818',
    '#CC7800',
    '#B54FFF',
    '#2259A1'
];

const products = {
    courses: {
        academic: [
            {
                id: 1,
                name: 'JEE',
                image: 'https://cdn-icons-png.flaticon.com/256/11483/11483690.png',
                price: 1000,
                lessons: '200+',
                students: '50K+'
            },
            {
                id: 2,
                name: 'NEET',
                image: 'https://cdn-icons-png.flaticon.com/256/8662/8662421.png',
                price: 1000,
                lessons: '180+',
                students: '45K+'
            },
            {
                id: 3,
                name: 'CET',
                image: 'https://cdn-icons-png.flaticon.com/256/8663/8663461.png',
                price: 1000,
                lessons: '150+',
                students: '30K+'
            },
            {
                id: 4,
                name: 'FOUNDATION',
                image: 'https://cdn-icons-png.flaticon.com/256/7139/7139119.png',
                price: 1000,
                lessons: '120+',
                students: '25K+'
            }
        ]
    }
};
export default function Courses() {
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = (screenWidth - 60) / 2;
    
    const animatedValues = {
        jee: useRef(new Animated.Value(1)).current,
        neet: useRef(new Animated.Value(1)).current,
        mht: useRef(new Animated.Value(1)).current,
        foundation: useRef(new Animated.Value(1)).current
    };

    const handlePressIn = (animatedValue: Animated.Value) => {
        Animated.spring(animatedValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (animatedValue: Animated.Value) => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <ScrollView className="flex-1 w-full">
            <View className="p-5">
                <Text className="text-base text-gray-600 mb-2">Hello, Student! 👋</Text>
                <Text className="text-2xl font-bold text-gray-800 tracking-wide">Choose Your Quest!</Text>
                <Text className="text-sm text-gray-600 mt-2">Select the perfect course for your academic journey</Text>
            </View>

            {/* course list */}
            <View className="p-4">
                <View className="flex-row flex-wrap justify-between">
                    {products.courses.academic.map((course, index) => (
                        <View key={course.id} className="my-2" style={{ width: cardWidth }}>
                            <TouchableOpacity
                                className={`rounded-[20px] p-3 ${cardStyles[index % 4]}`}
                                style={{
                                    borderWidth: 3,
                                    borderColor: borderStyles[index % 4],
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
                            >
                                <View className="items-center justify-center mb-3">
                                    <Image source={{ uri: course.image }} className="w-[80px] h-[80px]" resizeMode="contain" />
                                </View>
                                <Text numberOfLines={1} className="text-lg font-extrabold text-white mb-3 text-center">{course.name}</Text>
                                <View className="flex-row justify-between bg-white/10 rounded-lg p-2 mb-3">
                                    <View className="flex-1 items-center">
                                        <Text className="text-xs text-white/80 mb-0.5">Lessons</Text>
                                        <Text className="text-sm text-white font-semibold">{course.lessons}</Text>
                                    </View>
                                    <View className="flex-1 items-center border-l border-white/20">
                                        <Text className="text-xs text-white/80 mb-0.5">Students</Text>
                                        <Text className="text-sm text-white font-semibold">{course.students}</Text>
                                    </View>
                                </View>
                                <Text className="text-lg font-bold text-white mb-3">₹{course.price}</Text>
                                <TouchableOpacity
                                    className="bg-white rounded-2xl w-full"
                                    style={{
                                        borderWidth: 2,
                                        borderColor: borderStyles[index % 4],
                                        borderBottomWidth: 4,
                                        borderRightWidth: 4,
                                        transform: [{ translateY: 0 }],
                                    }}
                                    activeOpacity={1}
                                    pressRetentionOffset={{top: 5, left: 5, right: 5, bottom: 5}}
                                    onPressIn={(e) => {
                                        e.currentTarget.setNativeProps({
                                            style: { transform: [{ translateY: 2 }], borderBottomWidth: 2, borderRightWidth: 2 }
                                        })
                                    }}
                                    onPressOut={(e) => {
                                        e.currentTarget.setNativeProps({
                                            style: { transform: [{ translateY: 0 }], borderBottomWidth: 4, borderRightWidth: 4 }
                                        })
                                    }}
                                >
                                    <Text className="text-black font-bold text-xs px-3 py-1.5 text-center">Enroll</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>

            <View className="p-5">
                <Text className="text-lg font-semibold text-gray-800 mb-4">Popular This Week</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {['Physics', 'Chemistry', 'Mathematics', 'Biology'].map((subject, index) => (
                        <View key={index} className="bg-white p-4 rounded-xl mr-3 min-w-[30%] border border-gray-200">
                            <Text className="text-sm font-semibold text-gray-800">{subject}</Text>
                            <Text className="text-xs text-gray-600 mt-1">2.5k students</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    )
}