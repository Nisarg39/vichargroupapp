import React, { useState, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Modal, Dimensions, Image, ScrollView } from 'react-native';
import WebView from 'react-native-webview';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

interface ExercisesProps {
  exercises: any[]; // You can replace 'any' with a more specific type if you know the structure
}

const Exercises: React.FC<ExercisesProps> = ({ exercises }) => {
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
    const [pressedStates, setPressedStates] = useState<{[key: string]: boolean}>({});
    const { width: screenWidth } = Dimensions.get('window');
    const webviewRef = useRef<WebView>(null);
    
    if (!exercises || exercises.length === 0) {
        return (
            <View className="flex-1 bg-cardinal-50 justify-center items-center">
                <Text className="text-base text-gray-700">No exercises available</Text>
            </View>
        );
    }

    // Function to create a Google Docs viewer URL
    const getGoogleDocsViewerUrl = (pdfUrl: string) => {
        return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
    };

    const handleExpandPdf = (exerciseId: string) => {
        setExpandedExercise(exerciseId);
    };

    const handleClosePdf = () => {
        setExpandedExercise(null);
    };

    const handlePressIn = (exerciseId: string) => {
        setPressedStates(prev => ({...prev, [exerciseId]: true}));
    };

    const handlePressOut = (exerciseId: string) => {
        setPressedStates(prev => ({...prev, [exerciseId]: false}));
    };

    const handlePress = (exerciseId: string) => {
        handleExpandPdf(exerciseId);
        
        setTimeout(() => {
            setPressedStates(prev => ({...prev, [exerciseId]: false}));
        }, 100);
    };

    return (
        <View className="flex-1">
            <View className="mb-4 px-4">
                <Text className="text-gray-900 text-lg font-bold mb-2">
                    Total Exercises: {exercises.length}
                </Text>
            </View>
            
            <ScrollView className="flex-1 px-4">
                {exercises.map((exercise, index) => {
                    const isPressed = pressedStates[exercise._id] || false;
                    
                    return (
                        <View key={exercise._id} style={{ marginBottom: screenWidth * 0.04 }} className='w-full'>
                            <TouchableOpacity 
                                className="bg-humpback-500 rounded-[20px] overflow-hidden"
                                style={{
                                    borderWidth: 3,
                                    borderColor: '#2259A1',
                                    borderBottomWidth: isPressed ? 3 : 6,
                                    borderRightWidth: isPressed ? 3 : 6,
                                    transform: [{ translateY: isPressed ? 4 : 0 }],
                                }}
                                activeOpacity={1}
                                pressRetentionOffset={{top: 10, left: 10, right: 10, bottom: 10}}
                                onPress={() => handlePress(exercise._id)}
                                onPressIn={() => handlePressIn(exercise._id)}
                                onPressOut={() => handlePressOut(exercise._id)}
                            >
                                <View style={{ height: screenWidth * 0.35 }}>
                                    <WebView
                                        source={{ uri: getGoogleDocsViewerUrl(exercise.pdfUrl) }}
                                        style={{ flex: 1 }}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        scalesPageToFit={true}
                                        scrollEnabled={false}
                                        bounces={false}
                                    />
                                    <View 
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: 'rgba(0,0,0,0.4)'
                                        }}
                                    >
                                        <View style={{
                                            backgroundColor: 'rgba(255,255,255,0.25)',
                                            borderRadius: 50,
                                            padding: 15
                                        }}>
                                            <MaterialIcons name="description" size={24} color="white" />
                                        </View>
                                    </View>
                                </View>
                                
                                <View className="p-4">
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center flex-1 mr-2">
                                            <MaterialIcons name="assignment" size={20} color="white" style={{ marginRight: 8 }} />
                                            <Text className="text-white font-bold text-lg flex-1">
                                                {exercise.exerciseName || `Exercise ${index + 1}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {exercise.description && (
                                        <View className="flex-row items-start mt-2">
                                            <MaterialIcons name="info-outline" size={16} color="rgba(255,255,255,0.8)" style={{ marginRight: 8, marginTop: 2 }} />
                                            <Text className="text-white/80 text-sm leading-5 flex-1">
                                                {exercise.description}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Modal for expanded view */}
            <Modal
                visible={expandedExercise !== null}
                animationType="slide"
                transparent={false}
                onRequestClose={handleClosePdf}
            >
                <SafeAreaView className="flex-1 bg-white">
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                        <View className="flex-row items-center flex-1">
                            <MaterialIcons name="assignment" size={20} color="#2259A1" style={{ marginRight: 8 }} />
                            <Text className="text-gray-900 text-lg font-bold flex-1">
                                {expandedExercise && exercises.find(e => e._id === expandedExercise)?.exerciseName}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleClosePdf} className="p-2">
                            <Ionicons name="close-circle" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    
                    <View className="flex-1">
                        {expandedExercise && (
                            <WebView
                                ref={webviewRef}
                                source={{ 
                                    uri: getGoogleDocsViewerUrl(
                                        exercises.find(e => e._id === expandedExercise)?.pdfUrl
                                    ) 
                                }}
                                style={{ flex: 1 }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={true}
                                scalesPageToFit={true}
                                scrollEnabled={true}
                                bounces={true}
                                // This prevents navigation outside the PDF viewer
                                onNavigationStateChange={(navState) => {
                                    const currentExercise = exercises.find(e => e._id === expandedExercise);
                                    if (!currentExercise?.pdfUrl) return;
                                    const viewerUrl = getGoogleDocsViewerUrl(currentExercise.pdfUrl);
                                    
                                    // If trying to navigate away from the viewer, prevent it
                                    if (navState.url && !navState.url.includes('docs.google.com/viewer')) {
                                        // Reset to the viewer URL
                                        webviewRef.current?.stopLoading();
                                        webviewRef.current?.injectJavaScript(`
                                            window.location.href = "${viewerUrl}";
                                            true;
                                        `);
                                    }
                                }}
                            />
                        )}
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
}

export default Exercises;