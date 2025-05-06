import React from 'react'
import { View, Text } from 'react-native'

interface ExercisesProps {
  exercises: any[]; // You can replace 'any' with a more specific type if you know the structure
}

const Exercises: React.FC<ExercisesProps> = ({ exercises }) => {
    // console.log(exercises)
    return (
        <View className="flex-1 bg-cardinal-50">
            <Text className="text-lg font-semibold text-gray-800">Exercises</Text>
        </View>
    )
}

export default Exercises