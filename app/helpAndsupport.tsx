import { View, Text, TouchableOpacity, Alert, SafeAreaView, Platform, StatusBar, useWindowDimensions, ScrollView, TextInput, Image } from 'react-native'
import { useState, useContext } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StudentContext } from './context/StudentContext'
import { StudentData } from '../src/types/interfaces'
import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HelpAndSupport() {
    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const { width: screenWidth, height: screenHeight } = useWindowDimensions()
    const router = useRouter()
    const { studentData } = useContext<{
        studentData: StudentData | null, 
        setStudentData: React.Dispatch<React.SetStateAction<StudentData | null>>
    }>(StudentContext)

    // console.log(studentData)

    const handleSendMessage = async () => {
        if (!message.trim()) {
            Alert.alert('Error', 'Please enter a message before sending.')
            return
        }

        setIsSending(true)
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/app/signin/studentAppSupport`, {
                token: token,
                message: message
            },{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                }
            })

            if(response.data.success){
                Alert.alert(
                    'Message Sent!',
                    'Thank you for contacting us. Our support team will get back to you within 24 hours.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setMessage('')
                                router.back()
                            }
                        }
                    ]
                )
            }

        } catch (error) {
            Alert.alert('Error', 'Failed to send message. Please try again.')
        } finally {
            setIsSending(false)
        }
    }

    // Calculate responsive sizes
    const isSmallScreen = screenWidth < 360
    const headerHeight = screenHeight * 0.12
    const iconSize = screenWidth * 0.06 > 24 ? 24 : screenWidth * 0.06
    const headerFontSize = isSmallScreen ? 18 : 22
    const subHeaderFontSize = isSmallScreen ? 13 : 16

    // Calculate additional top padding for notch
    const topPadding = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0

    return (
        <View style={{ flex: 1, backgroundColor: '#E6EEF5' }}>
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
                                We're here to help! =�
                            </Text>
                            <Text 
                                style={{ fontSize: headerFontSize }} 
                                className="font-bold text-white tracking-wide"
                            >
                                Help & Support
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
                    {/* Student Details Card */}
                    <View 
                        className='bg-white rounded-2xl p-6 mb-6'
                        style={{
                            borderWidth: 3,
                            borderColor: '#4a4a4a',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                        }}
                    >
                        <Text className="text-lg font-bold text-black font-comic mb-4 text-center">Your Details</Text>
                        
                        <View className="flex-row items-center mb-4">
                            <View 
                                className="w-16 h-16 rounded-full bg-brand-100 p-1 mr-4"
                                style={{
                                    borderWidth: 2,
                                    borderColor: '#1d77bc',
                                }}
                            >
                                <View className="w-full h-full rounded-full overflow-hidden bg-brand-50">
                                    <Image
                                        source={{ 
                                            uri: studentData?.gender === 'female' 
                                                ? "https://cdn-icons-gif.flaticon.com/13372/13372960.gif" 
                                                : studentData?.gender === 'male'
                                                ? "https://cdn-icons-gif.flaticon.com/12146/12146129.gif"
                                                : 'https://cdn-icons-png.flaticon.com/256/7139/7139111.png'
                                        }}
                                        className="w-full h-full"
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-xl font-bold text-black font-comic">
                                    {studentData?.name || 'Student'}
                                </Text>
                                <Text className="text-gray-600 font-comic">
                                    {studentData?.email || 'No email provided'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Message Input */}
                    <View 
                        className='bg-white rounded-2xl p-6 mb-6'
                        style={{
                            borderWidth: 3,
                            borderColor: '#4a4a4a',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                        }}
                    >
                        <Text className="text-lg font-bold text-black font-comic mb-4">How can we help you?</Text>
                        
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type your message here... We're here to assist you with any questions or issues you may have."
                            multiline
                            numberOfLines={6}
                            className="bg-gray-50 rounded-xl p-4 text-black font-comic"
                            style={{
                                borderWidth: 2,
                                borderColor: '#e5e7eb',
                                textAlignVertical: 'top',
                                minHeight: 120,
                                fontSize: 16,
                            }}
                            maxLength={500}
                        />
                        
                        <View className="flex-row justify-between items-center mt-2">
                            <Text className="text-gray-500 text-sm font-comic">
                                {message.length}/500 characters
                            </Text>
                            {message.length > 450 && (
                                <Text className="text-orange-500 text-sm font-comic font-bold">
                                    Almost at limit!
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Send Button */}
                    <TouchableOpacity 
                        className={`rounded-2xl p-4 ${isSending ? 'bg-gray-400' : 'bg-brand-600'}`}
                        style={{
                            borderWidth: 3,
                            borderColor: '#4a4a4a',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                            opacity: isSending ? 0.7 : 1
                        }}
                        onPress={handleSendMessage}
                        disabled={isSending || !message.trim()}
                        activeOpacity={1}
                        onPressIn={(e) => {
                            if (!isSending && message.trim()) {
                                e.currentTarget.setNativeProps({
                                    style: { transform: [{ translateY: 4 }], borderBottomWidth: 3, borderRightWidth: 3 }
                                })
                            }
                        }}
                        onPressOut={(e) => {
                            if (!isSending && message.trim()) {
                                e.currentTarget.setNativeProps({
                                    style: { transform: [{ translateY: 0 }], borderBottomWidth: 6, borderRightWidth: 6 }
                                })
                            }
                        }}
                    >
                        <View className="flex-row items-center justify-center">
                            {isSending ? (
                                <>
                                    <FontAwesome5 name="spinner" size={20} color="white" style={{marginRight: 10}} />
                                    <Text className="text-white text-lg font-comic font-bold">Sending...</Text>
                                </>
                            ) : (
                                <>
                                    <FontAwesome5 name="paper-plane" size={20} color="white" style={{marginRight: 10}} />
                                    <Text className="text-white text-lg font-comic font-bold">
                                        {message.trim() ? 'Send Message' : 'Enter a message first'}
                                    </Text>
                                </>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Help Info */}
                    <View className="mt-6 p-4 bg-green-50 rounded-2xl" style={{
                        borderWidth: 2,
                        borderColor: '#10b981',
                        borderBottomWidth: 4,
                        borderRightWidth: 4,
                    }}>
                        <View className="flex-row items-center mb-2">
                            <FontAwesome5 name="info-circle" size={20} color="#10b981" style={{marginRight: 10}} />
                            <Text className="text-green-800 font-comic font-bold text-lg">Support Info</Text>
                        </View>
                        <Text className="text-green-700 font-comic text-sm">
                            • Our support team typically responds within 24 hours
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <StatusBar barStyle="light-content" backgroundColor="#2259A1" />
        </View>
    )
}