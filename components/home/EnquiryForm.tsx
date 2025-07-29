import { View, Text, TouchableOpacity, Dimensions, TextInput, Animated, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import ApiModal, { ModalType } from '../common/Modal';

type CourseType = 'JEE' | 'NEET' | 'MHT-CET' | 'SSC' | 'HSC' | "CBSE";


export default function EnquiryForm() {
    const screenWidth = Dimensions.get('window').width;
    const [selectedCourse, setSelectedCourse] = useState<CourseType>('JEE');
    const [message, setMessage] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<ModalType>('success');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState('');
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;
    const textInputRef = useRef<TextInput>(null);
    const containerRef = useRef<View>(null);

    const iconSize = screenWidth < 375 ? 18 : screenWidth < 768 ? 22 : screenWidth < 1024 ? 26 : 30;

    const courses: { type: CourseType; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
        { type: 'JEE', icon: 'rocket' },
        { type: 'NEET', icon: 'heart-pulse' },
        { type: 'MHT-CET', icon: 'trophy' },
        { type: 'SSC', icon: 'lightbulb-on' },
        { type: 'HSC', icon: 'lightbulb-on' },
        { type: 'CBSE', icon: 'lightbulb-on' },
    ];


    const handlePressIn = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 4,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 200,
                friction: 12,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            })
        ]).start();
    };

    const showModal = (type: ModalType, title: string, message: string) => {
        setModalType(type);
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleSubmitEnquiry = async () => {
        if (!message.trim()) {
            showModal('warning', 'Empty Message', 'Please enter a message before submitting your enquiry.');
            return;
        }

        setIsLoading(true);
        setApiResponse('');

        try {
            const token = await AsyncStorage.getItem('token');
            
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/app/signin/feelingConfusedMessage`, {
                message: message,
                token: token,
                streamName: selectedCourse,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                }
            });

            if (response.data.success) {
                setApiResponse('Your enquiry has been submitted successfully! We will get back to you soon.');
                showModal('success', 'Thank You', 'Your enquiry has been submitted successfully. We\'ll get back to you soon! ✨');
                setMessage('');
            } else {
                const errorMessage = response.data.message || 'Failed to submit enquiry. Please try again.';
                setApiResponse(errorMessage);
                showModal('error', 'Submission Failed', errorMessage);
            }
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            const errorMessage = 'An error occurred while submitting your enquiry. Please try again.';
            setApiResponse(errorMessage);
            showModal('error', 'Network Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View 
            ref={containerRef}
            className="w-full mb-20" 
            style={{ 
                paddingHorizontal: 16, 
                paddingBottom: 24
            }}
        >
                {/* Header Section */}
                <View className="py-6">
                    <Text className="text-2xl font-bold text-gray-800 tracking-wide text-center">Feeling Confused? 🤔</Text>
                    <Text className="text-sm text-gray-600 mt-2 text-center">Let our experts guide your path! ✨</Text>
                </View>

                {/* Course Selection */}
                <View className="mb-4 z-10">
                    <Text className="text-base text-gray-800 mb-2 font-semibold">Select Your Course 📚</Text>
                    <TouchableOpacity 
                        className="bg-white rounded-2xl p-4 flex-row justify-between items-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 5,
                            borderWidth: 2,
                            borderColor: '#1CB0F6',
                            borderBottomWidth: 4,
                            borderRightWidth: 4,
                        }}
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                        activeOpacity={0.9}
                    >
                        <View className="flex-row items-center gap-3">
                            <View className="bg-blue-50 rounded-full p-2">
                                <MaterialCommunityIcons 
                                    name={courses.find(c => c.type === selectedCourse)?.icon || 'school'} 
                                    size={iconSize} 
                                    color="#1CB0F6" 
                                />
                            </View>
                            <Text className="text-base text-gray-800 font-semibold">{selectedCourse}</Text>
                        </View>
                        <MaterialCommunityIcons 
                            name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
                            size={24} 
                            color="#1CB0F6" 
                        />
                    </TouchableOpacity>
                    
                    {isDropdownOpen && (
                        <View className="bg-white rounded-2xl mt-2 overflow-hidden"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 5,
                                borderWidth: 2,
                                borderColor: '#1CB0F6',
                            }}
                        >
                            {courses.map(({ type, icon }, index) => (
                                <TouchableOpacity
                                    key={type}
                                    className={`p-4 flex-row items-center gap-3 ${
                                        index < courses.length - 1 ? 'border-b border-gray-100' : ''
                                    } ${selectedCourse === type ? 'bg-blue-50' : ''}`}
                                    onPress={() => {
                                        setSelectedCourse(type);
                                        setIsDropdownOpen(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View className={`rounded-full p-2 ${selectedCourse === type ? 'bg-blue-100' : 'bg-gray-50'}`}>
                                        <MaterialCommunityIcons 
                                            name={icon} 
                                            size={iconSize} 
                                            color={selectedCourse === type ? "#1CB0F6" : "#6B7280"} 
                                        />
                                    </View>
                                    <Text className={`text-sm ${
                                        selectedCourse === type ? 'text-blue-600 font-bold' : 'text-gray-700 font-medium'
                                    }`}>
                                        {type}
                                    </Text>
                                    {selectedCourse === type && (
                                        <View className="ml-auto">
                                            <MaterialCommunityIcons name="check-circle" size={20} color="#1CB0F6" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Message Input */}
                <View className="mb-4">
                    <Text className="text-base text-gray-800 mb-2 font-semibold">Your Message 📝</Text>
                    <View
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 5,
                        }}
                    >
                        <TextInput
                            ref={textInputRef}
                            className="bg-white rounded-2xl p-4 text-base text-gray-800"
                            style={{
                                borderWidth: 2,
                                borderColor: '#1CB0F6',
                                borderBottomWidth: 4,
                                borderRightWidth: 4,
                                minHeight: 120,
                                maxHeight: 180,
                            }}
                            multiline
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Share your thoughts, questions, or concerns with us..."
                            placeholderTextColor="#9CA3AF"
                            textAlignVertical="top"
                            scrollEnabled={true}
                            onFocus={() => {
                                // Focus is now handled by parent KeyboardAvoidingView
                            }}
                        />
                    </View>
                </View>

                {/* API Response */}
                {apiResponse ? (
                    <View className={`mb-4 p-4 rounded-2xl ${
                        apiResponse.includes('successfully') ? 'bg-green-50' : 'bg-red-50'
                    }`}
                        style={{
                            borderWidth: 2,
                            borderColor: apiResponse.includes('successfully') ? '#10B981' : '#EF4444',
                            borderBottomWidth: 4,
                            borderRightWidth: 4,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons 
                                name={apiResponse.includes('successfully') ? "check-circle" : "alert-circle"} 
                                size={20} 
                                color={apiResponse.includes('successfully') ? "#10B981" : "#EF4444"} 
                            />
                            <Text className={`text-sm font-medium flex-1 ${
                                apiResponse.includes('successfully') ? 'text-green-700' : 'text-red-700'
                            }`}>
                                {apiResponse}
                            </Text>
                        </View>
                    </View>
                ) : null}

                {/* Submit Button */}
                <Animated.View style={{
                    transform: [
                        { scale: scaleAnim },
                        { translateY: translateYAnim }
                    ],
                    marginTop: 8,
                    marginBottom: 20,
                }}>
                    <TouchableOpacity
                        onPress={handleSubmitEnquiry}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={1}
                        disabled={isLoading || !message.trim()}
                        className={`rounded-2xl overflow-hidden w-full min-h-[56px] ${
                            isLoading || !message.trim() ? 'bg-gray-400' : 'bg-[#1CB0F6]'
                        }`}
                        style={{
                            borderWidth: 3,
                            borderColor: isLoading || !message.trim() ? '#9CA3AF' : '#0891B2',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <View className="flex-row items-center justify-center gap-3 p-4">
                            <MaterialCommunityIcons 
                                name={isLoading ? "loading" : "send"} 
                                size={iconSize} 
                                color="white" 
                            />
                            <Text className="text-white text-base font-bold">
                                {isLoading ? 'Sending Enquiry...' : 'Send Enquiry ✨'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

            <ApiModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                type={modalType}
                title={modalTitle}
                message={modalMessage}
            />
        </View>
    );
}