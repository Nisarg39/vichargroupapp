import { View, Text, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

export default function SettingsList() {
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
            >
                <View className='flex-row items-center'>
                    <FontAwesome5 name="user-circle" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                    <Text className='text-black text-lg font-comic'>Account</Text>
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
            >
                <View className='flex-row items-center'>
                    <FontAwesome5 name="bell" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                    <Text className='text-black text-lg font-comic'>Notifications</Text>
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