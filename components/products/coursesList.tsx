import { View, Text, Image, Dimensions, TouchableOpacity, FlatList, Linking } from 'react-native'
import { useState, useRef, useEffect } from 'react'
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated'
import { FontAwesome5 } from '@expo/vector-icons'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Product {
    _id: string
    name: string
    image: string
    price: number
    discountPrice: number
    lessons: string
    students: string
    pageParameters: string
}

interface Section {
    title: string
    data: Product[]
}

export default function CoursesList() {
    const [expandedSection, setExpandedSection] = useState<string>('')
    const [sections, setSections] = useState<Section[]>([])
    const screenWidth = Dimensions.get('window').width
    const cardWidth = screenWidth - 32
    const scaleValue = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scaleValue.value }]
        }
    })

    async function getSegments(){
        const token = await AsyncStorage.getItem('token')
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/app/signin/getSegments`,{
            token: token
          },{
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            }
          });

        //   console.log(response.data.segments[0])

        const formattedSections = response.data.segments.map((segment: any) => ({
            title: segment.name,
            data: segment.products
        }));
        
        setSections(formattedSections);
        return response.data.segments;
    }

    useEffect(() => {
        getSegments()
    }, [])

    const renderItem = ({ item, index }: { item: Product; index: number }) => {
        const cardStyle = cardStyles[index % 4]
        const borderStyle = borderStyles[index % 4]
        const discount = ((item.price - item.discountPrice) / item.price) * 100

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
                            <Text numberOfLines={2} className="text-base font-extrabold text-white leading-5 -mt-2">{item.name}</Text>
                        </View>
                        
                        <View className="ml-4 items-end">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-xs text-white/60 line-through mr-2">₹{item.price}</Text>
                                <Animated.View style={animatedStyle} className="bg-white/20 rounded-lg px-1.5 py-0.5">
                                    <Text className="text-xs text-white font-bold">{Math.round(discount)}% OFF</Text>
                                </Animated.View>
                            </View>
                            <Text className="text-xl font-bold text-white mt-1">₹{item.discountPrice}</Text>
                            
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
                                // onPress={() => Linking.openURL(`${process.env.EXPO_PUBLIC_API_URL}/${item.pageParameters}`)}
                                onPress={() => Linking.openURL(`${process.env.EXPO_PUBLIC_API_URL}`)}
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
                            <FontAwesome5 
                                name="book"
                                size={20} 
                                color="white" 
                                style={{ marginRight: 10 }} 
                            />
                            <Text className="text-lg font-bold text-white tracking-wider">{section.title}</Text>
                        </View>
                        <FontAwesome5 name={expandedSection === section.title ? "chevron-down" : "chevron-right"} size={20} color="white" />
                    </TouchableOpacity>
                    {expandedSection === section.title && (
                        <FlatList
                            data={section.data}
                            renderItem={renderItem}
                            keyExtractor={(item: Product) => item._id.toString()}
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