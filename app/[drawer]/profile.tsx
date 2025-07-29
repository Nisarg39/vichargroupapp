import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { useContext, useState } from 'react'
import { StudentContext } from '../context/StudentContext'
import { FontAwesome5 } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker'

import { StudentData } from '../../src/types/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage'

interface ProfileHeaderProps {
    name?: string;
    email?: string;
    referralCode?: string;
    gender?: string;
}

const ProfileHeader = ({ name, email, referralCode, gender }: ProfileHeaderProps) => (
    <View className="mb-6 mt-12 -mx-6">
        {/* Background Container with proper padding system */}
        <View 
            style={{
                backgroundColor: '#1d77bc',
            }}
        >
            {/* Content with 8-point grid system */}
            <View className="pt-8 pb-6 px-6">
                {/* Profile Picture - 24px bottom margin */}
                <View className="items-center mb-6">
                    <View 
                        className="relative"
                        style={{
                            shadowColor: '#4a4a4a',
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.15,
                            shadowRadius: 12,
                            elevation: 8,
                        }}
                    >
                        <View 
                            className="w-28 h-28 rounded-full bg-white p-1"
                            style={{
                                borderWidth: 3,
                                borderColor: 'rgba(255, 255, 255, 0.8)',
                            }}
                        >
                            <View className="w-full h-full rounded-full overflow-hidden bg-brand-50">
                                <Image
                                    source={{ 
                                        uri: gender === 'female' 
                                            ? "https://cdn-icons-gif.flaticon.com/13372/13372960.gif" 
                                            : gender === 'male'
                                            ? "https://cdn-icons-gif.flaticon.com/12146/12146129.gif"
                                            : 'https://cdn-icons-png.flaticon.com/256/7139/7139111.png'
                                    }}
                                    className="w-full h-full"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        
                        {/* Decorative Ring with proper offset */}
                        <View 
                            className="absolute -inset-1.5 rounded-full border border-white/30 opacity-60"
                            style={{
                                borderStyle: 'dashed',
                            }}
                        />
                    </View>
                </View>

                {/* Name Section - 16px bottom margin */}
                <View className="items-center mb-4">
                    {name ? (
                        <View className="items-center">
                            <Text 
                                className="text-3xl font-bold text-white font-comic text-center"
                                style={{
                                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                                    textShadowOffset: { width: 1, height: 1 },
                                    textShadowRadius: 3,
                                    letterSpacing: 0.5,
                                }}
                            >
                                {name}
                            </Text>
                            {/* Decorative underline with 8px top margin */}
                            <View 
                                className="h-0.5 bg-white/70 rounded-full mt-2"
                                style={{ width: Math.min(name.length * 6 + 32, 100) }}
                            />
                        </View>
                    ) : (
                        <Text className="text-xl text-white/80 italic font-comic">Welcome!</Text>
                    )}
                </View>

                {/* Info Section with 12px gaps */}
                <View className="items-center">
                    {email && (
                        <View className="flex-row items-center bg-white/20 px-4 py-2.5 rounded-full mb-3">
                            <FontAwesome5 name="envelope" size={14} color="white" style={{marginRight: 8}} />
                            <Text className="text-white font-comic text-sm" numberOfLines={1}>
                                {email}
                            </Text>
                        </View>
                    )}

                    {referralCode && (
                        <View className="bg-white/20 px-5 py-2.5 rounded-full">
                            <View className="flex-row items-center">
                                <FontAwesome5 name="gift" size={14} color="white" style={{marginRight: 8}} />
                                <View>
                                    <Text className="text-xs font-comic text-white/80 text-center leading-3">REFERRAL</Text>
                                    <Text 
                                        className="text-base font-bold text-white font-comic text-center mt-0.5"
                                        style={{
                                            letterSpacing: 1.5,
                                            textShadowColor: 'rgba(0, 0, 0, 0.3)',
                                            textShadowOffset: { width: 0.5, height: 0.5 },
                                            textShadowRadius: 1,
                                        }}
                                    >
                                        {referralCode}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </View>
    </View>
)

interface EditableFieldProps {
    label: string;
    value?: string;
    originalValue?: string;
    isEditing: boolean;
    onEdit: () => void;
    onChange: (text: string) => void;
    onDone: () => void;
    onCancel: () => void;
    error?: string;
    type?: 'text' | 'email' | 'phone' | 'date' | 'select' | 'textarea';
    options?: Array<{value: string, label: string}>;
    icon: string;
    placeholder?: string;
    hasUnsavedChanges?: boolean;
    onDatePress?: () => void;
}

const EditableField = ({ 
    label, 
    value, 
    isEditing, 
    onEdit, 
    onChange, 
    onDone,
    onCancel, 
    error, 
    type = 'text', 
    options = [], 
    icon, 
    placeholder,
    hasUnsavedChanges = false,
    onDatePress
}: EditableFieldProps) => {
    if (isEditing) {
        return (
            <View className="mb-4">
                <Text className="text-black text-lg font-comic mb-2">{label}</Text>
                {type === 'select' ? (
                    <View className="bg-snow rounded-2xl" style={{
                        borderWidth: 3,
                        borderColor: '#4a4a4a',
                        borderBottomWidth: 6,
                        borderRightWidth: 6,
                    }}>
                        <Picker
                            selectedValue={value}
                            onValueChange={(itemValue) => onChange(itemValue)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label={`Select ${label.toLowerCase()}`} value="" />
                            {options.map(opt => (
                                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                            ))}
                        </Picker>
                    </View>
                ) : type === 'date' ? (
                    <TouchableOpacity 
                        onPress={onDatePress}
                        className="bg-snow rounded-2xl p-4 flex-row justify-between items-center"
                        style={{
                            borderWidth: 3,
                            borderColor: '#4a4a4a',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                        }}
                    >
                        <Text className="text-black font-medium">
                            {value ? new Date(value).toLocaleDateString() : 'Select date'}
                        </Text>
                        <FontAwesome5 name="calendar" size={20} color="#4a4a4a" />
                    </TouchableOpacity>
                ) : (
                    <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                        className="bg-snow rounded-2xl p-4"
                        style={{
                            borderWidth: 3,
                            borderColor: '#4a4a4a',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                        }}
                        keyboardType={type === 'email' ? 'email-address' : type === 'phone' ? 'phone-pad' : 'default'}
                        multiline={type === 'textarea'}
                        numberOfLines={type === 'textarea' ? 3 : 1}
                        autoFocus={true}
                    />
                )}
                {error && <Text className="text-red-500 text-sm mt-1 font-comic">{error}</Text>}
                <View className="flex-row gap-2 mt-3">
                    <TouchableOpacity 
                        onPress={onCancel}
                        className="flex-1 bg-gray-400 rounded-2xl p-3"
                        style={{
                            borderWidth: 3,
                            borderColor: '#4a4a4a',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                        }}
                        activeOpacity={1}
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
                        <Text className="text-white text-center font-comic font-bold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={onDone}
                        className="flex-1 bg-brand-600 rounded-2xl p-3"
                        style={{
                            borderWidth: 3,
                            borderColor: '#4a4a4a',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                        }}
                        activeOpacity={1}
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
                        <Text className="text-white text-center font-comic font-bold">Done</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-xs text-gray-600 mt-2 text-center font-comic">
                    Changes will be saved when you tap "Update Profile" below
                </Text>
            </View>
        )
    }

    return (
        <TouchableOpacity 
            className={`flex-row justify-between items-center p-4 rounded-2xl my-2 ${
                hasUnsavedChanges ? 'bg-orange-100' : 'bg-snow'
            }`}
            style={{
                borderWidth: 3,
                borderColor: hasUnsavedChanges ? '#f59e0b' : '#4a4a4a',
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
            onPress={onEdit}
        >
            <View className='flex-row items-center'>
                <FontAwesome5 name={icon} size={24} color="#4a4a4a" style={{marginRight: 12}} />
                <View className="flex-1">
                    <Text className='text-black text-lg font-comic'>
                        {type === 'date' && value ? new Date(value).toLocaleDateString() 
                         : value || `Enter ${label.toLowerCase()}`}
                    </Text>
                    {hasUnsavedChanges && (
                        <Text className="text-xs text-orange-600 font-comic font-bold">Modified</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default function Profile() {
    const { studentData, setStudentData } = useContext<{
        studentData: StudentData | null, 
        setStudentData: React.Dispatch<React.SetStateAction<StudentData | null>>
    }>(StudentContext)
    
    const [name, setName] = useState(studentData?.name || '')
    const [email, setEmail] = useState(studentData?.email || '')
    const [phone, setPhone] = useState(studentData?.phone || '')
    const [gender, setGender] = useState(studentData?.gender || '')
    const [dob, setDob] = useState(studentData?.dob || '')
    const [referralCode] = useState(studentData?.referralCode || '')
    const [address, setAddress] = useState(studentData?.address || '')
    const [city, setCity] = useState(studentData?.city || '')
    const [area, setArea] = useState(studentData?.area || '')
    const [state, setState] = useState(studentData?.state || '')
    
    const [isEditing, setIsEditing] = useState<{[key: string]: boolean}>({})
    const [errors, setErrors] = useState<{[key: string]: string}>({})
    const [isUpdating, setIsUpdating] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)

    // Original values for comparison
    const originalValues = {
        name: studentData?.name || '',
        email: studentData?.email || '',
        phone: studentData?.phone || '',
        gender: studentData?.gender || '',
        dob: studentData?.dob || '',
        address: studentData?.address || '',
        city: studentData?.city || '',
        area: studentData?.area || '',
        state: studentData?.state || ''
    }

    // Check if there are unsaved changes
    const hasUnsavedChanges = () => {
        return name !== originalValues.name ||
               email !== originalValues.email ||
               phone !== originalValues.phone ||
               gender !== originalValues.gender ||
               dob !== originalValues.dob ||
               address !== originalValues.address ||
               city !== originalValues.city ||
               area !== originalValues.area ||
               state !== originalValues.state
    }

    const getFieldHasUnsavedChanges = (field: string, currentValue: string) => {
        return currentValue !== originalValues[field as keyof typeof originalValues]
    }

    const validateField = (fieldName: string, value: string): string => {
        switch (fieldName) {
            case 'name':
                return !value.trim() ? "Name is required" : ""
            case 'email':
                if (!value.trim()) return "Email is required"
                if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid"
                return ""
            case 'phone':
                if (!value.trim()) return "Phone is required"
                if (!/^\d{10}$/.test(value)) return "Phone must be 10 digits"
                return ""
            case 'gender':
                return !value ? "Gender is required" : ""
            case 'dob':
                if (!value) return "Date of birth is required"
                const dobDate = new Date(value)
                const today = new Date()
                if (dobDate > today) return "Date of birth cannot be in the future"
                return ""
            case 'address':
                return !value.trim() ? "Address is required" : ""
            case 'city':
                return !value.trim() ? "City is required" : ""
            case 'area':
                return !value.trim() ? "Area is required" : ""
            case 'state':
                return !value.trim() ? "State is required" : ""
            default:
                return ""
        }
    }

    const handleEdit = (field: string) => {
        setIsEditing(prev => ({...prev, [field]: true}))
        setErrors(prev => ({...prev, [field]: ''}))
    }

    const handleDone = (field: string) => {
        setIsEditing(prev => ({...prev, [field]: false}))
        setErrors(prev => ({...prev, [field]: ''}))
    }

    const handleCancel = (field: string) => {
        setIsEditing(prev => ({...prev, [field]: false}))
        setErrors(prev => ({...prev, [field]: ''}))
        
        // Reset to original values
        switch (field) {
            case 'name': setName(originalValues.name); break;
            case 'email': setEmail(originalValues.email); break;
            case 'phone': setPhone(originalValues.phone); break;
            case 'gender': setGender(originalValues.gender); break;
            case 'dob': setDob(originalValues.dob); break;
            case 'address': setAddress(originalValues.address); break;
            case 'city': setCity(originalValues.city); break;
            case 'area': setArea(originalValues.area); break;
            case 'state': setState(originalValues.state); break;
        }
    }

    const handleDatePress = () => {
        setShowDatePicker(true)
    }

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false)
        if (selectedDate) {
            setDob(selectedDate.toISOString().split('T')[0])
        }
    }

    const handleUpdateDetails = async () => {
        const fields = { name, email, phone, gender, dob, address, city, area, state }
        const newErrors: {[key: string]: string} = {}
        
        Object.entries(fields).forEach(([field, value]) => {
            const error = validateField(field, value)
            if (error) newErrors[field] = error
        })
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            Alert.alert('Validation Error', 'Please correct the errors and try again')
            return
        }
        
        setIsUpdating(true)
        try {
            const token = await AsyncStorage.getItem('token')
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/app/signin/updateStudentDetails`, {
                name, email, phone, gender, dob, address, city, area, state, token
            },{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                }
            })
            const updatedStudentData: StudentData = {
                ...studentData!,
                name, email, phone, gender, dob, address, city, area, state
            }
            setStudentData(updatedStudentData)
            Alert.alert(response.data.message)
        } catch (error: any) {
            Alert.alert(error.response.data.message)
        } finally {
            setIsUpdating(false)
        }
    }
    
    if (!studentData) {
        return (
            <View className="flex-1 bg-brand-50 justify-center items-center">
                <Text className="text-lg text-brand-500 italic font-comic">No student data available</Text>
            </View>
        )
    }
    
    return (
        <KeyboardAvoidingView 
            className="flex-1" 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView 
                className="flex-1 bg-brand-50"
                contentContainerStyle={{ paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="p-6">
                <ProfileHeader 
                    name={name} 
                    email={email} 
                    referralCode={referralCode} 
                    gender={gender} 
                />
                
                {studentData && (
                    <>
                        <EditableField
                            label="Full Name"
                            value={name}
                            originalValue={originalValues.name}
                            isEditing={isEditing.name || false}
                            onEdit={() => handleEdit('name')}
                            onChange={setName}
                            onDone={() => handleDone('name')}
                            onCancel={() => handleCancel('name')}
                            error={errors.name}
                            icon="user"
                            hasUnsavedChanges={getFieldHasUnsavedChanges('name', name)}
                        />
                        
                        <EditableField
                            label="Email Address"
                            value={email}
                            originalValue={originalValues.email}
                            isEditing={isEditing.email || false}
                            onEdit={() => handleEdit('email')}
                            onChange={setEmail}
                            onDone={() => handleDone('email')}
                            onCancel={() => handleCancel('email')}
                            error={errors.email}
                            type="email"
                            icon="envelope"
                            hasUnsavedChanges={getFieldHasUnsavedChanges('email', email)}
                        />
                        
                        <EditableField
                            label="Phone Number"
                            value={phone}
                            originalValue={originalValues.phone}
                            isEditing={isEditing.phone || false}
                            onEdit={() => handleEdit('phone')}
                            onChange={setPhone}
                            onDone={() => handleDone('phone')}
                            onCancel={() => handleCancel('phone')}
                            error={errors.phone}
                            type="phone"
                            icon="phone"
                            hasUnsavedChanges={getFieldHasUnsavedChanges('phone', phone)}
                        />
                        
                        <EditableField
                            label="Gender"
                            value={gender}
                            originalValue={originalValues.gender}
                            isEditing={isEditing.gender || false}
                            onEdit={() => handleEdit('gender')}
                            onChange={setGender}
                            onDone={() => handleDone('gender')}
                            onCancel={() => handleCancel('gender')}
                            error={errors.gender}
                            type="select"
                            options={[
                                {value: "male", label: "Male"},
                                {value: "female", label: "Female"},
                                {value: "other", label: "Other"}
                            ]}
                            icon="venus-mars"
                            hasUnsavedChanges={getFieldHasUnsavedChanges('gender', gender)}
                        />
                        
                        <EditableField
                            label="Date of Birth"
                            value={dob}
                            originalValue={originalValues.dob}
                            isEditing={isEditing.dob || false}
                            onEdit={() => handleEdit('dob')}
                            onChange={setDob}
                            onDone={() => handleDone('dob')}
                            onCancel={() => handleCancel('dob')}
                            error={errors.dob}
                            type="date"
                            icon="calendar"
                            hasUnsavedChanges={getFieldHasUnsavedChanges('dob', dob)}
                            onDatePress={handleDatePress}
                        />
                        
                        <EditableField
                            label="Address"
                            value={address}
                            originalValue={originalValues.address}
                            isEditing={isEditing.address || false}
                            onEdit={() => handleEdit('address')}
                            onChange={setAddress}
                            onDone={() => handleDone('address')}
                            onCancel={() => handleCancel('address')}
                            error={errors.address}
                            type="textarea"
                            icon="map-marker-alt"
                            hasUnsavedChanges={getFieldHasUnsavedChanges('address', address)}
                        />
                        
                        <EditableField
                            label="City"
                            value={city}
                            originalValue={originalValues.city}
                            isEditing={isEditing.city || false}
                            onEdit={() => handleEdit('city')}
                            onChange={setCity}
                            onDone={() => handleDone('city')}
                            onCancel={() => handleCancel('city')}
                            error={errors.city}
                            icon="city"
                            hasUnsavedChanges={getFieldHasUnsavedChanges('city', city)}
                        />
                        
                        <EditableField
                            label="Area"
                            value={area}
                            originalValue={originalValues.area}
                            isEditing={isEditing.area || false}
                            onEdit={() => handleEdit('area')}
                            onChange={setArea}
                            onDone={() => handleDone('area')}
                            onCancel={() => handleCancel('area')}
                            error={errors.area}
                            icon="location-arrow"
                            hasUnsavedChanges={getFieldHasUnsavedChanges('area', area)}
                        />
                        
                        <EditableField
                            label="State"
                            value={state}
                            originalValue={originalValues.state}
                            isEditing={isEditing.state || false}
                            onEdit={() => handleEdit('state')}
                            onChange={setState}
                            onDone={() => handleDone('state')}
                            onCancel={() => handleCancel('state')}
                            error={errors.state}
                            icon="globe-americas"
                            hasUnsavedChanges={getFieldHasUnsavedChanges('state', state)}
                        />
                    </>
                )}
                        
                {hasUnsavedChanges() && (
                    <View className="mt-6 p-4 bg-yellow-100 rounded-2xl" style={{
                        borderWidth: 3,
                        borderColor: '#f59e0b',
                        borderBottomWidth: 6,
                        borderRightWidth: 6,
                    }}>
                        <View className="flex-row items-center mb-2">
                            <FontAwesome5 name="exclamation-triangle" size={20} color="#f59e0b" style={{marginRight: 10}} />
                            <Text className="text-orange-700 font-comic font-bold text-lg">Unsaved Changes!</Text>
                        </View>
                        <Text className="text-orange-600 font-comic">
                            Don't forget to save your changes by tapping "Update Profile" below.
                        </Text>
                    </View>
                )}

                <View className="mt-6">
                    <TouchableOpacity 
                        className={`rounded-2xl p-4 ${isUpdating ? 'bg-gray-400' : hasUnsavedChanges() ? 'bg-green-500' : 'bg-brand-600'}`}
                        style={{
                            borderWidth: 3,
                            borderColor: '#4a4a4a',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                            opacity: isUpdating ? 0.7 : 1
                        }}
                        onPress={handleUpdateDetails}
                        disabled={isUpdating || !hasUnsavedChanges()}
                        activeOpacity={1}
                        onPressIn={(e) => {
                            if (!isUpdating && hasUnsavedChanges()) {
                                e.currentTarget.setNativeProps({
                                    style: { transform: [{ translateY: 4 }], borderBottomWidth: 3, borderRightWidth: 3 }
                                })
                            }
                        }}
                        onPressOut={(e) => {
                            if (!isUpdating && hasUnsavedChanges()) {
                                e.currentTarget.setNativeProps({
                                    style: { transform: [{ translateY: 0 }], borderBottomWidth: 6, borderRightWidth: 6 }
                                })
                            }
                        }}
                    >
                        <View className="flex-row items-center justify-center">
                            {isUpdating ? (
                                <>
                                    <ActivityIndicator size="small" color="white" style={{marginRight: 8}} />
                                    <Text className="text-white text-lg font-comic font-bold">Updating...</Text>
                                </>
                            ) : (
                                <>
                                    <Text className="text-white text-lg font-comic font-bold mr-2">
                                        {hasUnsavedChanges() ? 'Save Changes' : 'No Changes to Save'}
                                    </Text>
                                    {hasUnsavedChanges() && <FontAwesome5 name="save" size={20} color="white" />}
                                </>
                            )}
                        </View>
                    </TouchableOpacity>

                    {hasUnsavedChanges() && (
                        <TouchableOpacity 
                            className="mt-3 rounded-2xl p-3 bg-gray-300"
                            style={{
                                borderWidth: 3,
                                borderColor: '#4a4a4a',
                                borderBottomWidth: 6,
                                borderRightWidth: 6,
                            }}
                            activeOpacity={1}
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
                            onPress={() => {
                                Alert.alert(
                                    'Discard Changes',
                                    'Are you sure you want to discard all unsaved changes?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        { 
                                            text: 'Discard', 
                                            style: 'destructive',
                                            onPress: () => {
                                                setName(originalValues.name)
                                                setEmail(originalValues.email)
                                                setPhone(originalValues.phone)
                                                setGender(originalValues.gender)
                                                setDob(originalValues.dob)
                                                setAddress(originalValues.address)
                                                setCity(originalValues.city)
                                                setArea(originalValues.area)
                                                setState(originalValues.state)
                                                setErrors({})
                                                setIsEditing({})
                                            }
                                        }
                                    ]
                                )
                            }}
                        >
                            <View className="flex-row items-center justify-center">
                                <FontAwesome5 name="undo" size={16} color="#4a4a4a" style={{marginRight: 10}} />
                                <Text className="text-gray-700 font-comic font-bold">Discard Changes</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                </View>
            
                {showDatePicker && (
                <DateTimePicker
                    value={dob ? new Date(dob) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}