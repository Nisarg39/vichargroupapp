import { View, Text, TouchableOpacity, Dimensions, ScrollView, TextInput, Animated, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef } from 'react';

type CourseType = 'JEE MASTER' | 'NEET WARRIOR' | 'CET CHAMPION' | 'FOUNDATION';

const SuccessModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-blue-900/60">
                <View className="bg-white rounded-3xl p-7 items-center w-[85%] border-2 border-blue-200">
                    <Text className="text-[24px] font-bold text-gray-800 mb-3.5">Thank You! 🎉</Text>
                    <Text className="text-[16px] text-gray-600 text-center mb-5 leading-[22px]">
                        Your enquiry has been submitted successfully. We'll get back to you soon! ✨
                    </Text>
                    <TouchableOpacity
                        className="bg-blue-400 px-7 py-3.5 rounded-2xl"
                        onPress={onClose}
                    >
                        <Text className="text-white text-[16px] font-bold">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default function EnquiryForm() {
    const screenWidth = Dimensions.get('window').width;
    const [selectedCourse, setSelectedCourse] = useState<CourseType>('JEE MASTER');
    const [message, setMessage] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    const iconSize = screenWidth < 375 ? 18 : screenWidth < 768 ? 22 : screenWidth < 1024 ? 26 : 30;

    const courses: { type: CourseType; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
        { type: 'JEE MASTER', icon: 'rocket' },
        { type: 'NEET WARRIOR', icon: 'heart-pulse' },
        { type: 'CET CHAMPION', icon: 'trophy' },
        { type: 'FOUNDATION', icon: 'lightbulb-on' }
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

    return (
        <ScrollView className="w-full flex-1 p-4">
            <View className="flex-col items-center p-5">
                <Text className="text-2xl font-bold text-gray-900 tracking-wider">Feeling Confused? 🤔</Text>
                <Text className="text-sm text-gray-600 mt-2">Let our experts guide your path! ✨</Text>
            </View>

            <View className="mx-3.5 my-3.5 z-10">
                <TouchableOpacity 
                    className="bg-white rounded-2xl p-3.5 flex-row justify-between items-center border-2 border-blue-200"
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <View className="flex-row items-center gap-2.5">
                        <MaterialCommunityIcons 
                            name={courses.find(c => c.type === selectedCourse)?.icon || 'school'} 
                            size={iconSize} 
                            color="#1CB0F6" 
                        />
                        <Text className="text-[16px] text-gray-800 font-semibold">{selectedCourse}</Text>
                    </View>
                    <MaterialCommunityIcons 
                        name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
                        size={22} 
                        color="#1CB0F6" 
                    />
                </TouchableOpacity>
                
                {isDropdownOpen && (
                    <View className="bg-white rounded-2xl mt-2 border-2 border-blue-200">
                        {courses.map(({ type, icon }) => (
                            <TouchableOpacity
                                key={type}
                                className={`p-3.5 border-b border-blue-200 flex-row items-center gap-2.5 ${
                                    selectedCourse === type ? 'bg-blue-50' : ''
                                }`}
                                onPress={() => {
                                    setSelectedCourse(type);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                <MaterialCommunityIcons 
                                    name={icon} 
                                    size={iconSize} 
                                    color={selectedCourse === type ? "#1CB0F6" : "#4A5568"} 
                                />
                                <Text className={`text-[14px] ${
                                    selectedCourse === type ? 'text-blue-400 font-bold' : 'text-gray-800'
                                }`}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <View className="mx-3.5 mb-2">
                <Text className="text-[16px] text-gray-800 mb-1.5 font-semibold">Your Message 📝</Text>
                <TextInput
                    className="bg-white rounded-2xl p-3.5 text-[14px] text-gray-800 min-h-[100px] border-2 border-blue-200"
                    multiline
                    numberOfLines={4}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Share your thoughts with us..."
                    placeholderTextColor="#A0AEC0"
                />
            </View>

            <Animated.View style={{
                transform: [
                    { scale: scaleAnim },
                    { translateY: translateYAnim }
                ],
                marginHorizontal: 14,
                marginTop: 8,
                marginBottom: 20,
                alignSelf: 'stretch',
            }}>
                <TouchableOpacity
                    onPress={() => {
                        console.log('Selected Course:', selectedCourse);
                        console.log('Message:', message);
                        setModalVisible(true);
                    }}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                    className="rounded-2xl overflow-hidden bg-blue-400 w-full min-h-[45px] border-b-4 border-r-2 border-blue-600"
                >
                    <View className="flex-row items-center justify-center gap-2.5 p-2.5">
                        <MaterialCommunityIcons name="email-fast" size={iconSize} color="white" />
                        <Text className="text-white text-[16px] font-bold">Send Enquiry ✨</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>

            <SuccessModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </ScrollView>
    );
}