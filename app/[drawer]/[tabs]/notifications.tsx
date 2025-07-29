import { View, Text, ScrollView, Image } from 'react-native';
import NotificationCard from '@/components/common/NotificationCard';

const notificationArray = [
    {
        title: "Welcome to Vichar Group",
        description: "Choose a product from products and enhance your learning experience",
        date: "Jan 15",
        button: "View",
        url: "https://www.vichargroup.com/"
    },
    // {
    //     title: "Chemistry Lab",
    //     description: "Practice sessions available for organic chemistry experiments",
    //     date: "Jan 18",
    //     button: "Join",
    //     url: "https://www.vichargroup.com/chemistry-lab"
    // },
]

export default function Notifications() {
    return (
        <View className='flex-1 bg-violet-50'>
            {/* Header matching ClassroomHeader style */}
            <View className='p-6 rounded-b-[30px] items-center shadow-md bg-violet-500'>
                <Text className='text-3xl font-bold text-white mb-2'>Notifications</Text>
                <Text className='text-base text-white/90 mb-5'>Stay updated with your learning journey</Text>
                <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/256/7603/7603236.png' }}
                    className="w-[120px] h-[120px] tint-white"
                    resizeMode="contain"
                />
            </View>
            
            {/* Content Area */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-5">
                    <Text className="text-base text-gray-600 mb-2">Hello, Student! 👋</Text>
                    <Text className="text-xl font-bold text-gray-800 tracking-wide mb-4">Recent Notifications</Text>
                </View>
                
                {notificationArray.map((notification, index) => (
                    <NotificationCard
                        key={index}
                        title={notification.title}
                        description={notification.description}
                        date={notification.date}
                        button={notification.button}
                        url={notification.url}
                    />
                ))}
                
                {/* Empty State */}
                {notificationArray.length === 0 && (
                    <View className="items-center justify-center py-20">
                        <View className="bg-violet-100 rounded-full p-6 mb-4">
                            <Text className="text-4xl text-center">🔔</Text>
                        </View>
                        <Text className="text-xl font-bold text-violet-600 mb-2 text-center">All caught up!</Text>
                        <Text className="text-gray-600 text-center">You have no new notifications</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}