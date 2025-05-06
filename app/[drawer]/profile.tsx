import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { useContext } from 'react'
import { StudentContext } from '../context/StudentContext'
import { Ionicons, MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons'

import { StudentData } from '../../src/types/interfaces';

export default function Profile() {
    const { studentData, setStudentData } = useContext<{
        studentData: StudentData | null, 
        setStudentData: React.Dispatch<React.SetStateAction<StudentData | null>>
    }>(StudentContext)
    
    return (
        <ScrollView className="flex-1 bg-brand-50">
            <View className="p-6">
                <View className="items-center mb-8">
                    <View className="w-[120px] h-[120px] mb-4">
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/256/7139/7139111.png' }}
                            className="w-full h-full"
                            resizeMode="contain"
                        />
                    </View>
                    {studentData ? (
                        <>
                            <Text className="text-2xl font-bold text-brand-800 mb-1">{studentData.name}</Text>
                            <Text className="text-sm text-brand-600 bg-brand-50 py-1 px-4 rounded-full mb-2">{studentData.email}</Text>
                            <View className="bg-brand-100 py-2 px-6 rounded-lg border border-brand-200">
                                <Text className="text-sm font-medium text-brand-600">Referral Code: {studentData.referralCode}</Text>
                            </View>
                        </>
                    ) : (
                        <Text className="text-lg text-brand-500 italic">No student data available</Text>
                    )}
                </View>
                
                {studentData ? (
                    <>
                        <TouchableOpacity 
                            className='flex-row justify-between items-center p-4 bg-snow rounded-2xl my-2'
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
                                <FontAwesome5 name="user" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                                <Text className='text-black text-lg font-comic'>Name</Text>
                            </View>
                            <Text className="font-medium">{studentData.name}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            className='flex-row justify-between items-center p-4 bg-snow rounded-2xl my-2'
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
                                <FontAwesome5 name="envelope" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                                <Text className='text-black text-lg font-comic'>Email</Text>
                            </View>
                            <Text className="font-medium">{studentData.email}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            className='flex-row justify-between items-center p-4 bg-snow rounded-2xl my-2'
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
                                <FontAwesome5 name="phone" size={24} color="#4a4a4a" style={{marginRight: 12}} />
                                <Text className='text-black text-lg font-comic'>Phone</Text>
                            </View>
                            <Text className="font-medium">{studentData.phone}</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text className="text-brand-500 py-2">No profile information available</Text>
                )}
            </View>
        </ScrollView>
    )
}