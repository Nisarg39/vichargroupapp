import React from 'react'
import { View, Text } from 'react-native'

interface DPPsProps {
  dpps: any[]; // You can replace 'any' with a more specific type if you know the structure
}

const DPPs: React.FC<DPPsProps> = ({ dpps }) => {
    // console.log(dpps[0])
    return (
        <View className="flex-1 bg-cardinal-50">
            <Text className="text-lg font-semibold text-gray-800">DPPs</Text>
        </View>
    )
}

export default DPPs