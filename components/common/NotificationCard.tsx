import React, { useState } from "react"
import { View, Text, TouchableOpacity, Image, Linking } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface NotificationSchema {
    title: string;
    description: string;
    date: string;
    button: string;
    url: string;
}

export default function NotificationCard({title, description, date, button, url}: NotificationSchema) {
    const [isExpanded, setIsExpanded] = useState(false)
    
    return (
        <View className="my-2 items-center mx-4">
            <TouchableOpacity
                className="bg-violet-500 rounded-[20px] p-4"
                style={{
                    width: '100%',
                    borderWidth: 3,
                    borderColor: '#8B5CF6',
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
                onPress={() => setIsExpanded(!isExpanded)}
            >
                <View className="flex-row items-center">
                    <View className="items-center justify-center">
                        <View className="bg-white/30 rounded-full p-2" style={{shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
                            <View className="w-[50px] h-[50px] bg-white/20 rounded-full items-center justify-center">
                                <Ionicons name="notifications" size={24} color="white" />
                            </View>
                        </View>
                    </View>
                    <View className="flex-1 ml-4">
                        <Text numberOfLines={isExpanded ? undefined : 2} className="text-lg font-extrabold text-white leading-6 mb-2">{title}</Text>
                        <View className="flex-row justify-between bg-white/10 rounded-lg p-2 mb-2">
                            <View className="flex-1 items-center">
                                <Text className="text-[10px] text-white/80">Date</Text>
                                <Text className="text-xs text-white font-semibold">{date}</Text>
                            </View>
                            <View className="flex-1 items-center border-l border-white/20">
                                <Text className="text-[10px] text-white/80">Status</Text>
                                <Text className="text-xs text-white font-semibold">New</Text>
                            </View>
                        </View>
                        {isExpanded && (
                            <Text className="text-sm text-white/90 leading-5 mb-3">{description}</Text>
                        )}
                    </View>
                    <View className="ml-4 items-end">
                        <TouchableOpacity
                            className="bg-white rounded-xl mt-2"
                            style={{
                                borderWidth: 2,
                                borderColor: '#8B5CF6',
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
                            onPress={() => setIsExpanded(!isExpanded)}
                        >
                            <View className="flex-row items-center px-3 py-2">
                                <Text className="text-violet-600 font-bold text-xs mr-1">
                                    {isExpanded ? "Close" : "View"}
                                </Text>
                                <Ionicons 
                                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                                    size={12} 
                                    color="#8B5CF6" 
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                
                {isExpanded && (
                    <View className="mt-4 pt-4 border-t border-white/20">
                        <TouchableOpacity
                            className="bg-green-500 rounded-xl py-3 px-4"
                            style={{
                                borderWidth: 2,
                                borderColor: '#10B981',
                                borderBottomWidth: 4,
                                borderRightWidth: 4,
                                transform: [{ translateY: 0 }],
                            }}
                            activeOpacity={1}
                            onPressIn={(e) => {
                                e.currentTarget.setNativeProps({
                                    style: { 
                                        transform: [{ translateY: 2 }], 
                                        borderBottomWidth: 2, 
                                        borderRightWidth: 2 
                                    }
                                })
                            }}
                            onPressOut={(e) => {
                                e.currentTarget.setNativeProps({
                                    style: { 
                                        transform: [{ translateY: 0 }], 
                                        borderBottomWidth: 4, 
                                        borderRightWidth: 4 
                                    }
                                })
                            }}
                            onPress={() => {
                                if (url) {
                                    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
                                }
                            }}
                        >
                            <View className="flex-row items-center justify-center">
                                <Ionicons name="open-outline" size={16} color="white" />
                                <Text className="text-white font-bold text-sm ml-2">{button}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    )
}