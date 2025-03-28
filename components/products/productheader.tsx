import {View, Text, Image} from 'react-native'

export default function ProductHeader() {
    return (
        <View className="p-6 bg-cardinal-500 rounded-b-[30px] items-center shadow-md">
            <Text className="text-3xl font-bold text-white mb-2">Our Products</Text>
            <Text className="text-base text-white/90 mb-5">Choose from our wide range of products</Text>
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/256/5784/5784099.png' }} 
                className="w-[120px] h-[120px] tint-white"
                resizeMode="contain"
            />
        </View>
    )
}