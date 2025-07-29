import { View, Text, TouchableOpacity, Switch, Linking } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { router } from 'expo-router'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState, useEffect } from 'react'

export default function SettingsList() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)

    useEffect(() => {
        loadNotificationSettings()
    }, [])

    const loadNotificationSettings = async () => {
        try {
            const savedSetting = await AsyncStorage.getItem('notificationsEnabled')
            if (savedSetting !== null) {
                setNotificationsEnabled(JSON.parse(savedSetting))
            }
        } catch (error) {
            console.log('Error loading notification settings:', error)
        }
    }

    const toggleNotifications = async (value: boolean) => {
        try {
            setNotificationsEnabled(value)
            await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value))
        } catch (error) {
            console.log('Error saving notification settings:', error)
        }
    }

    return (
        <View className='mt-4'>
            <TouchableOpacity 
                className='flex-row justify-between items-center p-4 bg-snow rounded-2xl mx-4 my-2'
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
                onPress={() => router.push('/(drawer)/profile')}
            >
                <View className='flex-row items-center'>
                    <FontAwesome5 name="user-circle" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                    <Text className='text-black text-lg font-comic'>Account</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={20} color="#4a4a4a" />
            </TouchableOpacity>
            <View 
                className='flex-row justify-between items-center px-4 bg-snow rounded-2xl mx-4 my-2'
                style={{
                    borderWidth: 3,
                    borderColor: '#4a4a4a',
                    borderBottomWidth: 6,
                    borderRightWidth: 6,
                }}
            >
                <View className='flex-row items-center'>
                    <FontAwesome5 name="bell" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                    <Text className='text-black text-lg font-comic'>Notifications</Text>
                </View>
                <Switch
                    trackColor={{ false: '#767577', true: '#1d77bc' }}
                    thumbColor={notificationsEnabled ? '#f4f3f4' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleNotifications}
                    value={notificationsEnabled}
                />
            </View>
            <TouchableOpacity 
                className='flex-row justify-between items-center p-4 bg-snow rounded-2xl mx-4 my-2'
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
                onPress={() => router.push('/privacy')}
            >
                <View className='flex-row items-center'>
                    <FontAwesome5 name="shield-alt" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                    <Text className='text-black text-lg font-comic'>Privacy</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={20} color="#4a4a4a" />
            </TouchableOpacity>
            <TouchableOpacity 
                className='flex-row justify-between items-center p-4 bg-snow rounded-2xl mx-4 my-2'
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
                onPress={() => router.push('/helpAndsupport')}
            >
                <View className='flex-row items-center'>
                    <FontAwesome5 name="question-circle" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                    <Text className='text-black text-lg font-comic'>Help & Support</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={20} color="#4a4a4a" />
            </TouchableOpacity>
            <TouchableOpacity 
                className='flex-row justify-between items-center p-4 bg-snow rounded-2xl mx-4 my-2'
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
                onPress={() => Linking.openURL('https://www.vichargroup.com/about-us')}
            >
                <View className='flex-row items-center'>
                    <FontAwesome5 name="info-circle" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                    <Text className='text-black text-lg font-comic'>About</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={20} color="#4a4a4a" />
            </TouchableOpacity>
        </View>
    )
}