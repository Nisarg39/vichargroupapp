import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image, Animated, Linking } from 'react-native';
import { useRef, useEffect } from 'react';

const courseCardBase = "p-5 rounded-2xl shadow-lg justify-center items-center min-h-[22%] transform perspective-1000 backface-visible-hidden";

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

const products = {
    courses: {
        academic: [
            {
                id: 1,
                name: 'JEE',
                image: 'https://cdn-icons-png.flaticon.com/256/11483/11483670.png',
                grades: '11th & 12th',
                cart_url: 'vichar-education/jee'
            },
            {
                id: 2,
                name: 'NEET',
                image: 'https://cdn-icons-png.flaticon.com/256/8662/8662421.png',
                grades: '11th & 12th',
                cart_url: 'vichar-education/neet'
            },
            {
                id: 3,
                name: 'CET (PCM & PCB)',
                image: 'https://cdn-icons-png.flaticon.com/256/8663/8663461.png',
                grades: '11th & 12th',
                cart_url: 'vichar-education/mht-cet'
            },
            {
                id: 4,
                name: 'FOUNDATION',
                image: 'https://cdn-icons-png.flaticon.com/256/7139/7139119.png',
                grades: '8th, 9th & 10th',
                cart_url: 'vichar-education/foundation'
            }
        ]
    }
};

export default function Courses() {
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth - 32;
    const offerAnimation = useRef(new Animated.Value(1)).current;
    
    const animatedValues = {
        jee: useRef(new Animated.Value(1)).current,
        neet: useRef(new Animated.Value(1)).current,
        mht: useRef(new Animated.Value(1)).current,
        foundation: useRef(new Animated.Value(1)).current
    };

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
                <View>
                    {products.courses.academic.map((course, index) => (
                        <View key={course.id} className="items-center">
                            {index > 0 && (
                                <View className="h-4 w-1 bg-gray-300" />
                            )}
                            <TouchableOpacity
                                className={`rounded-[20px] p-4 ${cardStyles[index % 4]}`}
                                style={{
                                    width: cardWidth,
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
                                <View className="flex-row items-center">
                                    <View className="items-center justify-center">
                                        <View className="bg-white/30 rounded-full p-2" style={{shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
                                            <Image source={{ uri: course.image }} className="w-[60px] h-[60px]" resizeMode="contain" />
                                        </View>
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <Text numberOfLines={1} className="text-base font-extrabold text-white">{course.name}</Text>
                                        <View className="bg-white/10 rounded-lg p-2 mt-2">
                                            <Text className="text-xs text-white/80 text-center">Grades</Text>
                                            <Text className="text-sm text-white font-semibold text-center">{course.grades}</Text>
                                        </View>
                                    </View>
                                    <View className="ml-4 items-end">
                                        <TouchableOpacity
                                            className="bg-white rounded-xl"
                                            style={{
                                                borderWidth: 2,
                                                borderColor: borderStyles[index % 4],
                                                borderBottomWidth: 4,
                                                borderRightWidth: 4,
                                                transform: [{ translateY: 0 }],
                                            }}
                                            activeOpacity={1}
                                            pressRetentionOffset={{top: 5, left: 5, right: 5, bottom: 5}}
                                            onPress={() => {
                                                const url = course.cart_url 
                                                    ? `${process.env.EXPO_PUBLIC_API_URL}/${course.cart_url}`
                                                    : 'https://www.vichargroup.com';
                                                Linking.openURL(url);
                                            }}
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
                                            <Text className="text-black font-bold text-xs px-4 py-2 text-center">Enroll Now</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {index < products.courses.academic.length - 1 && (
                                <View className="h-4 w-1 bg-gray-300" />
                            )}
                        </View>
                    ))}
                </View>
            </View>

        </ScrollView>
    )
}