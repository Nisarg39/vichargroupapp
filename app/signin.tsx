import { View, Text, Button, TextInput, Alert, TouchableOpacity, useWindowDimensions, Image } from "react-native"
import { useContext, useState, } from "react"
import { AuthContext } from "./_layout"
import { useRouter } from "expo-router"
import LottieView from 'lottie-react-native';
import { Link } from "expo-router";
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';

const CustomButton = ({ onPress, disabled = false, text, bgColor, borderColor, children }: {
    onPress: () => void
    disabled?: boolean
    text: string
    bgColor: string
    borderColor: string
    children?: React.ReactNode
}) => (
    <TouchableOpacity 
        className={`${bgColor} rounded-2xl p-4`}
        onPress={onPress}
        disabled={disabled}
        style={{
            borderWidth: 3,
            borderColor: borderColor,
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
        {children || <Text className={text}>{text}</Text>}
    </TouchableOpacity>
)

const OTPInput = ({ width, value, onChange }: { 
    width: number, 
    value: string, 
    onChange: (text: string) => void 
}) => (
    <TextInput
        className={`${width > 768 ? 'text-lg' : 'text-base'} bg-[#F0F0F0] rounded-2xl mb-4 p-4 text-[#333]`}
        placeholder="Enter 4-digit OTP"
        placeholderTextColor="#666"
        keyboardType="numeric"
        maxLength={4}
        value={value}
        onChangeText={onChange}
    />
)

const MobileInput = ({ width, value, onChange }: {
    width: number,
    value: string,
    onChange: (text: string) => void
}) => (
    <TextInput
        className={`${width > 768 ? 'text-lg' : 'text-base'} bg-[#F0F0F0] rounded-2xl mb-4 p-4 text-[#333]`}
        placeholder="Enter 10-digit mobile number"
        placeholderTextColor="#666"
        keyboardType="numeric"
        maxLength={10}
        value={value}
        onChangeText={onChange}
    />
)

const Logo = ({ width }: { width: number }) => (
    <View className="items-center mb-4 sm:mb-6 md:mb-8">
        <View
            style={{
                shadowColor: "#1a5fb4",
                shadowOffset: { width: 0, height: 15 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 20,
            }}
        >
            <Image 
                source={require('../assets/images/vicharLogo.png')}
                style={{
                    width: width > 768 ? 400 : width > 480 ? 300 : 240,
                    height: width > 768 ? 400 : width > 480 ? 300 : 240,
                    marginBottom: width > 480 ? 20 : 10,
                    backgroundColor: 'transparent',
                    transform: [
                        { perspective: 1000 },
                        { rotateX: '5deg' },
                        { rotateY: '5deg' },
                        { scale: 1.05 }
                    ]
                }}
                resizeMode="contain"
            />
        </View>
    </View>
)

const VGHeader = ({ width }: { width: number }) => (
    <Text style={{ 
        fontSize: width > 768 ? 64 : 52,
        fontFamily: "BADABB",
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        marginBottom: 24
    }} className="text-center">
        VICHAR GROUP
    </Text>
)

export default function SignInScreen() {
    const router = useRouter()
    const { width, height } = useWindowDimensions()
    const { setIsSignedIn } = useContext(AuthContext)
    const [mobileNumber, setMobileNumber] = useState('')
    const [showOTP, setShowOTP] = useState(false)
    const [otp, setOTP] = useState('')
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'failure'>('idle')
    const [statusMessage, setStatusMessage] = useState('')
    const [isSendingOTP, setIsSendingOTP] = useState(false)
    const [isVerifyingOTP, setIsVerifyingOTP] = useState(false)
    const [showMandatoryDetails, setShowMandatoryDetails] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [otpError, setOtpError] = useState('');

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const isFormValid = name.trim() !== '' && isValidEmail(email);

    const handleSignIn = () => {
        setIsSignedIn(true);
    }

    const handleSendOTP = async() => {
        if (mobileNumber.length === 10) {
            setIsSendingOTP(true)
            try {
                const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/app/signin/sendOtp`, {
                    phone: mobileNumber
                },{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                    }
                })
                if(response.data.success == true){
                    setShowOTP(true)
                    setVerificationStatus('idle')
                    setStatusMessage('OTP sent successfully!')
                }else{
                    setVerificationStatus('failure')
                    setStatusMessage('Failed to send OTP. Please try again.')
                }
            } catch (error) {
                setVerificationStatus('failure')
                setStatusMessage('Failed to send OTP. Please try again.')
            } finally {
                setIsSendingOTP(false)
            }
        }
    }

    const handleVerifyOTP = async() => {
        // Reset previous error
        setOtpError('');

        // Validate OTP length
        if (otp.length !== 4) {
            setOtpError('Please enter a 4-digit OTP');
            return;
        }

        setIsVerifyingOTP(true)
        try {
            const otpResponse = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/app/signin/verifyOtp`, {
                mobile: mobileNumber,
                otp: otp
            },{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                }
            })

            // Comprehensive verification scenarios
            if (otpResponse.data.success === true) {
                if (otpResponse.data.student.isVerified === true) {
                    await AsyncStorage.setItem('token', otpResponse.data.student.token)
                    setVerificationStatus('success')
                    setStatusMessage('OTP verified successfully!')
                    setIsSignedIn(true)
                } else {
                    await AsyncStorage.setItem('token', otpResponse.data.student.token)
                    setShowMandatoryDetails(true)
                }
            } else {
                // Explicitly handle incorrect OTP
                setOtpError(otpResponse.data.message || 'Invalid OTP. Please try again.');
                setVerificationStatus('failure')
            }
        } catch (error) {
            console.error('OTP Verification Error:', error); // Detailed error logging
            
            // More specific error handling
            if (axios.isAxiosError(error)) {
                setOtpError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
            } else {
                setOtpError('An unexpected error occurred. Please try again.');
            }
            
            setVerificationStatus('failure')
        } finally {
            setIsVerifyingOTP(false)
        }
    }

    const handleSaveDetails = async () => {
        if (isFormValid) {
            setIsSaving(true)
            try {
                const token = await AsyncStorage.getItem('token')
                const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/app/signin/mandatoryDetails`, {
                    token: token,
                    name: name,
                    email: email
                },{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                    }
                })

                // console.log(response.data)
                
                if(response.data.success) {
                    setIsSignedIn(true)
                }
            } catch (error) {
                setStatusMessage('Failed to save details. Please try again.')
            } finally {
                setIsSaving(false)
            }
        }
    }

    const handleGoogleSignIn = () => {
        console.log('Signing in with Google')
    }

    return (
        <LinearGradient
            colors={['#1a5fb4', '#ffffff', '#ffffff', '#1a5fb4']}
            locations={[0, 0.3, 0.7, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 justify-center items-center p-4 sm:p-6 md:p-8"
        >
            <View className="w-full max-w-[500px] flex items-center justify-center">
                {/* Enhanced 3D Logo */}
                <View 
                    style={{
                        shadowColor: "#1a5fb4",
                        shadowOffset: { width: 0, height: 20 },
                        shadowOpacity: 0.4,
                        shadowRadius: 25,
                        elevation: 20,
                    }}
                >
                    <Logo width={width} />
                </View>
                
                <View 
                    className="w-full px-2 sm:px-4 -mt-2 sm:-mt-4"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.1,
                        shadowRadius: 15,
                        elevation: 10,
                    }}
                >
                    <View className="w-full mb-4 sm:mb-6">
                        {!showOTP ? (
                            <>
                                {/* 3D Input Effect */}
                                <View
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 8,
                                        elevation: 5,
                                    }}
                                >
                                    <MobileInput width={width} value={mobileNumber} onChange={setMobileNumber} />
                                </View>
                                
                                {/* Button already has 3D effect with CustomButton */}
                                <CustomButton 
                                    onPress={handleSendOTP}
                                    disabled={mobileNumber.length !== 10 || isSendingOTP}
                                    bgColor={mobileNumber.length === 10 ? 'bg-[#89e219]' : 'bg-[#E5E5E5]'}
                                    borderColor={mobileNumber.length === 10 ? '#58cc02' : '#999'}
                                    text={`${width > 768 ? 'text-lg' : 'text-base'} ${mobileNumber.length === 10 ? 'text-white' : 'text-[#666]'} text-center font-bold`}
                                >
                                    <Text 
                                        className={`${width > 768 ? 'text-lg' : 'text-base'} ${mobileNumber.length === 10 ? 'text-white' : 'text-[#666]'} text-center font-bold`}
                                        style={{
                                            textShadowColor: mobileNumber.length === 10 ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                                            textShadowOffset: { width: 0, height: 1 },
                                            textShadowRadius: 2,
                                        }}
                                    >
                                        {isSendingOTP ? 'Sending OTP...' : 'Send OTP'}
                                    </Text>
                                </CustomButton>
                            </>
                        ) : (
                            <>
                                {/* 3D Input Effect */}
                                <View
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 8,
                                        elevation: 5,
                                    }}
                                >
                                    <OTPInput 
                                        width={width} 
                                        value={otp} 
                                        onChange={(text) => {
                                            setOTP(text);
                                            if (otpError) setOtpError('');
                                        }} 
                                    />
                                </View>
                                
                                {otpError && (
                                    <View 
                                        className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-4" 
                                        role="alert"
                                        style={{
                                            shadowColor: "#ff0000",
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Text className="text-red-500 text-center text-sm sm:text-base font-bold">
                                            {otpError}
                                        </Text>
                                    </View>
                                )}
                                
                                <CustomButton 
                                    onPress={handleVerifyOTP}
                                    disabled={otp.length !== 4 || isVerifyingOTP}
                                    bgColor={otp.length === 4 ? 'bg-[#58cc02]' : 'bg-[#E5E5E5]'}
                                    borderColor={otp.length === 4 ? '#89e219' : '#999'}
                                    text={`${width > 768 ? 'text-lg' : 'text-base'} ${otp.length === 4 ? 'text-white' : 'text-[#666]'} text-center font-bold`}
                                >
                                    <Text 
                                        className={`${width > 768 ? 'text-lg' : 'text-base'} ${otp.length === 4 ? 'text-white' : 'text-[#666]'} text-center font-bold`}
                                        style={{
                                            textShadowColor: otp.length === 4 ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                                            textShadowOffset: { width: 0, height: 1 },
                                            textShadowRadius: 2,
                                        }}
                                    >
                                        {isVerifyingOTP ? 'Verifying OTP...' : 'Verify OTP'}
                                    </Text>
                                </CustomButton>
                            </>
                        )}
                    </View>

                    <CustomButton 
                        onPress={handleGoogleSignIn}
                        disabled={true}
                        bgColor="bg-gray-300"
                        borderColor="#999"
                        text={`${width > 768 ? 'text-lg' : 'text-base'} text-gray-500 text-center font-bold`}
                    >
                        <View className="flex-row items-center justify-center">
                            <Image 
                                source={{uri: 'https://cdn-icons-png.flaticon.com/128/356/356049.png'}}
                                style={{
                                    width: width > 768 ? 24 : 20,
                                    height: width > 768 ? 24 : 20,
                                    marginRight: width > 768 ? 8 : 6,
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 1,
                                    opacity: 0.5
                                }}
                                resizeMode="contain"
                            />
                            <Text 
                                className={`${width > 768 ? 'text-lg' : 'text-base'} text-gray-500 text-center font-bold`}
                                style={{
                                    textShadowColor: 'rgba(0, 0, 0, 0.25)',
                                    textShadowOffset: { width: 0, height: 1 },
                                    textShadowRadius: 2,
                                }}
                            >
                                Continue with Google
                            </Text>
                        </View>
                    </CustomButton>
                </View>
            </View>

            {showMandatoryDetails && (
                <View className="absolute inset-0 justify-center items-center bg-black/50">
                    <View 
                        className="bg-white p-4 sm:p-6 rounded-[20px] w-[95%] sm:w-[90%] max-w-[500px]"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 20 },
                            shadowOpacity: 0.3,
                            shadowRadius: 20,
                            elevation: 30,
                            transform: [
                                { perspective: 1000 },
                                { rotateX: '2deg' },
                            ]
                        }}
                    >
                        <Text 
                            className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4"
                            style={{
                                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                                textShadowOffset: { width: 1, height: 1 },
                                textShadowRadius: 2,
                            }}
                        >
                            Mandatory Details Required
                        </Text>
                        
                        <View
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 5,
                            }}
                        >
                            <TextInput
                                className={`${width > 768 ? 'text-lg' : 'text-base'} bg-[#F0F0F0] rounded-2xl mb-3 sm:mb-4 p-3 sm:p-4 text-[#333]`}
                                placeholder="Enter your name"
                                placeholderTextColor="#666"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        
                        <View
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 5,
                            }}
                        >
                            <TextInput
                                className={`${width > 768 ? 'text-lg' : 'text-base'} bg-[#F0F0F0] rounded-2xl mb-3 sm:mb-4 p-3 sm:p-4 text-[#333]`}
                                placeholder="Enter your email"
                                placeholderTextColor="#666"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        
                        <CustomButton 
                            onPress={handleSaveDetails}
                            disabled={!isFormValid || isSaving}
                            bgColor={isFormValid ? 'bg-[#89e219]' : 'bg-[#E5E5E5]'}
                            borderColor={isFormValid ? '#58cc02' : '#999'}
                            text={`${width > 768 ? 'text-lg' : 'text-base'} ${isFormValid ? 'text-white' : 'text-[#666]'} text-center font-bold`}
                        >
                            <Text 
                                className={`${width > 768 ? 'text-lg' : 'text-base'} ${isFormValid ? 'text-white' : 'text-[#666]'} text-center font-bold`}
                                style={{
                                    textShadowColor: isFormValid ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                                    textShadowOffset: { width: 0, height: 1 },
                                    textShadowRadius: 2,
                                }}
                            >
                                {isSaving ? 'Saving...' : 'Save Details'}
                            </Text>
                        </CustomButton>
                    </View>
                </View>
            )}
        </LinearGradient>
    )
}