import { View, Text, Image, TouchableOpacity, Animated, Platform, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { AuthContext } from '../_layout';
import { useContext } from 'react';
import { StudentContext } from '../context/StudentContext';
import { StudentData } from '../../src/types/interfaces';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomDrawerContentProps {
    navigation: any;
    state: any;
}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
    const router = useRouter();
    const { setIsSignedIn } = useContext(AuthContext);
    const { studentData, setStudentData } = useContext<{studentData: StudentData | null, setStudentData: any}>(StudentContext)
    const insets = useSafeAreaInsets();

    // console.log(studentData?.name)

    const handleSignOut = () => {
        setIsSignedIn(false);
    };

    return (
        <DrawerContentScrollView 
            {...props} 
            className="bg-white shadow-lg"
            contentContainerStyle={{
                paddingBottom: insets.bottom + 20 // Add padding to the bottom
            }}
        >
            <View className="p-4 items-center bg-white rounded-2xl m-2 shadow-xl border border-white/80">
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/256/8662/8662228.png' }}
                    className="w-[90px] h-[90px] rounded-full border-4 border-[#FF9600] mb-3 shadow-lg"
                />
                <Text className="text-2xl font-bold text-gray-800 mb-1 shadow-sm">{studentData?.name}</Text>
                <Text className="text-sm text-gray-700 bg-gray-100 py-1 px-3 rounded-full shadow">{studentData?.email}</Text>
            </View>
            <View className="mt-2">
                <TouchableOpacity
                    className='flex-row justify-between items-center p-3 bg-white rounded-2xl mx-2 my-2'
                    style={{
                        backgroundColor: props.state.index === 0 ? '#1CB0F6' : '#FFFFFF',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    }}
                    activeOpacity={0.7}
                    onPress={() => props.navigation.navigate('[tabs]')}
                >
                    <View className='flex-row items-center'>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/256/7648/7648203.png' }} className="w-[35px] h-[35px] mr-3" />
                        <Text className={`text-lg font-bold ${props.state.index === 0 ? 'text-white' : 'text-black'}`}>Home</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={20} color={props.state.index === 0 ? '#FFFFFF' : '#1CB0F6'} />
                </TouchableOpacity>

                <TouchableOpacity
                    className='flex-row justify-between items-center p-3 bg-white rounded-2xl mx-2 my-2'
                    style={{
                        backgroundColor: props.state.index === 1 ? '#2B70C9' : '#FFFFFF',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    }}
                    activeOpacity={0.7}
                    onPress={() => props.navigation.navigate('profile')}
                >
                    <View className='flex-row items-center'>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/256/7139/7139111.png' }} className="w-[35px] h-[35px] mr-3" />
                        <Text className={`text-lg font-bold ${props.state.index === 1 ? 'text-white' : 'text-black'}`}>Profile</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={20} color={props.state.index === 1 ? '#FFFFFF' : '#2B70C9'} />
                </TouchableOpacity>

                <TouchableOpacity
                    className='flex-row justify-between items-center p-3 bg-white rounded-2xl mx-2 my-2'
                    style={{
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    }}
                    activeOpacity={0.7}
                    onPress={handleSignOut}
                >
                    <View className='flex-row items-center'>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/256/14571/14571433.png' }} className="w-[35px] h-[35px] mr-3" />
                        <Text className='text-black text-lg font-bold'>Sign Out</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};
export default function Layout() {
    const router = useRouter();
    const scaleAnim = new Animated.Value(1);
    const insets = useSafeAreaInsets();

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.8,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <GestureHandlerRootView className="flex-1">
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={({ navigation }) => ({
                    headerStyle: { 
                        backgroundColor: '#FFFFFF',
                    },
                    headerTintColor: '#FF9600',
                    headerShadowVisible: false,
                    drawerStyle: { 
                        backgroundColor: '#FFFFFF',

                        width: 280,
                        paddingTop: insets.top
                    },
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => navigation.openDrawer()}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                        >
                            <Animated.Image 
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/151/151917.png' }}
                                className="w-[25px] h-[25px] ml-4"
                                style={{ transform: [{ scale: scaleAnim }] }}
                            />
                        </TouchableOpacity>
                    ),
                    contentStyle: {
                        paddingBottom: insets.bottom // Add padding to the bottom of the screen content
                    }
                })}
            >
                <Drawer.Screen name="[tabs]" options={{
                    title: 'VICHAR GROUP',
                    headerTitleStyle: { 
                        fontFamily: 'Tektur', 
                        fontSize: 25, 
                        color: 'black',
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                        letterSpacing: 0.5,
                        textAlign: 'center',
                        width: '100%',
                        fontWeight: '800'
                    },
                    headerTitleAlign: 'center',
                    headerStyle: { 
                        backgroundColor: '#FFFFFF'
                    },
                    headerTintColor: '#FF9600',
                    
                }} />
                <Drawer.Screen name="profile" options={{
                    title: 'Profile',
                    headerTitleStyle: { 
                        color: '#FF9600', 
                        fontSize: 20,
                        fontWeight: '600',
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2
                    }
                }} />
            </Drawer>
        </GestureHandlerRootView>
    )
}