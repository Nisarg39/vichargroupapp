import { View, ScrollView } from 'react-native'
import SettingsHeader from '../../../components/settings/settingsheader'
import SettingsList from '../../../components/settings/settingslist'
import SocialMediaLinks from '../../../components/settings/socialmedialinks'

export default function Settings() {
    return (
        <View className='flex-1 bg-humpback-50'>
            <SettingsHeader />
            <ScrollView className='w-full'>
                <SettingsList />
                <SocialMediaLinks />
            </ScrollView>
        </View>
    )
}