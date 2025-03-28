import { View, Text, Image } from 'react-native'
export default function SettingsHeader() {
    return (
        <View className='p-6 bg-humpback rounded-b-[30px] items-center shadow-md'>
            <Text className='text-3xl font-bold text-white mb-2 font-comic'>Settings</Text>
            <Text className='text-base text-white/90 mb-5'>Customize your app experience</Text>
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/256/7648/7648167.png' }}
                className="w-[120px] h-[120px] tint-white"
                resizeMode="contain"
            />
        </View>
    )
}