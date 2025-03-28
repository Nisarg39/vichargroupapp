import { View, Text, Image, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import { useState, useRef } from 'react'
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated'
import { FontAwesome5 } from '@expo/vector-icons'

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
        ],
        stockMarket: [
            {
                id: 8,
                name: 'Price Action',
                image: 'https://cdn-icons-png.flaticon.com/256/16835/16835338.png',
                price: 1500,
                lessons: '100+',
                students: '20K+'
            },
            {
                id: 9,
                name: 'RSI & Price Action',
                image: 'https://cdn-icons-png.flaticon.com/256/5784/5784099.png',
                price: 2000,
                lessons: '90+',
                students: '15K+'
            },
            {
                id: 10,
                name: 'Option Trading',
                image: 'https://cdn-icons-png.flaticon.com/256/16835/16835338.png',
                price: 2500,
                lessons: '80+',
                students: '10K+'
            }
        ]
    },
    testSeries: [
        {
            id: 5,
            name: 'JEE Mock Tests',
            image: 'https://cdn-icons-png.flaticon.com/256/16835/16835338.png',
            price: 500,
            lessons: '50+',
            students: '40K+'
        },
        {
            id: 6,
            name: 'NEET Practice Tests',
            image: 'https://cdn-icons-png.flaticon.com/256/5784/5784099.png',
            price: 500,
            lessons: '40+',
            students: '35K+'
        },
        {
            id: 7,
            name: 'CET Test Series',
            image: 'https://cdn-icons-png.flaticon.com/256/16835/16835338.png',
            price: 500,
            lessons: '30+',
            students: '25K+'
        }
    ]
}

interface Product {
    id: number
    name: string
    image: string
    price: number
    lessons: string
    students: string
}

interface Section {
    title: string
    data: Product[]
    icon: string
}

export default function CoursesList() {
    const [expandedSection, setExpandedSection] = useState<string>('')
    const screenWidth = Dimensions.get('window').width
    const cardWidth = (screenWidth - 64) / 2

    const renderItem = ({ item, index }: { item: Product; index: number }) => {
        const cardStyle = cardStyles[index % 4]
        const borderStyle = borderStyles[index % 4]
        return (
            <View className="my-2">
                <TouchableOpacity
                    className={`rounded-[20px] p-3 ${cardStyle}`}
                    style={{
                        width: cardWidth,
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
                    <View className="items-center justify-center mb-3">
                        <Image source={{ uri: item.image }} className="w-[70px] h-[70px]" resizeMode="contain" />
                    </View>
                    <Text numberOfLines={1} className="text-lg font-extrabold text-white mb-3 text-center">{item.name}</Text>
                    <View className="flex-row justify-between bg-white/10 rounded-lg p-2 mb-3">
                        <View className="flex-1 items-center">
                            <Text className="text-xs text-white/80 mb-0.5">Lessons</Text>
                            <Text className="text-sm text-white font-semibold">{item.lessons}</Text>
                        </View>
                        <View className="flex-1 items-center border-l border-white/20">
                            <Text className="text-xs text-white/80 mb-0.5">Students</Text>
                            <Text className="text-sm text-white font-semibold">{item.students}</Text>
                        </View>
                    </View>
                    <Text className="text-lg font-bold text-white mb-3">₹{item.price}</Text>
                    <TouchableOpacity 
                        className="bg-white rounded-2xl w-full"
                        style={{
                            borderWidth: 2,
                            borderColor: borderStyle,
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
                        <Text className="text-black font-bold text-xs px-3 py-1.5 text-center">Enroll Now</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        )
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

    const sections: Section[] = [
        { 
            title: 'Academic Courses', 
            data: products.courses.academic,
            icon: 'https://cdn-icons-png.flaticon.com/256/3152/3152771.png'
        },
        { 
            title: 'Stock Market Courses', 
            data: products.courses.stockMarket,
            icon: 'https://cdn-icons-png.flaticon.com/256/4222/4222019.png'
        },
        { 
            title: 'Test Series', 
            data: products.testSeries,
            icon: 'https://cdn-icons-png.flaticon.com/256/3024/3024593.png'
        }
    ]

    return (
        <FlatList
            data={sections}
            renderItem={({ item: section }) => (
                <View className="mb-5">
                    <TouchableOpacity
                        onPress={() => setExpandedSection(expandedSection === section.title ? '' : section.title)}
                        className="flex-row items-center justify-between bg-cardinal-500 rounded-2xl p-4"
                        style={{
                            borderWidth: 1,
                            borderColor: '#FF1818'
                        }}
                        activeOpacity={1}
                    >
                        <View className="flex-row items-center">
                            <Image 
                                source={{ uri: section.icon }} 
                                className="w-7 h-7 mr-3 tint-white"
                            />
                            <Text className="text-lg font-bold text-white tracking-wider">{section.title}</Text>
                        </View>
                        <FontAwesome5 name={expandedSection === section.title ? "chevron-down" : "chevron-right"} size={20} color="white" />
                    </TouchableOpacity>
                    {expandedSection === section.title && (
                        <FlatList
                            data={section.data}
                            renderItem={renderItem}
                            keyExtractor={(item: Product) => item.id.toString()}
                            numColumns={2}
                            contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 8 }}
                            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8, gap: 16 }}
                        />
                    )}
                </View>
            )}
            keyExtractor={(section) => section.title}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
        />
    )
}