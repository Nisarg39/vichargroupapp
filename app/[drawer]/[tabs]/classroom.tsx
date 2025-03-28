import { View} from 'react-native';
import ClassroomHeader from '../../../components/classroom/classroomheader'
import CoursesList from '../../../components/classroom/courseslist'

export default function Classroom(){
    return (
        <View className='flex-1 bg-green-50'>
            <ClassroomHeader />
            <CoursesList />
        </View>
    );
}