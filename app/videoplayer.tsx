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
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ScreenOrientation from 'expo-screen-orientation';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenCapture from 'expo-screen-capture';

export default function Videoplayer() {
  const [playing, setPlaying] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true); // Start in fullscreen mode
  
  const router = useRouter();
  const { videoUrl } = useLocalSearchParams();

  const youtubeUrl = Array.isArray(videoUrl) ? videoUrl[0] : videoUrl || '';

  const [isBuffering, setIsBuffering] = useState(false);

  // console.log(videoUrl);
  
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<number | null>(null);
  const controlsTimeout = useRef<number | null>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

  // Hide the status bar when component mounts
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
      Alert.alert("video has finished playing!");
    } else if (state === "paused") {
      setControlsVisible(true);
    } else if (state === "buffering") {
      setIsBuffering(true);
    } else if (state === "playing") {
      setIsBuffering(false);
    }
  }, []);
  
  const onReady = useCallback(() => {
    setVideoReady(true);
    setVideoEnded(false);
    
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
    playerRef.current?.seekTo(value, true);
    setCurrentTime(value);
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
      setDuration(0);
      setCurrentTime(0);
    }
  }, [videoId]);

  // Calculate player dimensions to maintain aspect ratio without cropping
  // For landscape fullscreen, use the full height and calculate width to maintain 16:9 ratio
  const playerHeight = isFullscreen ? screenHeight : screenWidth * 9/16;
  const playerWidth = isFullscreen ? (screenHeight * 16/9) : screenWidth;

  // Create dynamic styles for elements that need precise dimensions
  const dynamicStyles = StyleSheet.create({
    containerStyle: isFullscreen ? {
      width: screenWidth,
      height: screenHeight,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    } : {
      height: playerHeight,
      width: playerWidth,
      backgroundColor: '#000',
    }
  });

  useEffect(() => {
    const preventScreenCapture = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };
    
    preventScreenCapture();
    
    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      <RNSafeAreaView style={{
                flex: 1, 
                backgroundColor: 'black',
                paddingTop: Platform.OS === 'android' ? 0 : 0
      }}>
        <View className="flex-1 bg-black items-center justify-center">
          <View 
            className="relative bg-black rounded-lg overflow-hidden"
            style={[dynamicStyles.containerStyle, {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }]}
          >
            <YoutubePlayer
              ref={playerRef}
              height={playerHeight}
              width={playerWidth}
              play={playing}
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
              }}
              forceAndroidAutoplay={true}
            />
            <TouchableOpacity 
              className="absolute top-0 left-0 right-0 bottom-0 bg-transparent"
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
                    onPress={toggleFullscreen} 
                    className="bg-[rgba(29,119,188,0.5)] rounded-full p-2 mx-1"
                  >
                    <Icon name={isFullscreen ? "fullscreen-exit" : "fullscreen"} size={24} color="white" />
                  </TouchableOpacity>
                </View>
                
                <View className="absolute top-0 left-0 right-0 bottom-0 flex-row justify-center items-center space-x-8">
                  <TouchableOpacity 
                    className="bg-[rgba(29,119,188,0.5)] rounded-full p-2"
                    onPress={seekBackward}
                  >
                    <Icon name="replay-10" size={36} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="bg-[rgba(29,119,188,0.8)] rounded-full w-[60px] h-[60px] justify-center items-center"
                    onPress={() => setPlaying(!playing)}
                  >
                    <Icon name={playing ? "pause" : "play-arrow"} size={42} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="bg-[rgba(29,119,188,0.5)] rounded-full p-2"
                    onPress={seekForward}
                  >
                    <Icon name="forward-10" size={36} color="white" />
                  </TouchableOpacity>
                </View>
                
                <View className="absolute bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.5)] px-4 pb-4 pt-2">
                  <View className="flex-row justify-between px-[5px] -mb-2">
                    <Text className="text-white text-xs font-semibold">{formatTime(currentTime)}</Text>
                    <Text className="text-white text-xs font-semibold">{formatTime(duration)}</Text>
                  </View>
                  <Slider
                    style={{width: '100%', height: 40}}
                    minimumValue={0}
                    maximumValue={duration}
                    value={currentTime}
                    onValueChange={onSliderValueChange}
                    minimumTrackTintColor="#1d77bc"
                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                    thumbTintColor="#FFFFFF"
                  />
                </View>
              </View>
              
              {videoEnded && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)] z-20 justify-center items-center">
                  <TouchableOpacity 
                    className="bg-[rgba(29,119,188,0.8)] rounded-full w-[80px] h-[80px] justify-center items-center"
                    onPress={() => {
                      setVideoEnded(false);
                      setPlaying(true);
                      playerRef.current?.seekTo(0, true);
                    }}
                  >
                    <Icon name="replay" size={50} color="white" />
                    <Text className="text-white mt-[5px] text-sm font-bold">Replay</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </RNSafeAreaView>
    </>
  );
}