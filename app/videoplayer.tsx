import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View, 
  Alert, 
  TouchableOpacity, 
  Dimensions, Text, 
  SafeAreaView as RNSafeAreaView, 
  StyleSheet, 
  BackHandler ,
  Platform,
  StatusBar,
  Animated as RNAnimated,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ScreenOrientation from 'expo-screen-orientation';
// import Slider from 'expo-slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenCapture from 'expo-screen-capture';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const CompactSlider = ({ 
  value, 
  maximumValue, 
  onValueChange, 
  minimumTrackTintColor = "#1d77bc",
  maximumTrackTintColor = "rgba(255,255,255,0.3)",
  thumbTintColor = "#FFFFFF",
  formatTime,
}: any) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const progressPercentage = maximumValue > 0 ? (value / maximumValue) * 100 : 0;

  // Update translateX when value changes externally
  useEffect(() => {
    if (!isDragging.value && sliderWidth > 0) {
      translateX.value = (progressPercentage / 100) * sliderWidth;
    }
  }, [progressPercentage, sliderWidth]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, context: any) => {
      isDragging.value = true;
      // Calculate the position within the slider
      const locationX = event.x;
      translateX.value = Math.max(0, Math.min(locationX, sliderWidth));
      
      // Update the value immediately
      const newValue = (locationX / sliderWidth) * maximumValue;
      runOnJS(onValueChange)(Math.max(0, Math.min(newValue, maximumValue)));
      
      context.startX = translateX.value;
    },
    onActive: (event, context: any) => {
      const newX = Math.max(0, Math.min(context.startX + event.translationX, sliderWidth));
      translateX.value = newX;
      
      // Calculate and update value
      const newValue = (newX / sliderWidth) * maximumValue;
      runOnJS(onValueChange)(Math.max(0, Math.min(newValue, maximumValue)));
    },
    onEnd: () => {
      isDragging.value = false;
    },
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value - 8 }], // Center the 16px thumb
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    const width = sliderWidth > 0 ? (translateX.value / sliderWidth) * 100 : progressPercentage;
    return {
      width: `${Math.max(0, Math.min(width, 100))}%`,
    };
  });

  return (
    <View
      style={{
        height: 40,
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
      }}
      onLayout={(event) => {
        const width = event.nativeEvent.layout.width;
        setSliderWidth(width);
        if (width > 0) {
          translateX.value = (progressPercentage / 100) * width;
        }
      }}
    >
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={{ height: 40, justifyContent: 'center', width: '100%' }}>
          {/* Track */}
          <View style={{
            height: 4,
            backgroundColor: maximumTrackTintColor,
            borderRadius: 2,
            width: '100%',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 2,
          }}>
            <Animated.View style={[{
              height: 4,
              backgroundColor: minimumTrackTintColor,
              borderRadius: 2,
            }, progressAnimatedStyle]} />
          </View>
          
          {/* Thumb */}
          <Animated.View style={[
            {
              position: 'absolute',
              top: 8,
              width: 24,
              height: 24,
              backgroundColor: thumbTintColor,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 3,
              elevation: 3,
              zIndex: 10,
              borderWidth: 2,
              borderColor: isDragging.value ? '#1d77bc' : 'white',
            }, 
            thumbAnimatedStyle
          ]}>
            {isDragging.value && (
              <Animated.View style={[
                {
                  position: 'absolute',
                  top: 0,
                  left: translateX.value - 24,
                  width: 48,
                  alignItems: 'center',
                  zIndex: 20,
                }
              ]}>
                <View style={{
                  backgroundColor: '#1d77bc',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                  marginBottom: 2,
                }}>
                  <Text style={{ color: 'white', fontSize: 12 }}>
                    {formatTime((translateX.value / sliderWidth) * maximumValue)}
                  </Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const EndScreen = ({ onRestart }: { onRestart: () => void }) => (
  <View className="absolute top-0 left-0 right-0 bottom-0 bg-black z-30 justify-center items-center">
    <TouchableOpacity 
      onPress={onRestart}
      className="bg-[rgba(29,119,188,0.8)] rounded-full p-6"
    >
      <Icon name="replay" size={48} color="white" />
    </TouchableOpacity>
  </View>
);

export default function Videoplayer() {
  const [playing, setPlaying] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true); // Start in fullscreen mode
  const [isLoading, setIsLoading] = useState(true);  
  const router = useRouter();
  const { videoUrl } = useLocalSearchParams();

  const youtubeUrl = Array.isArray(videoUrl) ? videoUrl[0] : videoUrl || '';

  const [isBuffering, setIsBuffering] = useState(false);

  // console.log(videoUrl);
  
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<number | null>(null);
  const controlsTimeout = useRef<number | null>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const scaleAnim = useRef(new RNAnimated.Value(1)).current;

  // Set initial orientation to landscape when component mounts
  useEffect(() => {
    const setupInitialOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    
    setupInitialOrientation();
    const dimensionsListener = Dimensions.addEventListener('change', updateDimensions);
    
    // Handle back button press in Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullscreen) {
        toggleFullscreen();
        return true; // Prevent default behavior
      }
      return false; // Let default behavior happen (exit app)
    });
    
    return () => {
      ScreenOrientation.unlockAsync();
      dimensionsListener.remove();
      backHandler.remove();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [isFullscreen]);

  // Add this effect specifically for mobile devices
  useEffect(() => {
    if (!isTablet) {
      const handleMobileOrientationChange = () => {
        // Force recalculation of player dimensions
        const playerDims = getPlayerDimensions();
        // You might need to set these to state variables if you want to trigger re-render
        setVideoReady(false);
        setTimeout(() => {
          setVideoReady(true);
        }, 100);
      };
      
      const dimensionsListener = Dimensions.addEventListener('change', handleMobileOrientationChange);
      
      return () => {
        dimensionsListener.remove();
      };
    }
  }, [isTablet]);  // Hide the status bar when component mounts
  useEffect(() => {
    StatusBar.setHidden(true);
    
    return () => {
      // Show the status bar again when component unmounts
      StatusBar.setHidden(false);
    };
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setIsFullscreen(false);
      // Navigate back to previous screen when exiting fullscreen
      router.back();
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    if (playing && videoReady) {
      progressInterval.current = setInterval(() => {
        playerRef.current?.getCurrentTime().then((time: number) => {
          setCurrentTime(time);
        });
        
        playerRef.current?.getDuration().then((duration: number) => {
          if (duration && duration > 0) {
            setDuration(duration);
          }
        });
      }, 1000);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [playing, videoReady]);

  useEffect(() => {
    if (controlsVisible) {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      controlsTimeout.current = setTimeout(() => {
        setControlsVisible(false);
      }, 5000);
    }
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [controlsVisible]);
  
  const updateDimensions = (): void => {
    setVideoReady(false);
    setTimeout(() => setVideoReady(true), 100);
  };

  const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeVideoId(youtubeUrl);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
      setVideoEnded(true);
      setControlsVisible(false);
    } else if (state === "paused") {
      setControlsVisible(true);
    } else if (state === "buffering") {
      setIsBuffering(true);
    } else if (state === "playing") {
      setIsBuffering(false);
      setVideoEnded(false);
    }
  }, []);
  
  const onReady = useCallback(() => {
    // Set a delay before showing the video
    setTimeout(() => {
      setIsLoading(false);
      setVideoReady(true);
      setVideoEnded(false);
    }, 1500); // 1.5 second delay
    
    const getDurationWithRetry = (attempts: number = 3) => {
      playerRef.current?.getDuration()
        .then((duration: number) => {
          if (duration && duration > 0) {
            setDuration(duration);
          } else if (attempts > 0) {
            setTimeout(() => getDurationWithRetry(attempts - 1), 1000);
          }
        })
        .catch((error: Error) => {
          console.error("Error getting duration:", error);
          if (attempts > 0) {
            setTimeout(() => getDurationWithRetry(attempts - 1), 1000);
          }
        });
    };
    
    getDurationWithRetry();
  }, []);
  const seekBackward = () => {
    playerRef.current?.getCurrentTime().then((currentTime: number) => {
      playerRef.current?.seekTo(Math.max(currentTime - 10, 0), true);
    });
  };

  const seekForward = () => {
    playerRef.current?.getCurrentTime().then((currentTime: number) => {
      playerRef.current?.seekTo(currentTime + 10, true);
    });
  };

  const onSliderValueChange = (value: number) => {
    // Prevent seeking to the very end (leave 1-2 seconds buffer)
    const maxSeekPosition = Math.max(duration - 2, 0);
    const seekPosition = Math.min(value, maxSeekPosition);
    
    playerRef.current?.seekTo(seekPosition, true);
    setCurrentTime(seekPosition);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const showControls = () => {
    setControlsVisible(true);
  };

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      setDuration(0);
      setCurrentTime(0);
    }
  }, [videoId]);

  // Calculate player dimensions to maintain aspect ratio without cropping
const getPlayerDimensions = () => {
  if (isTablet) {
    // Tablet dimensions remain the same as before
    if (isFullscreen) {
      const maxHeight = screenHeight;
      const maxWidth = screenWidth;
      
      const heightBasedOnWidth = maxWidth * 9/16;
      const widthBasedOnHeight = maxHeight * 16/9;
      
      if (heightBasedOnWidth <= maxHeight) {
        return {
          width: maxWidth,
          height: heightBasedOnWidth
        };
      } else {
        return {
          width: widthBasedOnHeight,
          height: maxHeight
        };
      }
    } else {
      const containerWidth = Math.min(screenWidth * 0.9, 800);
      return {
        width: containerWidth,
        height: containerWidth * 9/16
      };
    }
  } else {
    // For phones - special handling to prevent cropping
    if (isFullscreen) {
      // In fullscreen on phones, ensure video fits within screen
      const maxHeight = screenHeight;
      const maxWidth = screenWidth;
      
      // Calculate dimensions that fit within the screen while maintaining aspect ratio
      const heightBasedOnWidth = maxWidth * 9/16;
      const widthBasedOnHeight = maxHeight * 16/9;
      
      if (heightBasedOnWidth <= maxHeight) {
        // If calculated height fits, use full width
        return {
          width: maxWidth,
          height: heightBasedOnWidth
        };
      } else {
        // If calculated height is too large, use full height and calculate width
        return {
          width: widthBasedOnHeight,
          height: maxHeight
        };
      }
    } else {
      // For non-fullscreen on phones
      return {
        width: screenWidth,
        height: screenWidth * 9/16
      };
    }
  }
};
const playerDimensions = getPlayerDimensions();
const playerWidth = playerDimensions.width;
const playerHeight = playerDimensions.height;
  // Add a new state to track device type
  const [isTablet, setIsTablet] = useState(false);

  // Add a function to determine device type
  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    const aspectRatio = width / height;
    
    // Common tablet aspect ratios and screen sizes
    const isTabletDevice = 
      (width >= 600 || height >= 600) && 
      (aspectRatio > 0.6 && aspectRatio < 1.4);
    
    setIsTablet(isTabletDevice);
  }, []);

// Modify dynamic styles to handle mobile layout properly
const dynamicStyles = StyleSheet.create({
  containerStyle: {
    width: isTablet 
      ? (isFullscreen 
          ? Math.min(screenWidth, screenHeight * 16/9)
          : Math.min(screenWidth * 0.9, 800))
      : (isFullscreen 
          ? (screenHeight * 16/9 > screenWidth ? screenWidth : screenHeight * 16/9)
          : screenWidth),
    height: isTablet 
      ? (isFullscreen
          ? Math.min(screenHeight, screenWidth * 9/16)
          : Math.min(screenHeight * 0.8, 450))
      : (isFullscreen 
          ? (screenWidth * 9/16 > screenHeight ? screenHeight : screenWidth * 9/16)
          : screenWidth * 9/16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    alignSelf: 'center',
    borderRadius: isTablet ? 18 : 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  }
});  useEffect(() => {
    const preventScreenCapture = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };
    
    preventScreenCapture();
    
    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  const handleRestart = useCallback(() => {
    playerRef.current?.seekTo(0, true);
    setVideoEnded(false);
    setPlaying(true);
    setControlsVisible(true);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RNSafeAreaView 
        style={{
          flex: 1, 
          backgroundColor: 'black',
          paddingTop: Platform.OS === 'android' ? 0 : 0,
          paddingHorizontal: isTablet ? 20 : 0,  // Add horizontal padding on tablets
        }}
      >
        <View 
          style={{
            flex: 1,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            // For mobile in landscape, ensure content is centered
            paddingHorizontal: !isTablet && isLandscape() ? 
              Math.max(0, (screenWidth - playerWidth) / 2) : 0
          }}
        >
          <View 
            style={[
              dynamicStyles.containerStyle, 
              {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }
            ]}
          >
            <YoutubePlayer
              ref={playerRef}
              height={playerHeight}
              width={playerWidth}
              play={playing && !isLoading && !videoEnded}
              videoId={videoId}
              onChangeState={onStateChange}
              onReady={onReady}
              onPlaybackQualityChange={(quality: any) => {
                // console.log("Playback Quality Changed:", quality);
              }}
              onError={(error: any) => {
                console.error("YouTube Player Error:", error);
                Alert.alert("Error", "An error occurred while loading the video.");
              }}
              initialPlayerParams={{
                preventFullScreen: true,
                rel: 0,
                modestbranding: 1,
                controls: 0,
                showinfo: 0,
                playsinline: 1,
                iv_load_policy: 0,
                fs: 0,
                autohide: 1,
                autoplay: 1,
                enablejsapi: 1,
                origin: 'https://yourdomain.com',
                preload: true,
                endscreen: 0
              }}
              webViewProps={{
                androidLayerType: 'hardware',
                androidHardwareAccelerationDisabled: false,
                javaScriptEnabled: true,
                domStorageEnabled: true,
                allowsFullscreenVideo: true,
                renderToHardwareTextureAndroid: true,
                cacheEnabled: true,
                cacheMode: 'LOAD_DEFAULT',
                mediaPlaybackRequiresUserAction: false,
                allowsInlineMediaPlayback: true,
                startInLoadingState: true,
                scalesPageToFit: true,
                useWebKit: true,
                onLayout: () => {},
                style: { 
                  opacity: isLoading ? 0 : 1,
                  width: playerWidth,
                  height: playerHeight,
                  maxWidth: '100%',
                  maxHeight: '100%'
                },
              }}
              forceAndroidAutoplay={true}            />            
              {videoEnded && <EndScreen onRestart={handleRestart} />}
              <TouchableOpacity               className="absolute top-0 left-0 right-0 bottom-0 bg-transparent"
              onPress={showControls}
              activeOpacity={1}
            >
              <View 
                className={`absolute top-0 left-0 right-0 bottom-0 bg-transparent z-10 ${
                  (!videoReady || !controlsVisible) && !videoEnded ? 'opacity-0' : ''
                }`}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(29, 119, 188, 0.3)']}
                  className="absolute bottom-0 left-0 right-0 h-[150px]"
                />
                
                <View className="absolute top-0 right-0 flex-row justify-end p-3 z-20">
                  <TouchableOpacity 
                    onPress={() => {
                      Haptics.selectionAsync();
                      toggleFullscreen();
                    }} 
                    className="bg-[rgba(29,119,188,0.5)] rounded-full p-4 mx-2"
                  >
                    <Icon name={isFullscreen ? "fullscreen-exit" : "fullscreen"} size={24} color="white" />
                  </TouchableOpacity>
                </View>
                
                <View className="absolute top-0 left-0 right-0 bottom-0 flex-row justify-center items-center space-x-8">
                  <TouchableOpacity 
                    className="bg-[rgba(29,119,188,0.5)] rounded-full p-2"
                    onPress={() => {
                      Haptics.selectionAsync();
                      seekBackward();
                    }}
                  >
                    <Icon name="replay-10" size={36} color="white" />
                  </TouchableOpacity>
                  <RNAnimated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity 
                      className="bg-[rgba(29,119,188,0.8)] rounded-full w-[60px] h-[60px] justify-center items-center"
                      onPress={() => {
                        RNAnimated.sequence([
                          RNAnimated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
                          RNAnimated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
                        ]).start();
                        setPlaying(!playing);
                      }}
                    >
                      <Icon name={playing ? "pause" : "play-arrow"} size={42} color="white" />
                    </TouchableOpacity>
                  </RNAnimated.View>
                  <TouchableOpacity 
                    className="bg-[rgba(29,119,188,0.5)] rounded-full p-2"
                    onPress={() => {
                      Haptics.selectionAsync();
                      seekForward();
                    }}
                  >
                    <Icon name="forward-10" size={36} color="white" />
                  </TouchableOpacity>
                </View>
                
                <View className="absolute bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.5)] px-4 pb-8 pt-2">
                  <View className="flex-row justify-between px-[5px] mb-2">
                    <Text className="text-white text-xs font-semibold">{formatTime(currentTime)}</Text>
                    <Text className="text-white text-xs font-semibold">{formatTime(duration)}</Text>
                  </View>

                  <CompactSlider
                    value={Math.min(currentTime, duration - 1)}
                    maximumValue={Math.max(duration - 1, 0)}
                    onValueChange={onSliderValueChange}
                    minimumTrackTintColor="#1d77bc"
                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                    thumbTintColor="#FFFFFF"
                    formatTime={formatTime}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {isLoading && <LoadingOverlay />}
        </View>
      </RNSafeAreaView>
    </GestureHandlerRootView>
  );
}
const isLandscape = () => {
  const { width, height } = Dimensions.get('window');
  return width > height;
};

const LoadingOverlay = () => (
  <View className="absolute top-0 left-0 right-0 bottom-0 bg-black z-30 justify-center items-center">
    <View className="bg-[rgba(29,119,188,0.2)] rounded-lg p-6">
      <Text className="text-white text-lg font-bold mb-2">Loading Video</Text>
      <View className="flex-row items-center">
        <View className="h-1 bg-[#1d77bc] w-[100px] rounded-full overflow-hidden">
          <View 
            className="h-full bg-white rounded-full" 
            style={{ 
              width: '30%', 
              transform: [{ translateX: -50 }],
              opacity: 0.8,
              shadowColor: '#fff',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 10,
            }}
          />
        </View>
      </View>
    </View>
  </View>
);