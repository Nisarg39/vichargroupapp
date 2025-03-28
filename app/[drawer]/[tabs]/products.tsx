import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native'
import ProductHeader from '../../../components/products/productheader'
import CoursesList from '../../../components/products/coursesList'

export default function Products() {
    return (
        <View className="flex-1 bg-cardinal-50">
            <ProductHeader />
            <CoursesList />
        </View>
    )
}