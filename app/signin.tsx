import { View, Text, Button, TextInput, Alert, TouchableOpacity, useWindowDimensions, Image } from "react-native"
import { useContext, useState, } from "react"
import { AuthContext } from "./_layout"
import { useRouter } from "expo-router"
import LottieView from 'lottie-react-native';
import { Link } from "expo-router";
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    <View className="items-center mb-8">
        <Image 
            source={{uri: 'https://cdn-icons-png.flaticon.com/256/14889/14889980.png'}}
            style={{
                width: width > 768 ? 300 : 200,
                height: width > 768 ? 300 : 200,
                marginBottom: 20
            }}
            resizeMode="contain"
        />
    </View>
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
        if (otp.length === 4) {
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
                
                // if verified
                if (otpResponse.data.success == true && otpResponse.data.student.isVerified == true) {
                    AsyncStorage.setItem('token', otpResponse.data.student.token)
                    setVerificationStatus('success')
                    setStatusMessage('OTP verified successfully!')
                    setIsSignedIn(true)
                } 

                // if not verified
                if(otpResponse.data.success == true && otpResponse.data.student.isVerified == false){
                    AsyncStorage.setItem('token', otpResponse.data.student.token)
                    setShowMandatoryDetails(true)
                }
            } catch (error) {
                setVerificationStatus('failure')
                setStatusMessage('Failed to verify OTP. Please try again.')
            } finally {
                setIsVerifyingOTP(false)
            }
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
        <View className="flex-1 justify-center items-center bg-brand p-8">
            <Logo width={width} />
            
            <View className={`${width > 768 ? 'w-[60%]' : 'w-full'} max-w-[500px] bg-white/95 p-6 rounded-[20px] shadow-lg`}>
                <Text style={{ 
                    fontSize: width > 768 ? 52 : 44,
                    fontFamily: "BADABB",
                    color: '#333',
                }} className="text-center mb-6 ">WELCOME</Text>
                <View className="w-full mb-6">
                    {!showOTP ? (
                        <>
                            <MobileInput width={width} value={mobileNumber} onChange={setMobileNumber} />
                            <CustomButton 
                                onPress={handleSendOTP}
                                disabled={mobileNumber.length !== 10 || isSendingOTP}
                                bgColor={mobileNumber.length === 10 ? 'bg-[#89e219]' : 'bg-[#E5E5E5]'}
                                borderColor={mobileNumber.length === 10 ? '#58cc02' : '#999'}
                                text={`${width > 768 ? 'text-lg' : 'text-base'} ${mobileNumber.length === 10 ? 'text-white' : 'text-[#666]'} text-center font-bold`}
                            >
                                <Text className={`${width > 768 ? 'text-lg' : 'text-base'} ${mobileNumber.length === 10 ? 'text-white' : 'text-[#666]'} text-center font-bold`}>
                                    {isSendingOTP ? 'Sending OTP...' : 'Send OTP'}
                                </Text>
                            </CustomButton>
                        </>
                    ) : (
                        <>
                            <OTPInput width={width} value={otp} onChange={setOTP} />
                            <CustomButton 
                                onPress={handleVerifyOTP}
                                disabled={otp.length !== 4 || isVerifyingOTP}
                                bgColor={otp.length === 4 ? 'bg-[#58cc02]' : 'bg-[#E5E5E5]'}
                                borderColor={otp.length === 4 ? '#89e219' : '#999'}
                                text={`${width > 768 ? 'text-lg' : 'text-base'} ${otp.length === 4 ? 'text-white' : 'text-[#666]'} text-center font-bold`}
                            >
                                <Text className={`${width > 768 ? 'text-lg' : 'text-base'} ${otp.length === 4 ? 'text-white' : 'text-[#666]'} text-center font-bold`}>
                                    {isVerifyingOTP ? 'Verifying OTP...' : 'Verify OTP'}
                                </Text>
                            </CustomButton>
                        </>
                    )}
                </View>

                <CustomButton 
                    onPress={handleGoogleSignIn}
                    bgColor="bg-brand-500"
                    borderColor="#1a5fb4"
                    text={`${width > 768 ? 'text-lg' : 'text-base'} text-white text-center font-bold`}
                >
                    <View className="flex-row items-center justify-center">
                        <Image 
                            source={{uri: 'https://cdn-icons-png.flaticon.com/128/356/356049.png'}}
                            style={{
                                width: 24,
                                height: 24,
                                marginRight: 8
                            }}
                            resizeMode="contain"
                        />
                        <Text className={`${width > 768 ? 'text-lg' : 'text-base'} text-white text-center font-bold`}>
                            Continue with Google
                        </Text>
                    </View>
                </CustomButton>
            </View>

            {showMandatoryDetails && (
                <View className="absolute inset-0 justify-center items-center bg-black/50">
                    <View className="bg-white p-6 rounded-[20px] w-[90%] max-w-[500px]">
                        <Text className="text-2xl font-bold text-center mb-4">Mandatory Details Required</Text>
                        <TextInput
                            className={`${width > 768 ? 'text-lg' : 'text-base'} bg-[#F0F0F0] rounded-2xl mb-4 p-4 text-[#333]`}
                            placeholder="Enter your name"
                            placeholderTextColor="#666"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            className={`${width > 768 ? 'text-lg' : 'text-base'} bg-[#F0F0F0] rounded-2xl mb-4 p-4 text-[#333]`}
                            placeholder="Enter your email"
                            placeholderTextColor="#666"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <CustomButton 
                            onPress={handleSaveDetails}
                            disabled={!isFormValid || isSaving}
                            bgColor={isFormValid ? 'bg-[#89e219]' : 'bg-[#E5E5E5]'}
                            borderColor={isFormValid ? '#58cc02' : '#999'}
                            text={`${width > 768 ? 'text-lg' : 'text-base'} ${isFormValid ? 'text-white' : 'text-[#666]'} text-center font-bold`}
                        >
                            <Text className={`${width > 768 ? 'text-lg' : 'text-base'} ${isFormValid ? 'text-white' : 'text-[#666]'} text-center font-bold`}>
                                {isSaving ? 'Saving...' : 'Save Details'}
                            </Text>
                        </CustomButton>
                    </View>
                </View>
            )}
        </View>
    )
}