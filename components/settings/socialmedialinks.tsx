import { TouchableOpacity, View, Dimensions, Text, Image, Linking } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function SocialMediaLinks() {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const iconSize = screenWidth < 380 ? 32 : screenWidth < 768 ? 40 : 48;
    const containerPadding = screenWidth < 380 ? 4 : screenWidth < 768 ? 6 : 8;
    
    return (
        <View className='w-full flex items-center pt-2 px-2 mt-2 mb-28'>
            <Text className='text-lg font-semibold mb-2'>Connect with us</Text>
            <View 
                className='flex-row justify-center gap-3 items-center'
                style={{
                    padding: containerPadding,
                    width: Math.min(screenWidth * 0.9, 400),
                }}>
                <TouchableOpacity className='p-2 active:scale-95' onPress={() => Linking.openURL('https://www.facebook.com/61577304190766/about/?_rdr')}>
                    <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/168/168754.png' }}
                        style={{
                            width: iconSize,
                            height: iconSize,
                            opacity: 0.9
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity className='p-2 active:scale-95' onPress={() => Linking.openURL('https://www.instagram.com/vichar_group/')}>
                    <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2112/2112753.png' }}
                        style={{
                            width: iconSize,
                            height: iconSize,
                            opacity: 0.9
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity className='p-2 active:scale-95' onPress={() => Linking.openURL('https://www.vichargroup.com/')}>
                    <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/16000/16000193.png' }}
                        style={{
                            width: iconSize,
                            height: iconSize,
                            opacity: 0.9
                        }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}