import {View, Text, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native'
import {useContext, useEffect, useState} from 'react'
import { StudentContext } from '../../app/context/StudentContext'
import { useRouter } from 'expo-router'

interface Course {
    id: number;
    name: string;
    image: string;
    price: number;
    reviews: number;
    students: string;
    progress?: number;
    productId: string;
    subjectsCount: number;
    chaptersCount: number;
    subjects?: any[];
}

const cardStyles = [
    'bg-[#1ecbe1]',
    'bg-fox-500',
    'bg-beetle-500',
    'bg-humpback-500'
];

const borderStyles = [
    '#0891B2',
    '#CC7800',
    '#B54FFF',
    '#2259A1'
];

const DEFAULT_IMAGE = 'https://cdn-icons-png.flaticon.com/256/11483/11483670.png';

export default function CoursesList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { studentData } = useContext(StudentContext);
    const router = useRouter();

    useEffect(() => {
        if (studentData && studentData.purchases) {
            const purchasedCourses = studentData.purchases
                .filter(purchase => purchase.product.type === 'course' || purchase.product.type === 'mtc')
                .map((purchase) => {
                    const product = purchase.product;
                    const subjectsCount = product.subjects?.length || 0;
                    const chaptersCount = product.subjects?.reduce((total: number, subject: any) => 
                        total + (subject.chapters?.length || 0), 0) || 0;
                    
                    return {
                        id: typeof product._id === 'string' ? parseInt(product._id.replace(/\D/g, '')) : (product._id || Math.random()),
                        name: product.name || 'Unnamed Course',
                        image: product.image || DEFAULT_IMAGE,
                        price: product.price || 0,
                        reviews: product.reviews || 0,
                        students: product.students || '1K+',
                        progress: purchase.progress || 0,
                        productId: product._id,
                        subjectsCount,
                        chaptersCount,
                        subjects: product.subjects || []
                    };
                });
            
            setCourses(purchasedCourses);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [studentData]);

    const handleContinueLearning = (course: Course) => {


        // pass the productType as params mtc or course

        
        if (course.subjects) {
            router.push({
                pathname: "/subjects",
                params: { 
                    subjects: JSON.stringify(course.subjects)

                }
            });
        } else {
            console.log("Subjects not available");
        }
    };

    if (loading) {
        return (
            <View className='flex-1 items-center justify-center'>
                <Text className='text-xl font-bold'>Loading your courses...</Text>
            </View>
        );
    }

    if (courses.length === 0) {
        return (
            <View className='flex-1 items-center justify-center pt-6 pb-24'>
                <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/256/5784/5784099.png' }} 
                    className='w-40 h-40 opacity-70 scale-120'
                    resizeMode="contain"
                />
                <Text className='text-2xl font-extrabold text-cardinal-500 mb-2'>
                    No Courses Yet
                </Text>
                <Text className='text-base text-ell-light text-center mb-6'>
                    Start your learning journey by enrolling in a course
                </Text>
                <TouchableOpacity 
                    className='bg-cardinal-500 px-8 py-4 rounded-3xl'
                    style={{
                        borderWidth: 3,
                        borderColor: '#FF1818',
                        borderBottomWidth: 6,
                        borderRightWidth: 6,
                        transform: [{ translateY: 0 }],
                    }}
                    activeOpacity={1}
                    pressRetentionOffset={{top: 10, left: 10, right: 10, bottom: 10}}
                    onPressIn={(e) => {
                        e.currentTarget.setNativeProps({
                            style: { transform: [{ translateY: 4 }], borderBottomWidth: 3, borderRightWidth: 3 }
                        })
                    }}
                    onPressOut={(e) => {
                        e.currentTarget.setNativeProps({
                            style: { transform: [{ translateY: 0 }], borderBottomWidth: 6, borderRightWidth: 6 }
                        })
                    }}
                >
                    <Text className='text-snow font-black tracking-wider'>Browse Courses</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView 
            className='flex-1 px-4 pt-6'
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            {courses.map((course, index) => {
                const cardStyle = cardStyles[index % 4];
                const borderStyle = borderStyles[index % 4];
                
                return (
                    <View key={`course-${course.id}-${index}`} className='w-full mb-4'>
                        <TouchableOpacity 
                            className={`${cardStyle} rounded-3xl p-4`}
                            style={{
                                borderWidth: 3,
                                borderColor: borderStyle,
                                borderBottomWidth: 6,
                                borderRightWidth: 6,
                                transform: [{ translateY: 0 }],
                            }}
                            activeOpacity={1}
                            pressRetentionOffset={{top: 10, left: 10, right: 10, bottom: 10}}
                            onPressIn={(e) => {
                                e.currentTarget.setNativeProps({
                                    style: { transform: [{ translateY: 4 }], borderBottomWidth: 3, borderRightWidth: 3 }
                                })
                            }}
                            onPressOut={(e) => {
                                e.currentTarget.setNativeProps({
                                    style: { transform: [{ translateY: 0 }], borderBottomWidth: 6, borderRightWidth: 6 }
                                })
                            }}
                        >
                            <View className='flex-row items-center mb-3'>
                                <View className='bg-white/10 rounded-2xl p-2.5 mr-3'>
                                    <Image 
                                        source={{ uri: course.image }} 
                                        className='w-[50px] h-[50px] scale-110'
                                        resizeMode="contain" 
                                    />
                                </View>
                                <View className='flex-1'>
                                    <Text className='text-white text-xl font-bold mb-2'>{course.name}</Text>
                                    <Text className='text-white/80 text-sm mb-2'>{course.subjectsCount} Subjects • {course.chaptersCount} Chapters</Text>
                                    {course.progress !== undefined && (
                                        <View className='h-5 bg-white/10 rounded-lg overflow-hidden relative'>
                                            <View className={`h-full bg-white/30 rounded-lg`} style={{width: `${course.progress}%`}} />
                                            <View className='absolute w-full h-full justify-center'>
                                                <Text className='text-center text-white text-xs font-bold'>{course.progress}% Complete</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity 
                                className='bg-white rounded-2xl p-3 items-center'
                                style={{
                                    borderWidth: 3,
                                    borderColor: borderStyle,
                                    borderBottomWidth: 6,
                                    borderRightWidth: 6,
                                    transform: [{ translateY: 0 }],
                                }}
                                activeOpacity={1}
                                pressRetentionOffset={{top: 10, left: 10, right: 10, bottom: 10}}
                                onPressIn={(e) => {
                                    e.currentTarget.setNativeProps({
                                        style: { transform: [{ translateY: 4 }], borderBottomWidth: 3, borderRightWidth: 3 }
                                    })
                                }}
                                onPressOut={(e) => {
                                    e.currentTarget.setNativeProps({
                                        style: { transform: [{ translateY: 0 }], borderBottomWidth: 6, borderRightWidth: 6 }
                                    })
                                }}
                                onPress={() => handleContinueLearning(course)}
                            >
                                <Text className='text-black font-extrabold text-base tracking-wider'>Continue Learning</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </ScrollView>
    );
};