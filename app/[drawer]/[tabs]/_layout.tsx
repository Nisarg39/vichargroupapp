import { Tabs } from "expo-router";
import { useRouter } from "expo-router";
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  
  const tabBarHeight = Math.min(windowHeight * 0.1, 75); // Reduced height
  const iconSize = Math.min(windowWidth * 0.07, 32);
  const paddingTop = Math.min(windowHeight * 0.012, 8); // Reduced padding
  const fontSize = Math.min(windowWidth * 0.028, 12);
  const iconPadding = Math.min(windowWidth * 0.008, 4);
  const iconMarginBottom = 0;
  const labelMarginTop = -2; // Adjusted for better spacing

  return (
    <Tabs
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        height: tabBarHeight,
        paddingTop: paddingTop,
        backgroundColor: route.name === 'home' ? '#E8F7FE' :
                       route.name === 'products' ? '#FFECEC' :
                       route.name === 'classroom' ? '#FFF7ED' :
                       route.name === 'notifications' ? '#F3E8FF' :
                       route.name === 'settings' ? '#E8F0F9' : '#fff',
        maxHeight: 75,
        borderTopWidth: 0,
      },
    tabBarHideOnKeyboard: true,
    tabBarItemStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      height: tabBarHeight * 0.9, // Increased proportion
      maxHeight: 67,
      paddingHorizontal: 2,
      paddingVertical: 4,
    },
    tabBarIconStyle: {
      marginBottom: iconMarginBottom,
      height: iconSize + (iconPadding * 2),
      width: iconSize + (iconPadding * 2),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabBarLabelStyle: {
      fontSize: fontSize,
      marginTop: labelMarginTop,
      color: 'black'
    },
    animation: 'shift',
    tabBarVariant: 'uikit',
    })}
    >
      <Tabs.Screen name="home" options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name="home"
            size={iconSize}
            color={focused ? '#1CB0F6' : 'black'}
            style={{ padding: iconPadding }}
          />
        ),
      }} />
      <Tabs.Screen name="products"
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="cart"
              size={iconSize}
              color={focused ? '#FF4B4B' : 'black'}
              style={{ padding: iconPadding }}
            />
          ),
        }}
      />
      <Tabs.Screen name="classroom" options={{
        tabBarLabel: 'Classroom',
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name="school"
            size={iconSize}
            color={focused ? '#F97316' : 'black'}
            style={{ padding: iconPadding }}
          />
        ),
      }} />
      <Tabs.Screen 
        name="notifications" 
        options={{
        tabBarLabel: 'Notifications',
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name="notifications"
            size={iconSize}
            color={focused ? '#CE82FF' : 'black'}
            style={{ padding: iconPadding }}
          />
        ),
        }} 
      />
      <Tabs.Screen name="settings" options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name="settings"
            size={iconSize}
            color={focused ? '#2B70C9' : 'black'}
            style={{ padding: iconPadding }}
          />
        ),
      }} />
    </Tabs>
  )
}