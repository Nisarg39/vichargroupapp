import {View, Text, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native'
import { useRef } from 'react'

interface Course {
    id: number;
    name: string;
    image: string;
    price: number;
    rating: number;
    reviews: number;
    lessons: string;
    students: string;
    progress?: number;
}

const products = {
    courses: {
        academic: [
            {
                id: 1,
                name: 'JEE',
                image: 'https://cdn-icons-png.flaticon.com/256/11483/11483670.png',
                price: 1000,
                rating: 4.5,
                reviews: 10,
                lessons: '200+',
                students: '50K+',
                progress: 65
            },
            {
                id: 2,
                name: 'NEET',
                image: 'https://cdn-icons-png.flaticon.com/256/8662/8662421.png',
                price: 1000,
                rating: 4.5,
                reviews: 10,
                lessons: '180+',
                students: '45K+',
                progress: 45
            },
            {
                id: 3,
                name: 'CET',
                image: 'https://cdn-icons-png.flaticon.com/256/8663/8663461.png',
                price: 1000,
                rating: 4.5,
                reviews: 10,
                lessons: '150+',
                students: '30K+',
                progress: 30
            },
            {
                id: 4,
                name: 'FOUNDATION',
                image: 'https://cdn-icons-png.flaticon.com/256/7139/7139119.png',
                price: 1000,
                rating: 4.5,
                reviews: 10,
                lessons: '120+',
                students: '25K+',
                progress: 20
            }
        ],
        stockMarket: [
            {
                id: 8,
                name: 'Price Action',
                image: 'https://cdn-icons-png.flaticon.com/256/16835/16835338.png',
                price: 1500,
                rating: 4.7,
                reviews: 25,
                lessons: '100+',
                students: '20K+',
                progress: 80
            },
            {
                id: 9,
                name: 'RSI & Price Action',
                image: 'https://cdn-icons-png.flaticon.com/256/5784/5784099.png',
                price: 2000,
                rating: 4.8,
                reviews: 18,
                lessons: '90+',
                students: '15K+',
                progress: 55
            },
            {
                id: 10,
                name: 'Option Trading',
                image: 'https://cdn-icons-png.flaticon.com/256/16835/16835338.png',
                price: 2500,
                rating: 4.9,
                reviews: 30,
                lessons: '80+',
                students: '10K+',
                progress: 35
            }
        ]
    },
    testSeries: [
        {
            id: 5,
            name: 'JEE Mock Tests',
            image: 'https://cdn-icons-png.flaticon.com/256/16835/16835338.png',
            price: 500,
            rating: 4.8,
            reviews: 15,
            lessons: '50+',
            students: '40K+'
        },
        {
            id: 6,
            name: 'NEET Practice Tests',
            image: 'https://cdn-icons-png.flaticon.com/256/5784/5784099.png',
            price: 500,
            rating: 4.7,
            reviews: 12,
            lessons: '40+',
            students: '35K+'
        },
        {
            id: 7,
            name: 'CET Test Series',
            image: 'https://cdn-icons-png.flaticon.com/256/16835/16835338.png',
            price: 500,
            rating: 4.6,
            reviews: 8,
            lessons: '30+',
            students: '25K+'
        }
    ]
}

const cardStyles = [
    'bg-cardinal-500',
    'bg-fox-500',
    'bg-beetle-500',
    'bg-humpback-500'
]

const borderStyles = [
    '#FF1818',
    '#CC7800',
    '#B54FFF',
    '#2259A1'
]

export default function CoursesList() {
    const courses: Course[] = [
        ...products.courses.academic,
        ...products.courses.stockMarket
    ];

    if (courses.length === 0) {
        return (
            <View className='flex-1 items-center justify-center pt-6 pb-20'>
                <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/256/5784/5784099.png' }} 
                    className='w-40 h-40 opacity-70 scale-120'
                    resizeMode="contain"
                />
                <Text className='text-2xl font-extrabold text-cardinal-500 mb-2'>
                    No Courses Yet
                </Text>
                <Text className='text-base text-ell-light text-center mb-6'>
                    Start your learning journey by enrolling in a course
                </Text>
                <TouchableOpacity 
                    className='bg-cardinal-500 px-8 py-4 rounded-3xl'
                    style={{
                        borderWidth: 3,
                        borderColor: '#FF1818',
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
                    <Text className='text-snow font-black tracking-wider'>Browse Courses</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView className='flex-1 px-4 pt-6'>
            {courses.map((course, index) => {
                const cardStyle = cardStyles[index % 4];
                const borderStyle = borderStyles[index % 4];
                return (
                    <View key={course.id} className='w-full mb-4'>
                        <TouchableOpacity 
                            className={`${cardStyle} rounded-3xl p-4`}
                            style={{
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
                        >
                            <View className='flex-row items-center mb-3'>
                                <View className='bg-white/10 rounded-2xl p-2.5 mr-3'>
                                    <Image 
                                        source={{ uri: course.image }} 
                                        className='w-[50px] h-[50px] scale-110'
                                        resizeMode="contain" 
                                    />
                                </View>
                                <View className='flex-1'>
                                    <Text className='text-white text-xl font-bold mb-2'>{course.name}</Text>
                                    {course.progress !== undefined && (
                                        <View className='h-5 bg-white/10 rounded-lg overflow-hidden relative'>
                                            <View className={`h-full bg-white/30 rounded-lg`} style={{width: `${course.progress}%`}} />
                                            <View className='absolute w-full h-full justify-center'>
                                                <Text className='text-center text-white text-xs font-bold'>{course.progress}% Complete</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View className='flex-row rounded-2xl p-3 bg-white/10 mb-3'>
                                <View className='items-center flex-1'>
                                    <Text className='text-white/80 text-xs mb-1'>Lessons</Text>
                                    <Text className='text-white font-extrabold text-base'>{course.lessons}</Text>
                                </View>
                                <View className='w-[3px] mx-3 bg-white/20' />
                                <View className='items-center flex-1'>
                                    <Text className='text-white/80 text-xs mb-1'>Students</Text>
                                    <Text className='text-white font-extrabold text-base'>{course.students}</Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                className='bg-white rounded-2xl p-3 items-center'
                                style={{
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
                            >
                                <Text className='text-black font-extrabold text-base tracking-wider'>Continue Learning</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </ScrollView>
    );
};