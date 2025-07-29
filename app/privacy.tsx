import { View, Text, TouchableOpacity, Switch, Alert, SafeAreaView, Platform, StatusBar, useWindowDimensions, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

export default function Privacy() {
    const [dataUsageEnabled, setDataUsageEnabled] = useState(true)
    const { width: screenWidth, height: screenHeight } = useWindowDimensions()
    const router = useRouter()

    useEffect(() => {
        loadPrivacySettings()
    }, [])

    const loadPrivacySettings = async () => {
        try {
            const savedDataUsage = await AsyncStorage.getItem('dataUsageEnabled')
            if (savedDataUsage !== null) {
                setDataUsageEnabled(JSON.parse(savedDataUsage))
            }
        } catch (error) {
            console.log('Error loading privacy settings:', error)
        }
    }

    const toggleDataUsage = async (value: boolean) => {
        try {
            setDataUsageEnabled(value)
            await AsyncStorage.setItem('dataUsageEnabled', JSON.stringify(value))
        } catch (error) {
            console.log('Error saving data usage setting:', error)
        }
    }

    const clearCache = async () => {
        Alert.alert(
            'Clear Cache',
            'This will remove all cached data including downloaded videos and temporary files. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // In a real app, you would clear actual cache here
                            Alert.alert('Success', 'Cache cleared successfully')
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear cache')
                        }
                    }
                }
            ]
        )
    }

    const resetAppPreferences = () => {
        Alert.alert(
            'Reset App Preferences',
            'This will reset all app settings to default values. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Reset all settings to default
                            await AsyncStorage.multiRemove([
                                'dataUsageEnabled',
                                'notificationsEnabled',
                                'themePreference'
                            ])
                            setDataUsageEnabled(true)
                            Alert.alert('Success', 'App preferences have been reset to default')
                        } catch (error) {
                            Alert.alert('Error', 'Failed to reset preferences')
                        }
                    }
                }
            ]
        )
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
            {/* Apply padding to the top of the SafeAreaView */}
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
                                Manage Your Data 🔒
                            </Text>
                            <Text 
                                style={{ fontSize: headerFontSize }} 
                                className="font-bold text-white tracking-wide"
                            >
                                Privacy Settings
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
                    {/* Data Usage */}
                    <View 
                className='flex-row justify-between items-center p-4 bg-snow rounded-2xl mb-4'
                style={{
                    borderWidth: 3,
                    borderColor: '#4a4a4a',
                    borderBottomWidth: 6,
                    borderRightWidth: 6,
                }}
            >
                <View className='flex-row items-center flex-1'>
                    <FontAwesome5 name="wifi" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                    <View className="flex-1">
                        <Text className='text-black text-lg font-comic'>Cellular Data Usage</Text>
                        <Text className='text-gray-600 text-sm font-comic'>Allow video streaming over cellular data</Text>
                    </View>
                </View>
                <Switch
                    trackColor={{ false: '#767577', true: '#1d77bc' }}
                    thumbColor={dataUsageEnabled ? '#f4f3f4' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleDataUsage}
                    value={dataUsageEnabled}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
            </View>

                    {/* Cache Management */}
                    <TouchableOpacity 
                className='flex-row justify-between items-center p-4 bg-snow rounded-2xl mb-4'
                style={{
                    borderWidth: 3,
                    borderColor: '#4a4a4a',
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
                onPress={clearCache}
            >
                <View className='flex-row items-center flex-1'>
                    <FontAwesome5 name="trash-alt" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                    <View className="flex-1">
                        <Text className='text-black text-lg font-comic'>Clear Cache</Text>
                        <Text className='text-gray-600 text-sm font-comic'>Remove cached data and temporary files</Text>
                    </View>
                </View>
                <FontAwesome5 name="chevron-right" size={20} color="#4a4a4a" />
            </TouchableOpacity>

                    {/* Reset App Preferences */}
                    <TouchableOpacity 
                className='flex-row justify-between items-center p-4 bg-snow rounded-2xl mb-4'
                style={{
                    borderWidth: 3,
                    borderColor: '#4a4a4a',
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
                onPress={resetAppPreferences}
            >
                <View className='flex-row items-center flex-1'>
                    <FontAwesome5 name="undo-alt" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                    <View className="flex-1">
                        <Text className='text-black text-lg font-comic'>Reset App Preferences</Text>
                        <Text className='text-gray-600 text-sm font-comic'>Reset all settings to default values</Text>
                    </View>
                </View>
                <FontAwesome5 name="chevron-right" size={20} color="#4a4a4a" />
            </TouchableOpacity>

                    <View className="mt-8 p-4 bg-blue-50 rounded-2xl" style={{
                borderWidth: 2,
                borderColor: '#1d77bc',
                borderBottomWidth: 4,
                borderRightWidth: 4,
            }}>
                <View className="flex-row items-center mb-2">
                    <FontAwesome5 name="info-circle" size={20} color="#1d77bc" style={{marginRight: 10}} />
                    <Text className="text-blue-800 font-comic font-bold text-lg">Privacy Notice</Text>
                </View>
                <Text className="text-blue-700 font-comic text-sm">
                    Your privacy is important to us. These settings help you control how the app uses your device's resources and manages your data locally.
                </Text>
            </View>
                </ScrollView>
            </SafeAreaView>
            <StatusBar barStyle="light-content" backgroundColor="#2259A1" />
        </View>
    )
}