import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ModalType = 'success' | 'error' | 'info' | 'warning';

export interface ApiModalProps {
    visible: boolean;
    onClose: () => void;
    type: ModalType;
    title: string;
    message: string;
    buttonText?: string;
}

const modalConfig = {
    success: {
        icon: 'check-circle' as keyof typeof MaterialCommunityIcons.glyphMap,
        iconColor: '#10B981',
        borderColor: '#10B981',
        backgroundClass: 'bg-green-100',
        titleEmoji: '✨'
    },
    error: {
        icon: 'alert-circle' as keyof typeof MaterialCommunityIcons.glyphMap,
        iconColor: '#EF4444',
        borderColor: '#EF4444',
        backgroundClass: 'bg-red-100',
        titleEmoji: '😞'  
    },
    warning: {
        icon: 'alert' as keyof typeof MaterialCommunityIcons.glyphMap,
        iconColor: '#F59E0B',
        borderColor: '#F59E0B',
        backgroundClass: 'bg-yellow-100',
        titleEmoji: '⚠️'
    },
    info: {
        icon: 'information' as keyof typeof MaterialCommunityIcons.glyphMap,
        iconColor: '#1CB0F6',
        borderColor: '#1CB0F6',
        backgroundClass: 'bg-blue-100',
        titleEmoji: '💡'
    }
};

export default function ApiModal({ 
    visible, 
    onClose, 
    type, 
    title, 
    message, 
    buttonText = 'Close' 
}: ApiModalProps) {
    const config = modalConfig[type];

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 px-4">
                <View className="bg-white rounded-3xl p-8 items-center w-full max-w-sm"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.25,
                        shadowRadius: 16,
                        elevation: 16,
                        borderWidth: 3,
                        borderColor: config.borderColor,
                        borderBottomWidth: 6,
                        borderRightWidth: 6,
                    }}
                >
                    <View className={`${config.backgroundClass} rounded-full p-4 mb-4`}>
                        <MaterialCommunityIcons 
                            name={config.icon} 
                            size={48} 
                            color={config.iconColor} 
                        />
                    </View>
                    <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
                        {title} {config.titleEmoji}
                    </Text>
                    <Text className="text-base text-gray-600 text-center mb-6 leading-6">
                        {message}
                    </Text>
                    <TouchableOpacity
                        className="bg-[#1CB0F6] px-8 py-4 rounded-2xl w-full"
                        style={{
                            borderWidth: 3,
                            borderColor: '#0891B2',
                            borderBottomWidth: 6,
                            borderRightWidth: 6,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                        onPress={onClose}
                        activeOpacity={0.9}
                    >
                        <Text className="text-white text-base font-bold text-center">
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}