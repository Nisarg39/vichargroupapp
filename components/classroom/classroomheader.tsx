import { View, Text, Image } from 'react-native'
export default function ClassroomHeader() {
    return (
        <View className='p-6 bg-green-500 rounded-b-[30px] items-center shadow-md'>
            <Text className='text-3xl font-bold text-white mb-2'>My Classroom</Text>
            <Text className='text-base text-white/90 mb-5'>Continue your learning journey</Text>
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/256/12608/12608941.png' }}
                className="w-[120px] h-[120px] tint-white"
                resizeMode="contain"
            />
        </View>
    );
}