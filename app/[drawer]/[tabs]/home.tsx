import { View, Text, ScrollView } from 'react-native'
import { useContext } from 'react'
import { AuthContext } from '../../_layout'
import { Link } from 'expo-router'
import BannerSection from '../../../components/home/BannerSection'
import Courses from '../../../components/home/Courses'
import EnquiryForm from '../../../components/home/EnquiryForm'
export default function Home() {
  const { isSignedIn } = useContext(AuthContext)
  return (
    <ScrollView className='flex-1 bg-[#E8F7FE]'>
      <View className='justify-start items-center'>
        <BannerSection />
        <Courses />
        <EnquiryForm />
        {/* <Link href='/notifications'>Notifications</Link> */}
      </View>
    </ScrollView>
  )
}