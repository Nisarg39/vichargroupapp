import { View, Text, Image, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import { useState, useRef } from 'react'
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated'
import { FontAwesome5 } from '@expo/vector-icons'

const products = {
    courses: {
        academic: [
            {
                id: 1,
                name: 'JEE',
                image: 'https://cdn-icons-png.flaticon.com/256/11483/11483670.png',
                price: 1000,
                discount: 20,
                lessons: '200+',
                students: '50K+'
            },
            {
                id: 2,
                name: 'NEET',
                image: 'https://cdn-icons-png.flaticon.com/256/8662/8662421.png',
                price: 1000,
                discount: 15,
                lessons: '180+',
                students: '45K+'
            },
            {
                id: 3,
                name: 'CET',
                image: 'https://cdn-icons-png.flaticon.com/256/8663/8663461.png',
                price: 1000,
                discount: 25,
                lessons: '150+',
                students: '30K+'
            },
            {
                id: 4,
                name: 'FOUNDATION',
                image: 'https://cdn-icons-png.flaticon.com/256/7139/7139119.png',
                price: 1000,
                discount: 10,
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
                discount: 30,
                lessons: '100+',
                students: '20K+'
            },
            {
                id: 9,
                name: 'RSI & Price Action',
                image: 'https://cdn-icons-png.flaticon.com/256/5784/5784099.png',
                price: 2000,
                discount: 20,
                lessons: '90+',
                students: '15K+'
            },
            {
                id: 10,
                name: 'Option Trading',
                image: 'https://cdn-icons-png.flaticon.com/256/16835/16835338.png',
                price: 2500,
                discount: 15,
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
            discount: 10,
            lessons: '50+',
            students: '40K+'
        },
        {
            id: 6,
            name: 'NEET Practice Tests',
            image: 'https://cdn-icons-png.flaticon.com/256/5784/5784099.png',
            price: 500,
            discount: 15,
            lessons: '40+',
            students: '35K+'
        },
        {
            id: 7,
            name: 'CET Test Series',
            image: 'https://cdn-icons-png.flaticon.com/256/16835/16835338.png',
            price: 500,
            discount: 20,
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
    discount: number
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
    const cardWidth = screenWidth - 32
    const scaleValue = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scaleValue.value }]
        }
    })

    const renderItem = ({ item, index }: { item: Product; index: number }) => {
        const cardStyle = cardStyles[index % 4]
        const borderStyle = borderStyles[index % 4]
        const discountedPrice = item.price - (item.price * item.discount / 100)

        scaleValue.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        )

        return (
            <View className="my-2 items-center">
                <TouchableOpacity
                    className={`rounded-[20px] p-4 ${cardStyle}`}
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
                    <View className="flex-row items-center">
                        <View className="items-center justify-center">
                            <View className="bg-white/30 rounded-full p-2" style={{shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
                                <Image source={{ uri: item.image }} className="w-[60px] h-[60px]" resizeMode="contain" />
                            </View>
                        </View>
                        <View className="flex-1 ml-4">
                            <Text numberOfLines={1} className="text-base font-extrabold text-white">{item.name}</Text>
                            
                            <View className="flex-row justify-between bg-white/10 rounded-lg p-2 mt-2">
                                <View className="flex-1 items-center">
                                    <Text className="text-[10px] text-white/80">Lessons</Text>
                                    <Text className="text-xs text-white font-semibold">{item.lessons}</Text>
                                </View>
                                <View className="flex-1 items-center border-l border-white/20">
                                    <Text className="text-[10px] text-white/80">Students</Text>
                                    <Text className="text-xs text-white font-semibold">{item.students}</Text>
                                </View>
                            </View>
                        </View>
                        
                        <View className="ml-4 items-end">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-xs text-white/60 line-through mr-2">₹{item.price}</Text>
                                <Animated.View style={animatedStyle} className="bg-white/20 rounded-lg px-1.5 py-0.5">
                                    <Text className="text-xs text-white font-bold">{item.discount}% OFF</Text>
                                </Animated.View>
                            </View>
                            <Text className="text-xl font-bold text-white mt-1">₹{discountedPrice}</Text>
                            
                            <TouchableOpacity 
                                className="bg-white rounded-xl mt-2"
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
                                <Text className="text-black font-bold text-xs px-4 py-2 text-center">Enroll Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
            icon: 'https://cdn-icons-png.flaticon.com/256/12583/12583400.png'
        },
        { 
            title: 'Stock Market Courses', 
            data: products.courses.stockMarket,
            icon: 'https://cdn-icons-png.flaticon.com/256/11752/11752764.png'
        },
        { 
            title: 'Test Series', 
            data: products.testSeries,
            icon: 'https://cdn-icons-png.flaticon.com/256/8021/8021882.png'
        }
    ]

    return (
        <FlatList
            data={sections}
            renderItem={({ item: section }) => (
                <View className="mb-5">
                    <TouchableOpacity
                        onPress={() => setExpandedSection(expandedSection === section.title ? '' : section.title)}
                        className="flex-row items-center justify-between bg-cardinal-500 rounded-2xl p-4 mx-4"
                        activeOpacity={1}
                    >
                        <View className="flex-row items-center">
                            <Image 
                                source={{ uri: section.icon }} 
                                className="w-10 h-10 mr-3"
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
                            contentContainerStyle={{ paddingTop: 16 }}
                        />
                    )}
                </View>
            )}
            keyExtractor={(section) => section.title}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
        />
    )
}