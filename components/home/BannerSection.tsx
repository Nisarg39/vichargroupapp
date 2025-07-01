import { View, Text, ScrollView, Dimensions, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Banner {
    serialNumber: number;
    imageUrl: string;
}

export default function BannerSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [bannerImages, setBannerImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Fallback images in case API fails
    const fallbackImages = [
        require('../../assets/images/vivekSirBanner.png'),
        'https://cdn-icons-png.flaticon.com/256/7139/7139076.png',
        'https://cdn-icons-png.flaticon.com/256/7139/7139076.png'
    ];

    const handlePageChange = (newIndex: number) => {
        if (bannerImages.length === 0) return;
        
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0.7,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        setActiveIndex(newIndex);
        scrollViewRef.current?.scrollTo({
            x: newIndex * (screenWidth - 32),
            animated: true
        });
    };

    async function fetchBanners(){
        try {
            setLoading(true);
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/app/signin/showBanners`,{
                token: 'abc'
            },{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                }
            });
            
            if (response.data.success && response.data.banners && response.data.banners.length > 0) {
                // Sort banners by serialNumber and extract imageUrls
                const sortedBanners = response.data.banners
                    .sort((a: Banner, b: Banner) => a.serialNumber - b.serialNumber)
                    .map((banner: Banner) => banner.imageUrl);
                
                setBannerImages(sortedBanners);
                setActiveIndex(0); // Reset to first image
                // console.log('Fetched banners:', sortedBanners);
            } else {
                // Use fallback images if API doesn't return banners
                setBannerImages(fallbackImages.map(img => typeof img === 'string' ? img : ''));
                console.log('No banners from API, using fallback images');
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
            // Use fallback images on error
            setBannerImages(fallbackImages.map(img => typeof img === 'string' ? img : ''));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (bannerImages.length === 0) return;
        
        const interval = setInterval(() => {
            const newIndex = activeIndex === bannerImages.length - 1 ? 0 : activeIndex + 1;
            handlePageChange(newIndex);
        }, 3000);
        return () => clearInterval(interval);
    }, [activeIndex, bannerImages.length]);

    useEffect(() => {
        fetchBanners();
    }, []);

    // Don't render anything while loading or if no images
    if (loading || bannerImages.length === 0) {
        return (
            <View style={[styles.outerContainer, styles.loadingContainer]}>
                <Text style={styles.loadingText}>Loading banners...</Text>
            </View>
        );
    }

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(event.nativeEvent.contentOffset.x / (screenWidth - 32));
                        setActiveIndex(newIndex);
                    }}
                    style={styles.scrollView}
                >
                    {bannerImages.map((imageUrl, index) => (
                        <TouchableOpacity 
                            key={index}
                            activeOpacity={0.9}
                            onPress={() => handlePageChange(index)}
                            style={styles.buttonContainer}
                        >
                            <View style={styles.buttonInner}>
                                <Animated.Image
                                    source={{ uri: imageUrl }}
                                    style={[styles.banner, { opacity: fadeAnim }]}
                                    onError={(error) => {
                                        console.log('Image load error for:', imageUrl, error.nativeEvent.error);
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.paginationContainer}>
                    <View style={styles.pagination}>
                        {bannerImages.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handlePageChange(index)}
                            >
                                <Animated.View
                                    style={[
                                        styles.dot,
                                        index === activeIndex && styles.activeDot
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const bannerHeight = Math.min(screenHeight * 0.25, 200);

const styles = StyleSheet.create({
    outerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        width: '100%',
    },
    container: {
        position: 'relative',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 20,
        height: bannerHeight,
        overflow: 'hidden',
    },
    scrollView: {
        flex: 1,
    },
    banner: {
        width: screenWidth - 32,
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 20,
    },
    buttonContainer: {
        width: screenWidth - 32,
        height: bannerHeight,
        borderRadius: 20,
        backgroundColor: 'black',
        shadowColor: '#45A700',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 8,
        transform: [{ translateY: 0 }],
    },
    buttonInner: {
        height: '100%',
        transform: [{ translateY: -8 }],
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: '#999999',
        transform: [{ scale: 0.9 }],
    },
    activeDot: {
        backgroundColor: '#1CB0F6',
        transform: [{ scale: 1.2 }],
        shadowColor: '#58CC02',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: bannerHeight,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
});