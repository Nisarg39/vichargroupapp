import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useContext } from 'react'
import { AuthContext } from '../../_layout'
import { Link } from 'expo-router'
import BannerSection from '../../../components/home/BannerSection'
import Courses from '../../../components/home/Courses'
import EnquiryForm from '../../../components/home/EnquiryForm'
export default function Home() {
  const { isSignedIn } = useContext(AuthContext)
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        className='flex-1 bg-[#E8F7FE]'
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className='justify-start items-center'>
          <BannerSection />
          <Courses />
          <EnquiryForm />
          {/* <Link href='/notifications'>Notifications</Link> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}